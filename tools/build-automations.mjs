// Owner-only. Turns the automation capture (export/raw/automations-full.json, read box by box
// from the FUB Automations 2.0 editor, plus export/raw/automation-settings.json) into
// data/automations.json and one rebuild sheet per automation in data/automations/.
// Run from the repo root: node tools/build-automations.mjs
import fs from 'node:fs';

const raw = JSON.parse(fs.readFileSync('export/raw/automations-full.json', 'utf8')).recs;
const settings = JSON.parse(fs.readFileSync('export/raw/automation-settings.json', 'utf8'));
const REREAD = JSON.parse(fs.readFileSync('export/raw/condition-rereads.json', 'utf8')); // slow re-reads of conditions whose lists loaded late
const EMAIL_REREAD = JSON.parse(fs.readFileSync('export/raw/email-rereads.json', 'utf8'));
const EXCLUDE = new Set(['163']); // "Testing for variable payload": the owner's own test, not part of the system

const scrub = s => (s ?? '')
  .replace(/https?:\/\/(www\.)?sellitwitheveritt\.com/gi, '{{WEBSITE}}')
  .replace(/(www\.)?sellitwitheveritt\.com/gi, '{{WEBSITE}}')
  .replace(/Everitt Gill/g, '{{AGENT_NAME}}');
const tok = n => (n.panel ?? '').split(' ⏎ ').map(s => s.trim()).filter(Boolean);
const after = (text) => text.split(' / ').slice(1).join(' / ');

function group(name) {
  if (/KTS|^AP Unsubscribed$/.test(name)) return 'kts';
  if (/^(Y[ _]|REQUESTED_RATE|Y REQUESTED)/.test(name)) return 'ylopo-tags';
  return 'legacy';
}

function trigger(n) {
  const [type, ...rest] = n.text.split(' / ');
  return { type, detail: rest.join(' / ') || null };
}

const CONDITION_NOISE = new Set(['Conditions', 'Either condition is true or false', 'Condition', 'Delete', 'include', 'exclude',
  'include any', 'exclude any', 'was less than', 'was more than', 'is less than', 'is more than', 'is empty', 'is not empty',
  'is good', 'is bad', 'minutes ago', 'hours ago', 'days ago', 'weeks ago', 'months ago', 'years ago', 'is', 'is not']);
function condition(n) {
  // Full rule sentences: canvas lines plus panel lines (the panel holds the ones hidden behind "+ N more").
  const isRule = t => /( any of: .+| more than \d| less than \d| is (good|bad|empty|not empty)$| is in \d|^(Lender|Email|Phone|Open House Address|Source) is )/.test(t);
  const canvas = n.text.split(' / ').slice(1).filter(t => !/^\+ \d+ more$/.test(t));
  const rules = [];
  for (const t of [...canvas, ...tok(n)]) if (isRule(t) && !rules.includes(t)) rules.push(t);
  const empty = canvas.filter(t => /: ?$/.test(t));
  return { kind: 'condition', rules: rules.length ? rules : canvas, incomplete: empty.length ? empty : undefined,
    note: 'Filter: a person who does not match every rule stops here.' };
}

function step(n) {
  const [head] = n.text.split(' / ');
  const d = after(n.text);
  const v = n.values ?? [], c = n.checked ?? [];
  switch (head) {
    case 'Send Email': {
      const parts = d.split(' • ');
      return { kind: 'email', template: v[0] || parts[0] || null, from: parts[1] && parts[1] !== 'CONFIGURE' ? parts[1] : (d === 'CONFIGURE' ? 'NOT CONFIGURED in source' : 'Agent assigned to the contact'),
        recipients: c.find(x => /^Send to/.test(x)) ?? null, delivery: c.find(x => /^Send (immediately|between|during|at)/.test(x)) ?? null };
    }
    case 'Create Task': {
      const [name, type, assign] = d.split(' • ');
      return { kind: 'task', name: scrub(v[0] || name), type: type ?? null, assignTo: assign ?? null };
    }
    case 'Add Note': return { kind: 'note', text: scrub(v[0] || d), notify: tok(n).includes('Agent assigned to the contact') ? 'Agent assigned to the contact' : null };
    case 'Add Tags': return { kind: 'addTags', tags: d.split(/,\s*/) };
    case 'Remove Tags': return { kind: 'removeTags', mode: c[0] ?? null, tags: d === 'All tags' ? [] : d.split(/,\s*/) };
    case 'Change Stage': return { kind: 'changeStage', stage: d.replace(/^(Stage|To):\s*/, '') };
    case 'Run Automation': return { kind: 'runAutomation', automation: (d.match(/"(.+)"/) || [])[1] ?? d, behavior: c[0] ?? null };
    case 'Pause Automations': return /selected/i.test(c[0] ?? '') ? { kind: 'pauseAutomations', which: 'Pause selected automation(s)', automations: d.split(/,\s*(?=\*|AP )/) } : { kind: 'pauseAutomations', which: c[0] ?? d };
    case 'Pause Action Plans': return { kind: 'pauseActionPlans', which: c[0] ?? d };
    case 'Reassign Agent or Lender': return { kind: 'reassign', detail: d, panel: tok(n).slice(2, -1) };
    case 'Add Collaborators': case 'Remove Collaborators': return { kind: head, detail: d };
    default: return { kind: 'other', head, detail: d, panel: tok(n) };
  }
}

