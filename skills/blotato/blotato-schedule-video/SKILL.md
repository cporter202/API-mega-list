---
name: blotato-schedule-video
description: Schedule a finished short-form video with Blotato and verify the queued post.
---

# Schedule a finished clip

## Copy into Claude or Codex

```text
Use Blotato to schedule one finished clip on my connected Instagram test
account. Ask me for the account handle, my video file or accessible video
URL, and a future date and time with timezone. Use this caption:
"Comment APIQUICKSTART26 and I’ll DM you the API quickstart."

Show me the selected account, video, caption, and exact time with timezone.
Wait for me to confirm. Schedule for that exact future time. If Blotato
cannot use that time, stop. Check the submission status before reporting
the submission ID and whether it is scheduled.
```

## Run and verify

1. List connected accounts and resolve the exact test profile. Confirm the user can publish the clip and convert the future time to ISO 8601 with timezone offset.
2. Show the proposed post and wait for approval. Use the accessible video URL or upload the local file through Blotato's supported upload flow. Ask for a hosted URL if the client cannot upload files.
3. Call `blotato_create_post` with the account, platform-specific video fields, and explicit `scheduledTime`. Stop if the scheduling field is unavailable or the requested time has passed. A missing schedule can publish immediately.
4. Use the returned submission ID with `blotato_get_post_status`. Report success when it reads scheduled. If pending, check status before retrying. If failed, report the returned reason.
5. Confirm the account, clip, and time in the Blotato calendar. Remove the queued post before that time if the clip was for testing only.

[Scheduling docs](https://help.blotato.com/blog/build-social-media-scheduler-n8n-make?ref=chrisl9) · [Blotato MCP guide](https://www.blotato.com/codex?ref=chrisl9)
