# Setup checklist for each agent

What each person needs so the system actually works for them, not just sits in their account.
The automations only send what they're given: no connected email means no emails, and no birthdays
in FUB means no birthday drip.

## Before the session (10 minutes, on their own)

- [ ] **Follow Up Boss**, where they're the owner or an admin, with **Automations 2.0** turned on
      (the account owner does this in Admin → Automations; it can't be undone). Check their plan
      includes automations.
- [ ] **Claude** subscription (Pro or Max) and **Claude Code** installed.
- [ ] **Node.js 18 or newer** installed (the import script needs it).
- [ ] Their **FUB API key**: Admin → API → Create API Key. They keep it to themselves.

## In FUB: make the system able to send

- [ ] **Time zone** set (Admin → Settings). Emails only send 8 am to 7 pm, in that time zone.
- [ ] **Their profile**: name, mobile, company name and photo. The emails fill these in
      (`%sender_name%`, `%company_name%`, `%agent_mobile_phone%`).
- [ ] **Email signature** with their brokerage name, license details as their state and brokerage
      require, and a mailing address.
- [ ] **Email connected** (Gmail or Outlook, Admin → Email), so drips send from their own address and
      replies land in FUB.
- [ ] **Texting set up**: a FUB phone number with text registration finished. Without it the
      first texts on the lead sources won't send.

## In FUB: give the system people to work on

- [ ] **Lead sources connected**: Zillow, Realtor.com, their website forms and IDX. Without IDX
      tracking, "Recent Online Activity" and the saved/viewed property triggers never fire.
- [ ] **Sphere and past clients imported** with the right stage (Sphere, Past Client) and, where
      known, **Birthday**, **1st Home Anniversary** or **Agnostic Home Anniversary** (closing date),
      and **Relationship Birthday**. These dates are what start the yearly drips.
- [ ] **Buyer / Seller tags** on existing leads, and leads sorted into A - Hot, B - Warm, C - Cold.
      The nurture drips start from these.
- [ ] **Deals** for active transactions in the Buyers and Sellers pipelines. The listing, contract
      and pending drips start from deal stages.

## Before switching anything on

- [ ] **Their old automations and action plans reviewed.** Turn off anything that does the same job
      as a KTS drip, or people get two sets of emails.
- [ ] **Templates read through** for their market. Some mention Ylopo, link to blog posts that won't
      exist on their site, or point to an about page and review link. Fix those in FUB.
- [ ] **One test contact** (their own email and phone) put through a new-lead source and one trigger.
      Confirm the first text, the first email and the right day for the second email.
- [ ] Then switch on one lead source and its drips at a time ([TIMING-REVIEW.md](TIMING-REVIEW.md)).

## Rules to keep them out of trouble

- Automatic texts only go to people who asked for information. Every first text already says how to
  stop. Honor "stop" right away.
- Every drip email should offer a way to unsubscribe and show a mailing address (the signature
  covers the address).
- Don't add contacts to drips who never gave you their details (bought lists).

## Claude Code side

- [ ] **Second brain** installed (`second-brain/README.md`). Run `/hey-claude` once to set it up.
- [ ] **Optional: connect Claude to their FUB** with the open-source Follow Up Boss MCP server
      (github.com/mindwear-capitian/followupboss-mcp-server), using **their own** API key. Then
      Claude can read their smart lists, find who to call today and draft follow-ups. It has full
      read and write access to their FUB, so they should approve every change it proposes. Never set
      its `FUB_SYSTEM` values; those are for registered FUB partners only.
