# ENG Edit / CU Aggressive New Internet Registration

Source automation #24 · group: **legacy** · status in source: **OFF**

## Settings (gear icon)

- Repeat this automation: **off**
- Automatically pause this automation when the lead responds: **ON**

## Triggers

Any one of these starts it:

- **Manual**

## Steps, in order

| # | Step | Details |
|---|---|---|
| 1 | Send Email | Template **New Internet Registration EM 1** · From: Agent assigned to the contact · Send to primary contact only · Send between 8:00 am and 7:00 pm |
| 2 | Create Task | Call: "Call 1" · assign to Agent assigned to the contact |
| 3 | Time Delay | Wait **1 day**, then run |
| 4 | Send Email | Template **Did you get my Message?** · From: Agent assigned to the contact · Send to primary contact only · Send between 8:00 am and 7:00 pm |
| 5 | Create Task | Call: "Call 2" · assign to Agent assigned to the contact |
| 6 | Create Task | Text: "Text Day 2 -copy and paste text in note" · assign to Agent assigned to the contact |
| 7 | Add Note | "Hey! Just wanted to make sure you got my message yesterday" · notify Agent assigned to the contact |
| 8 | Time Delay | Wait **1 day**, then run |
| 9 | Send Email | Template **Name ? Used for new and cold leads** · From: Agent assigned to the contact · Send to primary contact only · Send between 8:00 am and 7:00 pm |
| 10 | Create Task | Call: "Call 3" · assign to Agent assigned to the contact |
| 11 | Create Task | Text: "Text Day 3 - copy and paste the text in note" · assign to Agent assigned to the contact |
| 12 | Add Note | "Is this %contact_first_name%?" |
| 13 | Time Delay | Wait **1 day**, then run |
| 14 | Send Email | Template **CU2 - Quick Question** · From: Agent assigned to the contact · Send to primary contact only · Send between 8:00 am and 7:00 pm |
| 15 | Create Task | Call: "Call 4" · assign to Agent assigned to the contact |
| 16 | Create Task | Text: "Text Day 4 - copy and past the text in note" · assign to Agent assigned to the contact |
| 17 | Add Note | "Hey! I send off-market properties (the ones you cant find on the internet) to people who are interested. I just need to know what price/area you are interested in." |
| 18 | Time Delay | Wait **1 day**, then run |
| 19 | Send Email | Template **CU3 - Are you getting my messages?** · From: Agent assigned to the contact · Send to primary contact only · Send between 8:00 am and 7:00 pm |
| 20 | Create Task | Call: "Call 5" · assign to Agent assigned to the contact |
| 21 | Create Task | Text: "Text Day 5 - copy and paste the text in note" · assign to Agent assigned to the contact |
| 22 | Add Note | "Not sure if you are on vacation or out of town, but I haven't heard back from you yet. Are you getting my messages?" |
| 23 | Time Delay | Wait **1 day**, then run |
| 24 | Send Email | Template **CU4 - Pick a scenario** · From: Agent assigned to the contact · Send to primary contact only · Send between 8:00 am and 7:00 pm |
| 25 | Create Task | Call: "Call 6" · assign to Agent assigned to the contact |
| 26 | Time Delay | Wait **1 day**, then run |
| 27 | Send Email | Template **CU5 - Cheap House** · From: Agent assigned to the contact · Send to primary contact only · Send between 8:00 am and 7:00 pm |
| 28 | Create Task | Call: "Call 7" · assign to Agent assigned to the contact |
| 29 | Create Task | Text: "Text Day 7 - copy and paste the text in note" · assign to Agent assigned to the contact |
| 30 | Add Note | "Hey %contact_first_name%, I get alerted when sellers reduce their prices, it usually signals when you can get a great deal. Do you want me to let you know when that happens for the houses you are interested in?" |
| 31 | Time Delay | Wait **1 day**, then run |
| 32 | Send Email | Template **CU6 - Hope I didn't drop the ball** · From: Agent assigned to the contact · Send to primary contact only · Send between 8:00 am and 7:00 pm |
| 33 | Create Task | Call: "Call 8" · assign to Agent assigned to the contact |
| 34 | Create Task | Text: "Text Day 8 - copy and paste the text in note" · assign to Agent assigned to the contact |
| 35 | Add Note | "You win..." |

_Check: 35 boxes in source, 35 captured here._
