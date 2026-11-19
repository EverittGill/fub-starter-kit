# Automations

This page moved. The full, checked rebuild plan is in **[REBUILD.md](REBUILD.md)**, and every
automation has its own sheet in **[data/automations/](../data/automations/README.md)**.

## Lead flow (which plan a new lead gets)

New-lead plans are started by **Admin → Lead Flow**, not by a trigger automation. In the source
account these plans were attached to lead sources:

| Plan / worker | Typical source |
|---|---|
| Branded Website - New Form | Your website form |
| Branded Website - Realtor.com | Realtor.com |
| New Buyer Lead - delayed text | Default buyer source |
| New Seller Lead - Cash Offer | Cash-offer / seller sources |
| New Ylopo Direct Connect | Ylopo |
| Automated Valuation Engagement - Ylopo | Ylopo home valuation |

Point each of your own lead sources at the plan or worker that fits.
