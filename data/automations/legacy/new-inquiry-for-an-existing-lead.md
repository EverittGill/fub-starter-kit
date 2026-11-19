# New Inquiry for an existing lead

Source automation #10 · group: **legacy** · status in source: **OFF**

## Settings (gear icon)

- Repeat this automation: **off**
- Automatically pause this automation when the lead responds: **ON**

## Triggers

Any one of these starts it:

- **Manual**

## Steps, in order

| # | Step | Details |
|---|---|---|
| 1 | Create Task | Call: "New Inquiry. Call! If no answer, leave a voicemail and send a text" · assign to Agent assigned to the contact |
| 2 | Send Email | Template **New Inquiry existing lead email 1** · From: Agent assigned to the contact · Send to primary contact only · Send between 8:00 am and 7:00 pm |
| 3 | Time Delay | Wait **1 day**, then run |
| 4 | Create Task | Call: "New inquiry yesterday. Call! If no answer, leave a voicemail and send a text" · assign to Agent assigned to the contact |
| 5 | Time Delay | Wait **1 day**, then run |
| 6 | Create Task | Call: "New Inquiry 2 days ago. Call!" · assign to Agent assigned to the contact |
| 7 | Time Delay | Wait **3 days**, then run |
| 8 | Send Email | Template **New inquiry existing lead email 2** · From: Agent assigned to the contact · Send to primary contact only · Send between 8:00 am and 7:00 pm |
| 9 | Time Delay | Wait **1 day**, then run |
| 10 | Create Task | Call: "New Inquiry last week. Call!" · assign to Agent assigned to the contact |
| 11 | Time Delay | Wait **1 day**, then run |
| 12 | Create Task | Follow Up: "Check/update the stage" · assign to Agent assigned to the contact |

_Check: 12 boxes in source, 12 captured here._
