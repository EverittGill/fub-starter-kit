# Person changed behavior and is active again after 14 days

Source automation #12 · group: **legacy** · status in source: **OFF**

## Settings (gear icon)

- Repeat this automation: **off**
- Automatically pause this automation when the lead responds: **ON**

## Triggers

Any one of these starts it:

- **Manual**

## Steps, in order

| # | Step | Details |
|---|---|---|
| 1 | Send Email | Template **Changed behavior by viewing or saving properties** · From: Agent assigned to the contact · Send to primary contact only · Send between 8:00 am and 7:00 pm |
| 2 | Create Task | Call: "Person is active again! Call now. If there is no answer, leave a voicemail and send a text." · assign to Agent assigned to the contact |
| 3 | Time Delay | Wait **1 day**, then run |
| 4 | Create Task | Text: "Hey, [lead name] I saw you had liked some homes! Can I get more information on those for you?" · assign to Agent assigned to the contact |
| 5 | Time Delay | Wait **1 day**, then run |
| 6 | Create Task | Follow Up: "Check/Update stage" · assign to Agent assigned to the contact |

_Check: 6 boxes in source, 6 captured here._
