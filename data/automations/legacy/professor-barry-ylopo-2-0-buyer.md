# Professor Barry Ylopo 2.0 Buyer

Source automation #145 · group: **legacy** · status in source: **OFF**

## Settings (gear icon)

- Repeat this automation: **off**
- Automatically pause this automation when the lead responds: **ON**

## Triggers

Any one of these starts it:

- **Manual**

## Steps, in order

| # | Step | Details |
|---|---|---|
| 1 | Change Stage | Lead |
| 2 | Add Tags | CM-Start, Lead-Day1-15-Audit, Ylopo_Rev_Test |
| 3 | Change Stage | Lead |
| 4 | Send Email | Template **New Drip Campaign Email 1** · From: Agent assigned to the contact · Send to contact and all relationships · Send between 8:00 am and 7:00 pm |
| 5 | Time Delay | Wait **4 days**, then run |
| 6 | Send Email | Template **New Drip Campaign Email 2** · From: Agent assigned to the contact · Send to contact and all relationships · Send between 8:00 am and 7:00 pm |
| 7 | Time Delay | Wait **5 days**, then run |
| 8 | Send Email | Template **New Drip Campaign Email 3** · From: Agent assigned to the contact · Send to contact and all relationships · Send between 8:00 am and 7:00 pm |
| 9 | Time Delay | Wait **6 days**, then run |
| 10 | Send Email | Template **New Drip Campaign Email 4** · From: Agent assigned to the contact · Send to contact and all relationships · Send between 8:00 am and 7:00 pm |
| 11 | Time Delay | Wait **7 days**, then run |
| 12 | Add Note | "@%agent_name%  If this lead is in the ISA HOT, Lead, or Contact stage, we will be moving it to the appropriate pond.  If this stage is  a mistake on your part , just let me know." |
| 13 | Add Tags | PriorityPondCheck, StoragePondCheck |
| 14 | Time Delay | Wait **7 days**, then run |
| 15 | Send Email | Template **archive drip 1-still looking?** · From: Agent assigned to the contact · Send to contact and all relationships · Send between 8:00 am and 7:00 pm |
| 16 | Time Delay | Wait **15 days**, then run |
| 17 | Send Email | Template **Mass Email:  Can we talk?** · From: Agent assigned to the contact · Send to contact and all relationships · Send between 8:00 am and 7:00 pm |
| 18 | Time Delay | Wait **5 days**, then run |
| 19 | Add Tags | LCADrip |
| 20 | Add Note | "The previous tag can be added to automation to start another action plan.  In this case, the tag is LCA drip and there are drip emails that auto fire for 213 days written by Co-Founder of LCA Tristan Ahmada and Ylopo Head Realtor in Residence Barry Jenkins" · notify Agent assigned to the contact |

_Check: 20 boxes in source, 20 captured here._
