// Turns the raw FUB export (export/raw) into the clean, shareable data/ folder.
// Run from the repo root: node tools/build-data.mjs
import fs from 'node:fs';
const RAW = 'export/raw', OUT = 'data';
fs.mkdirSync(`${OUT}/plans`, { recursive: true });
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const emails = read(`${RAW}/email-templates.json`);
const stages = read(`${RAW}/stages.json`).stages;
const stageName = Object.fromEntries(stages.map(s => [s.id, s.name]));
const plans = fs.readdirSync(`${RAW}/plans`).map(f => read(`${RAW}/plans/${f}`))
  .filter(p => p.sharedBy === 'Kee Technology' || /^\*KTS/.test(p.name))
  .sort((a, b) => a.id - b.id);

// Owner-specific details become placeholders the importer fills in.
const scrub = s => (s ?? '')
  .replace(/https?:\/\/(www\.)?sellitwitheveritt\.com/gi, '{{WEBSITE}}')
  .replace(/(www\.)?sellitwitheveritt\.com/gi, '{{WEBSITE}}')
  .replace(/\{\{WEBSITE\}\}\/team\/everitt-gill/g, '{{ABOUT_ME_URL}}')
  .replace(/https:\/\/www\.google\.com\/maps\/place\/Everitt\+Gill[^"\\]*/g, '{{GOOGLE_REVIEWS_URL}}')
  .replace(/Salt Harbor Real Estate Company/g, '{{BROKERAGE}}');

const emailById = Object.fromEntries(emails.map(e => [e.id, e]));
const used = new Set();
for (const p of plans) for (const s of p.steps) if (s.emailTemplateId) used.add(s.emailTemplateId);
for (const e of emails) if (/^\*KTS/.test(e.name)) used.add(e.id);

const outEmails = [...used].sort((a, b) => a - b).map(id => emailById[id]).filter(Boolean)
  .map(e => ({ key: e.id, name: e.name, subject: scrub(e.subject), body: scrub(e.body) }));
const missing = [...used].filter(id => !emailById[id]);

const outPlans = plans.map(p => ({
  key: p.id, name: p.name,
  stopOnContacted: p.stopOnContacted, delaySmsMinutes: p.delaySmsMinutes,
  initialTextMessageEnabled: p.initialTextMessageEnabled,
  initialTextMessage: scrub(p.initialTextMessage),
  usedByLeadFlowInOriginal: (p.leadFlowIds || []).length > 0,
  steps: p.steps.sort((a, b) => a.position - b.position).map(s => {
    const o = { position: s.position, runAfterDays: s.runAfterDays, action: s.action };
    if (s.emailTemplateId) { o.emailTemplateKey = s.emailTemplateId; o.emailTemplateName = emailById[s.emailTemplateId]?.name ?? '(missing)'; }
    if (s.taskName) o.taskName = scrub(s.taskName);
    if (s.taskType) o.taskType = s.taskType;
    if (s.tags?.length) o.tags = s.tags;
    if (s.stageId) o.stage = stageName[s.stageId] ?? `stage ${s.stageId}`;
    if (s.noteDesc) o.note = scrub(s.noteDesc);
    if (s.stopActionPlanId) o.stopPlanKey = s.stopActionPlanId;
    return o;
  }),
}));

// Human build sheet per plan, for building it by hand in FUB.
const day = s => s.runAfterDays === 0 ? 'same day' : `${s.runAfterDays} day${s.runAfterDays === 1 ? '' : 's'} later`;
for (const p of outPlans) {
  const lines = [`# ${p.name.replace(/^\*/, "")}`, '', `Steps: ${p.steps.length} · Stop when contacted: ${p.stopOnContacted ? 'yes' : 'no'}`];
  if (p.initialTextMessageEnabled) lines.push('', '**Initial text (sent when the plan starts):**', '', `> ${p.initialTextMessage.replace(/\n/g, '\n> ')}`);
  lines.push('', '| # | Wait after previous step | Action | Detail |', '|---|---|---|---|');
  for (const s of p.steps) {
    const d = s.emailTemplateName ? `Email: **${s.emailTemplateName.replace(/\*/g, "\\*")}**`
      : s.taskName ? `${s.taskType ?? 'Task'}: ${s.taskName}`
      : s.tags ? `Tags: ${s.tags.join(', ')}` : s.stage ? `Stage → ${s.stage}`
      : s.note ? `Note: ${s.note.slice(0, 120)}` : s.stopPlanKey ? `Stop plan: ${outPlans.find(x => x.key === s.stopPlanKey)?.name ?? s.stopPlanKey}` : '';
    lines.push(`| ${s.position} | ${day(s)} | ${s.action} | ${d.replace(/\|/g, '/').replace(/\n/g, ' ')} |`);
  }
  const slug = p.name.replace(/^\*KTS AP /, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();
  fs.writeFileSync(`${OUT}/plans/${slug}.md`, lines.join('\n') + '\n');
}

const tags = [...new Set(outPlans.flatMap(p => p.steps.flatMap(s => s.tags ?? [])))].sort();
const planStages = [...new Set(outPlans.flatMap(p => p.steps.map(s => s.stage).filter(Boolean)))];
fs.writeFileSync(`${OUT}/email-templates.json`, JSON.stringify(outEmails, null, 1));
fs.writeFileSync(`${OUT}/action-plans.json`, JSON.stringify(outPlans, null, 1));
fs.writeFileSync(`${OUT}/setup.json`, JSON.stringify({
  stagesUsedByPlans: planStages,
  recommendedStages: stages.filter(s => !/^AA /.test(s.name)).map(s => s.name),
  tagsUsedByPlans: tags,
}, null, 1));
const leftover = JSON.stringify([outEmails, outPlans]).match(/everitt|780.?5602|salt harbor/gi);
console.log({ plans: outPlans.length, steps: outPlans.reduce((n, p) => n + p.steps.length, 0),
  emails: outEmails.length, missingTemplates: missing.length, tags: tags.length, planStages, leftoverPersonal: leftover });
