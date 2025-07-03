# TODO

- [ ] Delete image action is admin-only. Implement delete functionality in the admin dashboard, not in the designer dashboard. 

# TODO: Update Designer Flow for New Revision Request Structure

## Background
The revision request system now uses a dedicated `RevisionRequest` table to track all client update requests for images. Each request has a status (`PENDING` or `DONE`), feedback, and timestamps. The designer must interact with this new structure for marking requests as completed.

---

## Designer Flow: Before
- Designer reviewed the latest feedback directly from the `Image` record (`clientFeedback`).
- No full history of revision requests was available.
- Marking a request as done was not tracked per request.

## Designer Flow: After (New Structure)
- Designer sees a full history of all revision requests for each image (from `RevisionRequest` table).
- Each request can be individually marked as `DONE`.
- The UI updates to reflect which requests are pending and which are completed.
- The client can only submit a new request after the latest is marked as done.

---

## TODOs

### Backend
- [ ] Ensure all new revision requests are created with a valid `designerId`.
- [ ] Add/verify endpoint for designer to mark a request as `DONE` (`PUT /api/revision-requests/[id]`).
- [ ] (Optional) Add endpoint for designer to leave a response or note on each request.

### Frontend
- [ ] Update designer dashboard/page to fetch and display all revision requests for each image.
- [ ] Add UI controls for marking requests as done (and optionally, for leaving a note).
- [ ] Show status badges (PENDING/DONE) and timestamps for each request.
- [ ] Ensure the client cannot submit a new request until the latest is marked as done.
- [ ] Add notifications/toasts for designer actions (success/error).

### Data Migration
- [ ] Clean up any old `RevisionRequest` records with missing or null `designerId`.
- [ ] (Optional) Migrate any feedback from `Image.clientFeedback` to the new table for historical completeness.

---

## Notes
- This new structure improves auditability, transparency, and workflow clarity for both clients and designers.
- All future enhancements (e.g., designer notes, notifications) should build on this structure.

# TODO: Enhance Comment System (Client/Designer/Admin)

## Goals
- Improve UX for all roles (client, designer, admin)
- Support moderation, role badges, and (optionally) threaded replies
- Ensure schema and API support all features

---

## Checklist

### Schema
- [ ] Add `parentId` to `Comment` model for threaded replies (optional)
- [ ] Add `isDeleted` to `Comment` model for soft delete/moderation
- [ ] (Optional) Add `type` field for comment/note/system
- [ ] (Optional) Add `role` field if not always joined with User
- [ ] Run migration and update DB

### Backend
- [ ] Update comment creation endpoint to support parentId, type
- [ ] Add endpoint for deleting (soft delete) comments (admin/author)
- [ ] Add endpoint for fetching comments with threading (if enabled)
- [ ] Add role checks for delete/moderation
- [ ] (Optional) Add notification logic for new comments/replies

### Frontend
- [ ] Show role badges (عميل/مصمم/مشرف) next to each comment
- [ ] (Optional) Implement threaded replies UI (nested view)
- [ ] Add delete button for admin/author (with confirmation)
- [ ] Highlight new/unread comments for the user
- [ ] Improve input UX (auto-focus, loading state, error handling)
- [ ] Show moderation actions for admin (delete/report)
- [ ] (Optional) Add notifications for new comments/replies

### UX/Workflow
- [ ] Client can add comments, see all, and delete own
- [ ] Designer can reply, see all, and delete own
- [ ] Admin can delete any comment, moderate, and leave notes
- [ ] All users see clear role labels and timestamps
- [ ] (Optional) Threaded replies for better discussion context

---

## Notes
- Prioritize role badges and moderation first for clarity and safety
- Threaded replies and notifications are optional but recommended for richer UX
- All changes should be tested for RTL and accessibility 

- [ ] Integrate Pusher for real-time notifications and comment updates (live chat, instant UI refresh) 