# CLAUDE.md — FUB Starter Kit

You are helping a real estate agent set up their own Follow Up Boss (FUB) account with the KTS
system in this repo, and install their Claude Code second brain. They are usually not a
developer. Explain each step in plain sentences, do one step at a time, and confirm before
anything that changes their FUB account.

## When they say "set me up"

Work through `docs/FRIEND-SETUP.md` alongside the steps below, and tell them which boxes are still open.

1. **Config.** If `config.json` is missing, copy `config.example.json` to it and ask them for each
   value. For the API key, tell them where to create it (FUB → Admin → API → Create API Key) and have
   them paste it into the file themselves. Don't echo the key back in chat.
2. **Dry run.** Run `node tools/import-to-fub.mjs --dry-run` and show them the account name it
   connected to. Make sure it's THEIR account before going on.
3. **Import.** On their yes, run `node tools/import-to-fub.mjs`. It skips anything that already
   exists, so it's safe to run again.
4. **Account setup.** The custom fields and deal pipelines in `docs/REBUILD.md` (by hand, or in Chrome).
5. **Automations.** Follow `docs/REBUILD.md`: workers first, then triggers. Ask which lead sources
   they actually get and build those first. Build each one from its sheet in `data/automations/`,
   then read it back and compare: same trigger, same box count, same gear settings. Leave every
   automation **off**, and switch one on only when they say so.
6. **Lead flow, first texts, smart lists.** `docs/TIMING-REVIEW.md` section 2 and `docs/SMART-LISTS.md`.
7. **Second brain.** Follow `second-brain/README.md`.

## Rules

- Never send an email or text, and never apply a plan to a real contact, unless they say to for that
  specific action. Building plans and templates sends nothing. Applying a plan to a person does.
- `config.json` and `state/` hold their key and account IDs. Never commit them. `.gitignore` covers both.
- The import script creates email templates and person stages through FUB's API. Automations, action
  plans, custom fields and deal pipelines are built in the FUB web app (FUB's API can't create
  automations or action plans, and the kit doesn't touch fields or pipelines through the API).
- When building in Chrome, confirm the account name in the top right is THEIRS before every save.
- Rebuilding `data/` from a raw export (`tools/build-data.mjs`, `tools/build-automations.mjs`) is only
  for the kit's owner. Agents using the kit never need it.
