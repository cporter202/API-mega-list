# Launch an API demo with Blotato

Use an Instagram professional test profile you control. Keep the live test on that profile and use a second Instagram account to leave the test comments.

## Prepare the Reel

- [ ] Record a short vertical demo of one API call. Have a quickstart URL you control ready.
- [ ] Choose a keyword that is unlikely to occur in unrelated comments. Use the same keyword in your caption, DM trigger, and test comment.
- [ ] Check for existing rules that might match it. Blotato matches keywords as case-insensitive substrings.

## Verify scheduling

- [ ] Run the [scheduling prompt](./README.md#schedule-a-finished-clip). Provide your clip, project caption, test account, and exact future time with timezone.
- [ ] Review and approve the proposed post. Record the submission ID and confirm the calendar shows the intended account and time.
- [ ] Once the clip publishes on the test profile, use the live Reel for the DM setup.

## Verify comment-to-DM

- [ ] Run the [DM prompt](./README.md#set-up-instagram-comment-to-dm). Check the inactive rule for the account, Reel scope, keyword, reply text, and URL.
- [ ] Approve activation on the test profile. Use a second account to post the keyword, check the message or Message Requests, and open the resource link.
- [ ] Post an unrelated comment and verify the rule leaves it alone. Disable the rule after the test.

## If a check fails

| Symptom | Check |
| --- | --- |
| Test account is missing | Verify it is connected in Blotato and returned by the assistant before doing any writes. |
| Submission is pending or failed | Look it up using the submission ID. Read the platform error if it failed and check the calendar before retrying. |
| Reel is missing from the Blotato picker | Confirm it has published. If the picker still cannot select it, use an account-wide trigger only with approval on a dedicated test profile. |
| Keyword comment receives no DM | Confirm the rule is active on the right account, check matching and run history, then check the tester’s Message Requests. |

[Back to API Mega List](../../README.md) · [Official schedule guidance](https://help.blotato.com/blog/build-social-media-scheduler-n8n-make?ref=chrisl9) · [Official DM guidance](https://www.blotato.com/blog/how-to-sell-dm-automation?ref=chrisl9)
