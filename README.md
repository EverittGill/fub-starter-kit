# FUB Starter Kit

This kit gives a real estate agent two things:

1. **The Kee Technology Services (KTS) Follow Up Boss system, exactly as it runs in the source account.** That's 85 KTS automations (plus 24 Ylopo-tag and 53 older ones), every trigger, filter, wait and email setting, and the 668 email templates they send. It covers new leads, nurture, past clients, birthdays, home anniversaries and listings. Shared with Kee Technology Services' permission.
2. **A blank "second brain" for Claude Code.** It's a memory folder plus two daily commands, `/hey-claude` to start a session and `/see-you-later` to end one, so Claude remembers your business from one day to the next.

You don't need to know how to code. Open this folder in Claude Code and say **"set me up"**. Claude reads `START-HERE.md` and walks you through each step: the files, connecting Claude to your FUB, your second brain, your FUB setup and the rebuild.

**On Lofty instead of Follow Up Boss?** Say "set me up on Lofty". Claude follows `LOFTY.md`: the same second brain, and each KTS drip turned into a Lofty build sheet (`tools/build-lofty.mjs`) with the emails converted to Lofty's variables. Lofty's API can't create templates or Smart Plans, so they're built on Lofty's screens.

## What's in here

| Folder | What it is |
|---|---|
| `START-HERE.md` | Step-by-step instructions for your Claude (Claude reads this) |
| `docs/FRIEND-SETUP.md` | **Start here**: what each agent sets up so the system can actually send |
| `docs/REBUILD.md` | **Start here for automations**: what the system is and the order to rebuild it |
| `docs/TIMING-REVIEW.md` | On/off, lead flow, first texts, timing and overlap: read before switching anything on |
| `docs/SMART-LISTS.md` | The 13 KTS daily call lists (plus 3 Ylopo AI Voice lists), filter by filter |
| `data/automations/` | One rebuild sheet per automation (trigger, filters, every step, gear settings) |
| `data/email-templates.json` | All 668 email templates. Your website and brokerage are filled in when you import. |
| `data/action-plans.json` | All 47 action plans, step by step, in a form Claude can read |
| `data/plans/*.md` | One page per action plan you can read: the day, the action and which email it sends |
| `data/setup.json` | The stages, tags and fields the automations and plans use |
| `docs/BUILD-PLANS.md` | The same drips as classic action plans (reference) |
| `docs/AUTOMATIONS.md` | Lead Flow: which plan each lead source gets |
| `tools/import-to-fub.mjs` | Loads the templates and stages into your FUB |
| `tools/fub-mcp-remove-promo.patch`, `tools/run-fub-mcp.sh` | Clean setup of the FUB connector for Claude |
| `second-brain/` | The blank memory for Claude Code. See `second-brain/README.md`. |

## The short version

1. Get a FUB API key (**Admin → API → Create API Key**) and put it in `~/.fub/followupboss.env` (START-HERE.md, Phase 2).
2. Copy `config.example.json` to `config.json` and fill in your website, review link and brokerage. `config.json` never goes into git.
3. Run `node tools/import-to-fub.mjs --dry-run`, check the output, then run it again without `--dry-run`.
4. Do the one-time account setup in `docs/REBUILD.md` (4 custom fields, 2 deal pipelines).
5. Rebuild the automations in the order `docs/REBUILD.md` gives, and leave them off until tested.
6. Connect lead sources and first texts, and build the smart lists (`docs/TIMING-REVIEW.md`, `docs/SMART-LISTS.md`).
7. Install the second brain with `second-brain/README.md`.

## Before you send anything

- Read the automation sheets for your lead sources first. About a dozen of them are written for **Ylopo** (anything with "Ylopo" or a `Y_` tag in it). If you don't use Ylopo, skip those.
- Some emails link to blog articles at `{your website}/blog/...`. Those links only work if your site has articles with the same addresses. Check them, or remove them from the template.
- Nothing sends until a plan is actually applied to a person. Importing templates sends nothing.