function waitOf(n) {
  const [dd = '0', hh = '0', mm = '0'] = n.values ?? [];
  return { kind: 'wait', days: +dd, hours: +hh, minutes: +mm, mode: (n.checked ?? [])[0] ?? 'Wait, then run', label: n.text };
}

const out = [];
for (const a of raw) {
  if (EXCLUDE.has(a.id)) continue;
  const byId = Object.fromEntries(a.nodes.map(n => [n.nid, n]));
  const nextOf = {}; const hasIn = new Set();
  for (const e of a.edges) { (nextOf[e.s] ||= []).push(e.t); hasIn.add(e.t); }
  const triggers = a.nodes.filter(n => n.type === 'trigger');
  // Walk the single chain that starts where the triggers meet.
  let cur = triggers.length ? (nextOf[triggers[0].nid] || [])[0] : a.nodes.find(n => !hasIn.has(n.nid) && n.type !== 'trigger')?.nid;
  const steps = []; const seen = new Set(); let branches = false;
  while (cur && !seen.has(cur)) {
    seen.add(cur); const n = byId[cur]; if (!n) break;
    if (n.type === 'delay') steps.push(waitOf(n));
    else if (n.type === 'condition') { const c = condition(n); if (REREAD[a.id]) { c.rules = REREAD[a.id]; delete c.incomplete; } steps.push(c); }
    else if (n.type === 'action') { if (EMAIL_REREAD[a.id + ':' + n.nid]) n.checked = EMAIL_REREAD[a.id + ':' + n.nid]; steps.push(step(n)); }
    const nx = nextOf[cur] || []; if (nx.length > 1) branches = true; cur = nx[0];
  }
  const counted = a.nodes.filter(n => !['trigger', 'placeholder'].includes(n.type)).length;
  out.push({
    sourceId: +a.id, name: a.name, group: group(a.name), statusInSource: a.status,
    repeat: settings[a.id]?.repeat ?? null, pauseWhenLeadResponds: settings[a.id]?.pauseOnReply ?? null,
    triggers: triggers.map(trigger), steps,
    check: { boxesInSource: counted, stepsCaptured: steps.length, branches },
  });
}

// Owner decision (2026-11-19): a drip that starts pauses only the OTHER KTS drips, never the yearly
// Birthday / Home Anniversary drips. The source paused all automations at this point.
const KEEP_RUNNING = ['*KTS AP Happy Birthday', '*KTS AP Happy Birthday - Relationship', '*KTS AP Home Anniversary', '*KTS AP Home Anniversary - Agnostic'];
const isDrip = x => x.group === 'kts' && /^\*KTS AP /.test(x.name) && x.steps.some(s => s.kind === 'email' || s.kind === 'task');
for (const x of out) for (const st of x.steps) {
  if (x.group === 'kts' && st.kind === 'pauseAutomations' && st.which === 'Pause all automations') {
    st.which = 'Pause selected automation(s)';
    st.automations = out.filter(y => isDrip(y) && y.name !== x.name && !KEEP_RUNNING.includes(y.name)).map(y => y.name).sort();
    st.changedFromSource = 'Pause all automations (changed on the owner\'s decision so Birthday and Home Anniversary keep running)';
  }
}

