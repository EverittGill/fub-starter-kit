# Web Inquiry Option 05

Source automation #128 · group: **legacy** · status in source: **OFF**

## Settings (gear icon)

- Repeat this automation: **off**
- Automatically pause this automation when the lead responds: **ON**

## Triggers

Any one of these starts it:

- **Manual**

## Steps, in order

| # | Step | Details |
|---|---|---|
| 1 | Time Delay | Wait **1 day**, then run |
| 2 | Add Note | "If no response or mobile is showing up as bad/ undelivered  Copy and paste the bellow email  Hi %contact_name%, I tried texting you yesterday to see if you needed any help with your house search, but it looks likes I have the wrong number. Let’s touch base on the properties you’re interested in before they’re gone! Please reach out to me at your earliest convenience so we can discuss the ways that I can help you find the perfect home. %agent_name%" · notify Agent assigned to the contact |
| 3 | Time Delay | Wait **1 day**, then run |
| 4 | Send Email | Template **KK C01E01** · From: Agent assigned to the contact · Send to primary contact only · Send between 8:00 am and 7:00 pm |
| 5 | Time Delay | Wait **2 days**, then run |
| 6 | Add Note | "Send a text copy and paste:  Hi,%contact_first_name%! This is %agent_first_name% with %company_name%.  I just wanted to make sure you had my contact info for when you’re ready to discuss your property search. Call or text me at this number at any time. I can’t wait to get started!  If for any reason you would like to stop receiving messages from us, simply reply with "STOP" and I will make sure to remove you from our list. " · notify Agent assigned to the contact |
| 7 | Time Delay | Wait **2 days**, then run |
| 8 | Send Email | Template **KK C01E02** · From: Agent assigned to the contact · Send to primary contact only · Send between 8:00 am and 7:00 pm |
| 9 | Time Delay | Wait **7 days**, then run |
| 10 | Send Email | Template **KK C01E04** · From: Agent assigned to the contact · Send to primary contact only · Send between 8:00 am and 7:00 pm |
| 11 | Time Delay | Wait **1 day**, then run |
| 12 | Add Note | "Let our product team know what you thought of this action plan  https://followupboss1.typeform.com/to/VuImpNJa  -Thanks FUB" |

_Check: 12 boxes in source, 12 captured here._
