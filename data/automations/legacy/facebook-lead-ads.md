# Facebook Lead Ads

Source automation #123 · group: **legacy** · status in source: **OFF**

## Settings (gear icon)

- Repeat this automation: **off**
- Automatically pause this automation when the lead responds: **ON**

## Triggers

Any one of these starts it:

- **Manual**

## Steps, in order

| # | Step | Details |
|---|---|---|
| 1 | Send Email | Template **Facebook Buyer Lead Email 1** · From: Agent assigned to the contact · Send to primary contact only · Send between 8:00 am and 7:00 pm |
| 2 | Time Delay | Wait **1 day**, then run |
| 3 | Send Email | Template **Facebook Buyer Lead Email 2** · From: Agent assigned to the contact · Send to primary contact only · Send between 8:00 am and 7:00 pm |
| 4 | Time Delay | Wait **3 days**, then run |
| 5 | Send Email | Template **Facebook Buyer Lead Email 3** · From: Agent assigned to the contact · Send to primary contact only · Send between 8:00 am and 7:00 pm |
| 6 | Time Delay | Wait **2 days**, then run |
| 7 | Create Task | Call: "Call" · assign to Agent assigned to the contact |
| 8 | Create Task | Text: "Send Text Template: Just Left You a Voicemail" · assign to Agent assigned to the contact |
| 9 | Time Delay | Wait **5 days**, then run |
| 10 | Send Email | Template **Facebook Buyer Lead Email 4** · From: Agent assigned to the contact · Send to primary contact only · Send between 8:00 am and 7:00 pm |

_Check: 10 boxes in source, 10 captured here._
