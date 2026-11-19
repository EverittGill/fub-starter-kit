# Automations

FUB Automations 2.0 starts the right plan at the right time. For example, a birthday comes up and
the birthday plan starts, or a deal moves to Pending and the Pending plan starts. FUB's API can't
read or create automations, so they're set up in the web app: **Admin → Automations**.

<!-- AUTOMATIONS-TABLE -->
Read from the source account on 2026-11-19. **Every one of these was switched OFF there**, so turn
each on yourself once its plan is built and checked.

KTS uses two layers. A **trigger automation** watches for something (a tag, a stage, a date) and
starts the matching **AP automation**, which is the action plan migrated into Automations 2.0. When
you build a plan by hand as a classic action plan, the trigger automation should start that plan.

| Trigger automation (create this) | Starts | What triggers it |
|---|---|---|
| KTS Buyer Active | AP Buyer Active | Stage changes to Active Client (buyer) |
| KTS Buyer Pending | AP Buyer Pending | Stage changes to Pending (buyer) |
| KTS Seller Pre-Listing | AP Seller Pre-Listed | Seller is preparing to list |
| KTS Seller Listed | AP Seller Listed | Listing goes live |
| KTS Seller Pending | AP Seller Pending | Stage changes to Pending (seller) |
| KTS Happy Birthday | AP Happy Birthday | Contact's birthday |
| KTS Happy Birthday - Relationship | AP Happy Birthday - Relationship | Birthday of a related contact (spouse or partner) |
| KTS Home Anniversary | AP Home Anniversary | Closing anniversary date |
| KTS Home Anniversary - Agnostic | AP Home Anniversary - Agnostic | Closing anniversary date (no year in the message) |
| KTS New Open House Lead - Manual | AP New Open House Lead - Manual | Open house lead entered by hand |
| KTS New Open House Lead - Manual - Task | AP New Open House Lead - Manual - Task | Same, task only |
| KTS Sphere Nurture | AP Sphere Nurture | Stage or tag `sphere` |
| KTS Post Closing | AP Post Closing | Stage changes to Closed / Past Client |
| KTS Post Closing - Legacy | AP Post Closing - Legacy | Past clients from before you used FUB |
| KTS Stale | AP Stale | Lead goes quiet |
| KTS Renter to Future Buyer | AP Renter to Future Buyer | Stage `Renter - future buyer` or tag `RENTER` |
| KTS Nurture Buyer - stage / - tag | AP Nurture Buyer | Nurture stage, or `Buyer` + `NURTURE` tags |
| KTS Nurture Seller - stage / - tag | AP Nurture Seller | Nurture stage, or `Seller` + `NURTURE` tags |
| KTS Nurture Buyer + Seller - stage / - tag | AP Nurture Buyer + Seller | Both |
| KTS Recent Online Activity | AP Recent Online Activity | Lead is back browsing your site |
| KTS Need to know if buyer, seller, luxury, expired, or fsbo | AP Need to know… | Lead type unknown (creates a task) |
| KTS Pause Action Plans | AP Pause action plans | Lead replies or gets contacted |
| KTS Remove Handraiser tag | AP Remove Handraiser tag | Clean-up |
| KTS Unsubscribed | AP Unsubscribed | Lead unsubscribes |
| *Ylopo only:* KTS Automated Valuation Engagement, Automated Valuation Tag Removal, Ylopo Private Showing, Ylopo Message Sent, Tag Removals - Ylopo, Change Stage to Archive / Warm - Ylopo AI Voice, Day 90 Ylopo AI Voice Complete, Callback Scheduled Ylopo AI Voice, Pause Action Plans - Ylopo, ISA_TRANSFER_UNSUCCESSFUL, and the `Y_…` tag automations | the matching Ylopo plans | Ylopo tags and events |

The "What triggers it" column is worked out from each automation's name and plan. Open the source
automation in FUB to confirm the exact rule before you copy it. The new-lead plans (Zillow, website,
home valuation, cash offer) aren't started by automations. They're started by **Lead Flow**, below.
<!-- /AUTOMATIONS-TABLE -->

## Lead flow (which plan a new lead gets)

In the source account, these plans were attached to lead sources under **Admin → Lead Flow**:

| Plan | Typical source |
|---|---|
| Branded Website - New Form | Your website form |
| Branded Website - Realtor.com | Realtor.com |
| New Buyer Lead - delayed text | Default buyer source |
| New Seller Lead - Cash Offer | Cash-offer / seller sources |
| New Ylopo Direct Connect | Ylopo |
| Automated Valuation Engagement - Ylopo | Ylopo home valuation |

Point each of your own lead sources at the plan that fits.
