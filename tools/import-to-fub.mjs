// Loads the KTS email templates and the stages the plans use into YOUR Follow Up Boss account.
//
//   1. cp config.example.json config.json   and fill it in (your API key, website, etc.)
//   2. node tools/import-to-fub.mjs --dry-run   (shows what it would do, changes nothing)
//   3. node tools/import-to-fub.mjs             (does it)
//
// Safe to run twice: anything that already exists by name is skipped.
// It writes state/template-map.json (old template key -> your new template id), which the
// action-plan build step uses to pick the right email for each step.
import fs from 'node:fs';

const DRY = process.argv.includes('--dry-run');
const cfg = JSON.parse(fs.readFileSync('config.json', 'utf8'));
if (!cfg.fubApiKey || cfg.fubApiKey.startsWith('PASTE')) throw new Error('Put your FUB API key in config.json');

const auth = 'Basic ' + Buffer.from(cfg.fubApiKey + ':').toString('base64');
async function fub(method, path, body) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const r = await fetch('https://api.followupboss.com/v1/' + path, {
      method, headers: { Authorization: auth, 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (r.status === 429) { await new Promise(res => setTimeout(res, 2000 * (attempt + 1))); continue; }
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(`${method} ${path} -> ${r.status} ${JSON.stringify(j).slice(0, 300)}`);
    return j;
  }
  throw new Error(`${method} ${path} kept hitting the rate limit`);
}
async function listAll(path, key) {
  const out = []; let next = '';
  do {
    const j = await fub('GET', `${path}?limit=100${next ? '&next=' + next : ''}`);
    out.push(...(j[key] ?? [])); next = j._metadata?.next ?? '';
  } while (next);
  return out;
}

const fill = s => (s ?? '')
  .replaceAll('{{WEBSITE}}', cfg.website.replace(/\/$/, ''))
  .replaceAll('{{ABOUT_ME_URL}}', cfg.aboutMeUrl || cfg.website)
  .replaceAll('{{GOOGLE_REVIEWS_URL}}', cfg.googleReviewsUrl || cfg.website)
  .replaceAll('{{BROKERAGE}}', cfg.brokerage);

const me = await fub('GET', 'me');
console.log(`Connected to FUB as ${me.name} (account ${me.account})${DRY ? ' — DRY RUN, nothing will change' : ''}`);

// 1. Stages the plans move people into.
const setup = JSON.parse(fs.readFileSync('data/setup.json', 'utf8'));
const haveStages = new Set((await listAll('stages', 'stages')).map(s => s.name));
for (const name of setup.stagesUsedByPlans) {
  if (haveStages.has(name)) { console.log(`stage ok      ${name}`); continue; }
  console.log(`stage create  ${name}`);
  if (!DRY) await fub('POST', 'stages', { name });
}

// 2. Email templates.
fs.mkdirSync('state', { recursive: true });
const mapPath = 'state/template-map.json';
const map = fs.existsSync(mapPath) ? JSON.parse(fs.readFileSync(mapPath, 'utf8')) : {};
const existing = Object.fromEntries((await listAll('templates', 'templates')).map(t => [t.name, t.id]));
const templates = JSON.parse(fs.readFileSync('data/email-templates.json', 'utf8'));
let made = 0, skipped = 0;
for (const t of templates) {
  if (existing[t.name]) { map[t.key] = existing[t.name]; skipped++; continue; }
  if (DRY) { made++; continue; }
  const r = await fub('POST', 'templates', { name: t.name, subject: fill(t.subject), body: fill(t.body) });
  map[t.key] = r.id; made++;
  if (made % 25 === 0) { console.log(`templates created: ${made}`); fs.writeFileSync(mapPath, JSON.stringify(map, null, 1)); }
  await new Promise(res => setTimeout(res, 150));
}
if (!DRY) fs.writeFileSync(mapPath, JSON.stringify(map, null, 1));
console.log(`templates: ${made} ${DRY ? 'would be created' : 'created'}, ${skipped} already there`);

const leftovers = templates.filter(t => /\{\{[A-Z_]+\}\}/.test(fill(t.body))).length;
if (leftovers) console.log(`WARNING: ${leftovers} templates still contain a {{PLACEHOLDER}} — check config.json`);
console.log('\nNext: build the action plans (docs/BUILD-PLANS.md), then the automations (docs/AUTOMATIONS.md).');