// Sanity: every box captured, no branches.
const bad = out.filter(x => x.check.boxesInSource !== x.check.stepsCaptured || x.check.branches);
// Which automation does each "run automation" step point to (by name), and does it exist?
const names = new Set(out.map(x => x.name));
const danglingRuns = out.flatMap(x => x.steps.filter(s => s.kind === 'runAutomation' && !names.has(s.automation)).map(s => `${x.name} -> ${s.automation}`));

fs.writeFileSync('data/automations.json', JSON.stringify(out, null, 1));

// ---------- per-automation rebuild sheets ----------
const slug = s => s.replace(/^\*/, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();
const dur = w => [w.days && `${w.days} day${w.days === 1 ? '' : 's'}`, w.hours && `${w.hours} hour${w.hours === 1 ? '' : 's'}`, w.minutes && `${w.minutes} min`].filter(Boolean).join(' ') || '0';
const esc = s => String(s ?? '').replace(/\|/g, '/').replace(/\n/g, ' ').replace(/\*/g, '\\*');
fs.rmSync('data/automations', { recursive: true, force: true });
const fileOf = {};
for (const g of ['kts', 'ylopo-tags', 'legacy']) fs.mkdirSync(`data/automations/${g}`, { recursive: true });
const used = {};
for (const x of out) {
  let f = `data/automations/${x.group}/${slug(x.name)}`;
  used[f] = (used[f] || 0) + 1; if (used[f] > 1) f += `-${used[f]}`;
  fileOf[x.sourceId] = f + '.md';
}
for (const x of out) {
  const L = [`# ${x.name.replace(/^\*/, '')}`, '', `Source automation #${x.sourceId} · group: **${x.group}** · status in source: **${x.statusInSource}**`, '',
    '## Settings (gear icon)', '', `- Repeat this automation: **${x.repeat ? 'ON' : 'off'}**`, `- Automatically pause this automation when the lead responds: **${x.pauseWhenLeadResponds ? 'ON' : 'off'}**`, '',
    '## Triggers', '', 'Any one of these starts it:', ''];
  for (const t of x.triggers) L.push(`- **${t.type}**${t.detail ? `: ${esc(t.detail)}` : ''}`);
  L.push('', '## Steps, in order', '', '| # | Step | Details |', '|---|---|---|');
  let i = 0; let pendingWait = null;
  for (const s of x.steps) {
    i++;
    let what = '', det = '';
    switch (s.kind) {
      case 'wait': what = 'Time Delay'; det = `Wait **${dur(s)}**, then run`; break;
      case 'condition': what = 'Conditions (filter)'; det = s.rules.map(esc).join('; '); break;
      case 'email': what = 'Send Email'; det = `Template **${esc(s.template)}** · From: ${esc(s.from)} · ${esc(s.recipients)} · ${esc(s.delivery)}`; break;
      case 'task': what = 'Create Task'; det = `${esc(s.type)}: "${esc(s.name)}" · assign to ${esc(s.assignTo)}`; break;
      case 'note': what = 'Add Note'; det = `"${esc(s.text)}"${s.notify ? ` · notify ${esc(s.notify)}` : ''}`; break;
      case 'addTags': what = 'Add Tags'; det = s.tags.map(esc).join(', '); break;
      case 'removeTags': what = 'Remove Tags'; det = `${esc(s.mode)}: ${s.tags.map(esc).join(', ')}`; break;
      case 'changeStage': what = 'Change Stage'; det = esc(s.stage); break;
      case 'runAutomation': what = 'Run Automation'; det = `**${esc(s.automation)}** · ${esc(s.behavior)}`; break;
      case 'pauseAutomations': what = 'Pause Automations'; det = esc(s.which) + (s.automations ? `: ${s.automations.map(esc).join(', ')}` : '') + (s.changedFromSource ? ` · **changed from source:** ${esc(s.changedFromSource)}` : ''); break;
      case 'pauseActionPlans': what = 'Pause Action Plans'; det = esc(s.which); break;
      default: what = esc(s.head ?? s.kind); det = esc(s.detail);
    }
    L.push(`| ${i} | ${what} | ${det} |`);
  }
  L.push('', `_Check: ${x.check.boxesInSource} boxes in source, ${x.check.stepsCaptured} captured here._`);
  fs.writeFileSync(fileOf[x.sourceId], L.join('\n') + '\n');
}

// ---------- index ----------
const idx = ['# Automations index', '', 'Every automation in the source account, grouped. Build the ones a "Run Automation" step points to', '(the **AP** ones) before the trigger automations that run them.', ''];
for (const g of ['kts', 'ylopo-tags', 'legacy']) {
  const list = out.filter(x => x.group === g).sort((a, b) => a.name.localeCompare(b.name));
  idx.push(`## ${g} (${list.length})`, '', '| Automation | Starts on | Steps | Repeat | Pause on reply |', '|---|---|---|---|---|');
  for (const x of list) idx.push(`| [${esc(x.name.replace(/^\*/, ''))}](${fileOf[x.sourceId].replace('data/automations/', '')}) | ${x.triggers.map(t => esc(t.type + (t.detail ? ': ' + t.detail : ''))).join(' OR ').slice(0, 140)} | ${x.steps.length} | ${x.repeat ? 'ON' : 'off'} | ${x.pauseWhenLeadResponds ? 'ON' : 'off'} |`);
  idx.push('');
}
fs.writeFileSync('data/automations/README.md', idx.join('\n'));

console.log({ automations: out.length, byGroup: Object.fromEntries(['kts', 'ylopo-tags', 'legacy'].map(g => [g, out.filter(x => x.group === g).length])),
  totalSteps: out.reduce((n, x) => n + x.steps.length, 0), mismatches: bad.map(x => `${x.sourceId} ${x.name} ${x.check.boxesInSource}/${x.check.stepsCaptured} br=${x.check.branches}`), danglingRuns,
  otherKinds: [...new Set(out.flatMap(x => x.steps.filter(s => s.kind === 'other').map(s => s.head)))] });

// ---------- prerequisites a new account needs before building ----------
const split = s => s.replace(/^.*?(one of|any of):\s*/, '').split(/,\s*|\s+or\s+/).map(t => t.trim()).filter(Boolean);
const prereq = {};
for (const g of ['kts', 'ylopo-tags', 'legacy']) {
  const P = { personStages: new Set(), dealStages: new Set(), dateFields: new Set(), conditionFields: new Set(), tags: new Set() };
  for (const x of out.filter(a => a.group === g)) {
    for (const t of x.triggers) {
      if (t.type === 'Stage Change') split(t.detail).forEach(s => P.personStages.add(s));
      if (/^Tag /.test(t.type)) split(t.detail).forEach(s => P.tags.add(s));
      if (t.type === 'Deal Stage Change') split(t.detail).forEach(s => P.dealStages.add(s));
      if (t.type === 'Calendar Date') P.dateFields.add(t.detail.replace(/ is in .*/, ''));
    }
    for (const s of x.steps) {
      if (s.kind === 'condition') for (const r of s.rules) {
        if (/^Stage /.test(r)) split(r).forEach(v => P.personStages.add(v));
        else if (/^Tags /.test(r)) split(r).forEach(v => P.tags.add(v));
        else P.conditionFields.add(r.replace(/ (more|less) than.*| is .*/, ''));
      }
      if (s.kind === 'addTags' || s.kind === 'removeTags') s.tags.forEach(t => P.tags.add(t));
      if (s.kind === 'changeStage') P.personStages.add(s.stage);
    }
  }
  prereq[g] = Object.fromEntries(Object.entries(P).map(([k, v]) => [k, [...v].filter(x => !/^\d+$|^\(empty/.test(x)).sort()]));
}
const setupPath = 'data/setup.json';
const setup = fs.existsSync(setupPath) ? JSON.parse(fs.readFileSync(setupPath, 'utf8')) : {};
setup.automationPrerequisites = prereq;
if (fs.existsSync('data/smart-lists.json')) {
  const st = new Set();
  for (const l of JSON.parse(fs.readFileSync('data/smart-lists.json', 'utf8'))) for (const f of l.filters) if (/^Stage /.test(f)) split(f).forEach(x => st.add(x));
  setup.smartListStages = [...st].sort();
}
setup.builtInFields = ['Birthday', 'Created', 'Last Communication', 'Last Activity', 'Email', 'Lender', 'Total Listings Viewed'];
fs.writeFileSync(setupPath, JSON.stringify(setup, null, 1));
console.log('prerequisites (kts):', JSON.stringify(prereq.kts).slice(0, 400));
