# CLAUDE.md — FUB Starter Kit

You are helping a real estate agent set up their own Follow Up Boss (FUB) account with the KTS
system in this repo, and install their Claude Code second brain. They are usually not a
developer. Explain each step in plain sentences, do one step at a time, and confirm before
anything that changes their FUB account.

## When they say "set me up"

1. **Config.** If `config.json` is missing, copy `config.example.json` to it and ask them for each
   value. For the API key, tell them where to create it (FUB → Admin → API → Create API Key) and have
   them paste it into the file themselves. Don't echo the key back in chat.
2. **Dry run.** Run `node tools/import-to-fub.mjs --dry-run` and show them the account name it
   connected to. Make sure it's THEIR account before going on.
3. **Import.** On their yes, run `node tools/import-to-fub.mjs`. It skips anything that already
   exists, so it's safe to run again.
4. **Action plans.** Follow `docs/BUILD-PLANS.md`. Ask which lead sources they actually use first and
   build only those plans. Not every agent needs all 47.
5. **Automations.** Walk through `docs/AUTOMATIONS.md` in their FUB.
6. **Second brain.** Follow `second-brain/README.md`.

## Rules

- Never send an email or text, and never apply a plan to a real contact, unless they say to for that
  specific action. Building plans and templates sends nothing. Applying a plan to a person does.
- `config.json` and `state/` hold their key and account IDs. Never commit them. `.gitignore` covers both.
- FUB's public API can create email templates and stages, but **not** action plans or automations.
  Those are built in the FUB web app (see the docs).
- Rebuilding `data/` from a raw export (`tools/build-data.mjs`) is only for the kit's owner. Agents
  using the kit never need it.
