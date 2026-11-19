// Writes the KTS drips into the FUB-to-Lofty Chrome extension's data folder, so the extension
// uploads the kit's cleaned emails (this agent's website, links and brokerage filled in, and the
// merge fields already swapped for Lofty variables) instead of the copies it shipped with.
//
//   node tools/build-lofty-extension-data.mjs ~/FUB_Lofty_Converter/extension
//
// Needs config.json (website, links, brokerage) and lofty/variable-map.json filled in.
// Steps Lofty has no match for become tasks with plain instructions:
//   stop another plan / pause other plans / change stage  ->  a Follow Up task saying what to do.
import fs from 'node:fs';
import path from 'node:path';

const extDir = process.argv[2];
if (!extDir || !fs.existsSync(path.join(extDir, 'manifest.json'))) {
  console.error('Usage: node tools/build-lofty-extension-data.mjs <path to the extension folder (the one with manifest.json)>');
  process.exit(1);
}
if (!fs.existsSync('config.json')) { console.error('Make config.json first: cp config.example.json config.json, then fill it in.'); process.exit(1); }

const cfg = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const vmap = JSON.parse(fs.readFileSync('lofty/variable-map.json', 'utf8'));
const plans = JSON.parse(fs.readFileSync('data/action-plans.json', 'utf8'));
const templates = JSON.parse(fs.readFileSync('data/email-templates.json', 'utf8'));
const byKey = Object.fromEntries(templates.map(t => [t.key, t]));
const planName = key => plans.find(p => p.key === key)?.name ?? `plan ${key}`;

const fill = s => (s ?? '')
  .replaceAll('{{WEBSITE}}', cfg.website.replace(/\/$/, ''))
  .replaceAll('{{ABOUT_ME_URL}}', cfg.aboutMeUrl || cfg.website)
  .replaceAll('{{GOOGLE_REVIEWS_URL}}', cfg.googleReviewsUrl || cfg.website)
  .replaceAll('{{BROKERAGE}}', cfg.brokerage)
  .replaceAll('{{SELLERS_GUIDE_URL}}', cfg.sellersGuideUrl || cfg.website);
const missing = new Set();
const swap = s => s.replace(/%[a-z_]+%/g, m => {
  const v = vmap[m]?.lofty;
  if (!v) { missing.add(m); return m; }
  return v.startsWith('text:') ? v.slice(5) : v;
});

const KEEP_RUNNING = ['Happy Birthday', 'Happy Birthday - Relationship', 'Home Anniversary', 'Home Anniversary - Agnostic'];
const task = (s, name) => ({ action: 'createTask', position: s.position, runAfterDays: s.runAfterDays, taskType: 'Follow Up', taskName: name });

const usedTemplates = new Set();
const actionPlans = plans.map(p => ({
  id: p.key,
  name: p.name,
  stepCount: p.steps.length,
  steps: p.steps.map(s => {
    switch (s.action) {
      case 'sendEmail': usedTemplates.add(s.emailTemplateKey);
        return { action: 'sendEmail', position: s.position, runAfterDays: s.runAfterDays, emailTemplateId: s.emailTemplateKey };
      case 'addTags': case 'removeTags':
        return { action: s.action, position: s.position, runAfterDays: s.runAfterDays, tags: s.tags };
      case 'createTask':
        return task(s, s.taskName);
      case 'addNote':
        return { action: 'addNote', position: s.position, runAfterDays: s.runAfterDays, noteDesc: s.note };
      case 'stopPlan':
        return task(s, `Pause the Smart Plan "${planName(s.stopPlanKey)}" for this lead`);
      case 'stopOtherPlans':
        return task(s, `Pause this lead's other KTS Smart Plans (leave ${KEEP_RUNNING.join(', ')} running)`);
      case 'changeStage':
        return task(s, `Move this lead to the stage: ${s.stage}`);
      default:
        return task(s, `KTS step "${s.action}" has no Lofty match: check the plan sheet`);
    }
  }),
}));

const tplOut = {};
for (const key of usedTemplates) {
  const t = byKey[key];
  if (!t) { console.error(`Email template ${key} is missing from data/email-templates.json`); process.exit(1); }
  tplOut[key] = { id: key, name: t.name, subject: swap(fill(t.subject)), body: swap(fill(t.body)) };
}
if (missing.size) {
  console.error('These merge fields need a Lofty value in lofty/variable-map.json first:\n  ' + [...missing].join('\n  '));
  process.exit(1);
}
const leftovers = Object.values(tplOut).filter(t => /\{\{[A-Z_]+\}\}/.test(t.subject + t.body)).length;
if (leftovers) { console.error(`${leftovers} emails still contain a {{PLACEHOLDER}}: check config.json`); process.exit(1); }

const meta = { source: 'fub-starter-kit', builtAt: new Date().toISOString(), website: cfg.website, brokerage: cfg.brokerage };
fs.writeFileSync(path.join(extDir, 'data/action-plans.json'), JSON.stringify({ _metadata: meta, actionPlans }, null, 1));
fs.writeFileSync(path.join(extDir, 'data/templates.json'), JSON.stringify({ _metadata: meta, templates: tplOut }, null, 1));
const unconfirmed = Object.entries(vmap).filter(([k, v]) => k.startsWith('%') && v.lofty && !v.confirmed).length;
console.log(`Wrote ${actionPlans.length} plans and ${Object.keys(tplOut).length} emails to ${extDir}/data`);
if (unconfirmed) console.log(`Note: ${unconfirmed} Lofty variables are not yet confirmed in Lofty's variable picker (lofty/variable-map.json).`);
console.log('Reload the extension in chrome://extensions so it picks up the new data.');
