# FUB Starter Kit

This kit gives a real estate agent two things:

1. **The Kee Technology Services (KTS) Follow Up Boss system.** It has 47 action plans (884 steps) and the 496 email templates they send, covering new leads, nurture, past clients, birthdays, home anniversaries and listings. Shared with Kee Technology Services' permission.
2. **A blank "second brain" for Claude Code.** It's a memory folder plus two daily commands, `/hey-claude` to start a session and `/see-you-later` to end one, so Claude remembers your business from one day to the next.

You don't need to know how to code. Open this folder in Claude Code and say **"set me up"**. Claude reads `CLAUDE.md` and walks you through each step.

## What's in here

| Folder | What it is |
|---|---|
| `data/email-templates.json` | All 496 email templates. Your website and brokerage are filled in when you import. |
| `data/action-plans.json` | All 47 action plans, step by step, in a form Claude can read |
| `data/plans/*.md` | One page per action plan you can read: the day, the action and which email it sends |
| `data/setup.json` | The stages and tags the plans use |
| `docs/BUILD-PLANS.md` | How to get the action plans into your FUB |
| `docs/AUTOMATIONS.md` | Which FUB automations start which plans |
| `tools/import-to-fub.mjs` | Loads the templates and stages into your FUB |
| `second-brain/` | The blank memory for Claude Code. See `second-brain/README.md`. |

## The short version

1. Get a FUB API key: **Admin → API → Create API Key**.
2. Copy `config.example.json` to `config.json` and fill in your key, website, review link and brokerage. `config.json` never goes into git.
3. Run `node tools/import-to-fub.mjs --dry-run`, check the output, then run it again without `--dry-run`.
4. Build the action plans with `docs/BUILD-PLANS.md`.
5. Turn on the automations with `docs/AUTOMATIONS.md`.
6. Install the second brain with `second-brain/README.md`.

## Before you send anything

- Read the plans for your lead sources first. About a dozen of them are written for **Ylopo** (anything with "Ylopo" or a `Y_` tag in it). If you don't use Ylopo, skip those.
- Some emails link to blog articles at `{your website}/blog/...`. Those links only work if your site has articles with the same addresses. Check them, or remove them from the template.
- Nothing sends until a plan is actually applied to a person. Importing templates sends nothing.
