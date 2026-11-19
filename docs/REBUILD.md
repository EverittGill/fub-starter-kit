# Rebuilding the system in a new FUB account

This is the plan for making a new Follow Up Boss account work exactly like the source account:
same triggers, same filters, same waits, same emails and the same settings.

## What the source account has (read on 2026-11-19)

Everything was read box by box from the FUB Automations editor. Every number below was checked
against the source.

| | Count |
|---|---|
| Automations | 162 (plus 1 test automation that's left out) |
| Steps across all automations | 2,601: 1,034 emails, 1,112 waits, 268 tasks, 61 "run automation", 45 add-tag, 10 remove-tag, 21 notes, 15 pause, 6 stage changes, 28 filters, 1 add-collaborator |
| Email templates those steps send | 668 (all in `data/email-templates.json`) |
| Automations switched on in the source | **0**. Every one was off. |

They fall into three groups (`data/automations/README.md` lists every one):

- **kts (85)**: the Kee Technology Services system. Build this.
- **ylopo-tags (24)**: only useful if you use Ylopo. They react to Ylopo's `Y_` tags.
- **legacy (53)**: older FUB, Ylopo and coach drips that came with the account. Optional. Two of
  them (Zillow / Trulia / Realtor.com with text message, Seller Lead Drip) have emails that were
  never set up in the source.

### How the KTS system is put together

KTS works in two layers:

1. **Workers (47 automations named `*KTS AP …`).** Each one is a drip: wait, send an email, wait,
   create a task, and so on. Every worker has only the **Manual** trigger. Trigger
   automations start it with a "Run Automation" step, and FUB then shows a "Run Automation" badge on
   the worker by itself. These 47 match the 47 KTS action plans in `data/action-plans.json`
   step for step: same emails, same order, same day counts (checked automatically).
2. **Triggers (38 automations named `*KTS …` without "AP").** Each one watches for something (a tag,
   a person stage, a deal stage, a date like a birthday, a saved or viewed property) and, if its
   filter passes, runs a worker.

Example, from `data/automations/kts/kts-nurture-buyer-tag.md`: when the tag `Buyer` is added, and
the person's stage is A/B/C, and they don't have the tags past client, sphere or RENTER, run
**\*KTS AP Nurture Buyer** and pause this trigger until the worker finishes.

### Settings that are easy to miss

- **Every email** is sent **from the agent assigned to the contact** and only **between 8:00 am and
  7:00 pm**. 777 emails go **to the contact and all their relationships**; 257 go **to the primary
  contact only**. Each step sheet says which.
- **Gear icon settings** ("Repeat this automation" and "Automatically pause this automation when the
  lead responds") differ from automation to automation. Each sheet lists both. For example, the KTS
  workers have both off, and most new-lead workers pause when the lead responds.
- **Filters are not branches.** A "Conditions" box with no yes/no paths means anyone who doesn't
  match every rule stops there.

## Before you build: set up the account (one time)

The import script does steps 1 and 2. Steps 3 and 4 are by hand, or ask Claude in Chrome.

1. **Person stages** (the script creates any that are missing): Lead, A - Hot 1-3 Months,
   B - Warm 3-6 Months, C - Cold 6+ Months, Active Client, Past Client, Sphere,
   Renter - future buyer, Archive, Trash.
2. **Email templates**: all 668, with your website, review link and brokerage filled in. The script
   keeps the original template names, which are what the step sheets refer to.
3. **Custom fields** (Admin → Custom Fields), spelled exactly like this:
   - `Agnostic Home Anniversary`: date
   - `1st Home Anniversary`: date
   - `Relationship Birthday`: date
   - `Open House Address`: text
   (`Birthday` is built in.)
4. **Deal pipelines** (Admin → Deals), with these stages:
   - **Buyers**: Buyer Contract, Pending (plus Closed if you like)
   - **Sellers**: Pre-Listing, Listed, Pending (plus Closed)

Tags don't need setting up. FUB creates a tag the first time it's used. The full tag list is in
`data/setup.json` under `automationPrerequisites`.

## Build order

Workers must exist before the triggers that run them.

1. **Build the 47 workers** from `data/automations/kts/kts-ap-*.md` (plus `ap-unsubscribed.md`).
   For each: Admin → Automations → Create Automation → name it exactly as the sheet title (keep the `*`) → add the
   Manual trigger → add the steps in order → set the gear icon settings → **Save, and leave it off**.
2. **Build the 38 triggers** from the rest of `data/automations/kts/`. Each "Run Automation" step
   names the worker to pick, and its "Pause … resume when … is complete" choice.
3. **Check each one** against its sheet: same trigger, the same number of boxes (the last line of
   each sheet gives the count), and the same gear settings.
4. **Test** with a fake contact using your own email address: add the trigger tag or stage and
   confirm the first email arrives at the right time.
5. **Switch them on** one at a time, starting with the lead sources you actually get.

Start with what makes money first: the new-lead workers (New Buyer Lead, New Seller Lead,
New Zillow…, New Home Valuation, Branded Website…), then Post Closing, Sphere Nurture, Birthday and
Home Anniversary, then the long nurtures.

## Who does the clicking

FUB has no way to import automations, so they're built in the editor. There are three ways:

- **Kee Technology Services shares the set to the new account.** This is how the source account got
  it. Everything arrives wired, and it takes minutes. Ask Kee first.
- **Claude in Chrome**, signed in to the **new** account, builds one automation at a time from its
  sheet, then reads it back and compares it with the sheet before moving on. It never switches
  anything on.
- **By hand.** The workers are big: the five largest have 81 to 131 boxes each. Budget several
  hours for all 85.

## Files

| File | What it is |
|---|---|
| `data/automations/README.md` | Index of all 162 with trigger, step count and gear settings |
| `data/automations/<group>/*.md` | One rebuild sheet per automation |
| `data/automations.json` | The same data for Claude to read |
| `data/email-templates.json` | The 668 templates (placeholders filled in at import) |
| `data/action-plans.json`, `data/plans/` | The 47 KTS classic action plans (same content as the workers) |
| `data/setup.json` | Stages, tags and fields the automations need |
