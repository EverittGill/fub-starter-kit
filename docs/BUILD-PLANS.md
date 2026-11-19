# Getting the action plans into your FUB

> In the source account these plans run as **automations** (the `*KTS AP …` workers), and that's
> what to rebuild: see [REBUILD.md](REBUILD.md). The classic action plans below contain the same
> steps and are kept as a reference, or for accounts that prefer classic action plans.

FUB doesn't let outside tools create action plans through its API, so there are three ways to do it.
They're listed fastest first.

## Option 1: Kee Technology Services shares them to your account (fastest, most complete)

This is how the original account got them. Kee shares the plans from FUB's shared library, and
they land with every step, email and automation already wired. Ask Kee to share the KTS action plan
and automation set to your FUB account. If they do, you don't need Option 2 or 3. You only need
`config.json` and the import if you want the website placeholders filled in.

## Option 2: Claude builds them in your browser

With the Claude in Chrome extension signed in to your FUB, ask Claude:

> Build the plan in `data/plans/new-buyer-lead.md` in my FUB. Use the email templates the import
> created (`state/template-map.json` maps each step's template to my template ID).

Claude opens **Admin → Action Plans → New** and adds each step in order: wait days, send the named
email, create the task, add the tag. Start with the plans for lead sources you actually get. Check the
first one together before Claude does the rest.

## Option 3: By hand

Each page in `data/plans/` is a checklist. In FUB: **Admin → Action Plans → Create Action Plan**,
name it, then add each row. The wait column counts days *after the previous step*, which is how the FUB
editor counts. The emails already exist in your account after the import and have the same names.

## Which plans matter most

| If you get leads from… | Build these first |
|---|---|
| Zillow / Realtor.com / Trulia | New Zillow, Realtor, Trulia · New Zillow Preferred · Branded Website - Realtor.com |
| Your own website | Branded Website - New Form · New Buyer Lead · New Seller Lead |
| Open houses | New Open House Lead (or the Manual version) |
| Home value requests | New Home Valuation |
| Your sphere and past clients | Sphere Nurture · Post Closing · Happy Birthday · Home Anniversary |
| Leads that went quiet | Nurture Buyer / Seller / Buyer + Seller · Stale · Renter to Future Buyer |
| Active deals | Buyer Active · Buyer Pending · Seller Pre-Listed · Seller Listed · Seller Pending |

Plans with **Ylopo** in the name, or that use `Y_` tags, only make sense if you use Ylopo.
