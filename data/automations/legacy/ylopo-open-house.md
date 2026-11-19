# Ylopo Open House

Source automation #139 · group: **legacy** · status in source: **OFF**

## Settings (gear icon)

- Repeat this automation: **off**
- Automatically pause this automation when the lead responds: **ON**

## Triggers

Any one of these starts it:

- **Manual**

## Steps, in order

| # | Step | Details |
|---|---|---|
| 1 | Time Delay | Wait **6 days**, then run |
| 2 | Send Email | Template **Ylopo Open House Email 1** · From: Agent assigned to the contact · Send to primary contact only · Send between 8:00 am and 7:00 pm |
| 3 | Time Delay | Wait **2 days**, then run |
| 4 | Create Task | Text: "Text Lead: Hi again, %contact_first_name%! This is %agent_name%. My team has open houses regularly and there are some with another brokerage coming up soon too. Would you like me to email or text a list to you?" · assign to Agent assigned to the contact |
| 5 | Time Delay | Wait **6 days**, then run |
| 6 | Send Email | Template **Ylopo Open House Email 2** · From: Agent assigned to the contact · Send to primary contact only · Send between 8:00 am and 7:00 pm |

_Check: 6 boxes in source, 6 captured here._
