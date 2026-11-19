# Buyer New Lead Website Registration

Source automation #122 · group: **legacy** · status in source: **OFF**

## Settings (gear icon)

- Repeat this automation: **off**
- Automatically pause this automation when the lead responds: **ON**

## Triggers

Any one of these starts it:

- **Manual**

## Steps, in order

| # | Step | Details |
|---|---|---|
| 1 | Create Task | Follow Up: "Follow Up" · assign to Agent assigned to the contact |
| 2 | Time Delay | Wait **2 days**, then run |
| 3 | Send Email | Template **House Hunting** · From: Agent assigned to the contact · Send to primary contact only · Send between 8:00 am and 7:00 pm |
| 4 | Time Delay | Wait **4 days**, then run |
| 5 | Send Email | Template **Home Search** · From: Agent assigned to the contact · Send to primary contact only · Send between 8:00 am and 7:00 pm |
| 6 | Time Delay | Wait **5 days**, then run |
| 7 | Send Email | Template **Few Questions** · From: Agent assigned to the contact · Send to primary contact only · Send between 8:00 am and 7:00 pm |
| 8 | Time Delay | Wait **8 days**, then run |
| 9 | Send Email | Template **Not Going To Sell You** · From: Agent assigned to the contact · Send to primary contact only · Send between 8:00 am and 7:00 pm |

_Check: 9 boxes in source, 9 captured here._
