# Web Inquiry Option 04

Source automation #127 · group: **legacy** · status in source: **OFF**

## Settings (gear icon)

- Repeat this automation: **off**
- Automatically pause this automation when the lead responds: **ON**

## Triggers

Any one of these starts it:

- **Manual**

## Steps, in order

| # | Step | Details |
|---|---|---|
| 1 | Time Delay | Wait **2 days**, then run |
| 2 | Send Email | Template **BKA C04E01** · From: Agent assigned to the contact · Send to primary contact only · Send between 8:00 am and 7:00 pm |
| 3 | Time Delay | Wait **3 days**, then run |
| 4 | Send Email | Template **BKA C04E02** · From: Agent assigned to the contact · Send to primary contact only · Send between 8:00 am and 7:00 pm |
| 5 | Time Delay | Wait **7 days**, then run |
| 6 | Add Note | "Copy and paste this text  Hi! Have any additional listings caught your eye? Let me know if I can help you narrow down what you're looking for. Today is a great day to book a showing! If you’d like to continue receiving text messages from us, please reply with YES. To opt out, reply with STOP. " · notify Agent assigned to the contact |
| 7 | Time Delay | Wait **6 days**, then run |
| 8 | Send Email | Template **BKA C04E04** · From: Agent assigned to the contact · Send to primary contact only · Send between 8:00 am and 7:00 pm |
| 9 | Time Delay | Wait **1 day**, then run |
| 10 | Add Note | "Let our product team know what you thought of this action plan  https://followupboss1.typeform.com/to/PJBXGsyP  -Thanks FUB" |

_Check: 10 boxes in source, 10 captured here._
