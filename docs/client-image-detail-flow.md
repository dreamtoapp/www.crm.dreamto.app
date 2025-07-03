# Client Image Detail Page: Logic & Flow Reference

## Overview
This document describes the logic, flow, and data model for the `/client/[clientId]/image/[imageId]` page in the CRM system. It serves as a reference for development, debugging, and onboarding.

---

## 1. Route & Purpose
- **Route:** `/client/[clientId]/image/[imageId]`
- **Purpose:** Allows a client to view a specific design image, see its status, provide feedback, request revisions, approve/reject, and comment.

---

## 2. Data Fetching & Server Logic
- Fetches the client by `identifier` and ensures role is `CLIENT`.
- Fetches the image by `id` and `clientId`, including:
  - Uploader (designer)
  - Design type
  - Comments (with author info)
- Fetches the count of revision requests for this image.
- Fetches the max allowed revision requests from the settings API.

---

## 3. UI Structure & Main Components
- **RevisionRulesAgreement**
  - Fetches and displays revision rules from `/api/revision-rules`.
  - Checks if the client has agreed to the rules (`revisionRulesConfirmed` on User).
  - User must agree before taking any action.
- **ImageApprovalActions**
  - Handles approve, reject (with reason), and request revision (with feedback).
  - Actions are only enabled if rules are agreed and revision limit not reached.
  - All actions POST to `/api/images/[imageId]/approval`.
- **ImageComments**
  - Displays all comments for the image.
  - Allows the client to add new comments (POST to `/api/images/[imageId]/comments`).
- **ClientImageActionsSection**
  - Wraps the above two, managing agreement state and passing props.

---

## 4. Permissions & Business Logic
- Only the client (or authorized users) can access this page.
- Actions (approve, request revision) are disabled if:
  - The client has not agreed to revision rules.
  - The client has reached the max allowed revision requests for this image.
- All state changes are reflected in the UI and confirmed with toast notifications.

---

## 5. Data Model (Prisma Schema)

### User
- `id`, `name`, `role` (CLIENT, DESIGNER, ADMIN), `identifier` (unique)
- `revisionRulesConfirmed` (Boolean): tracks if the client agreed to revision rules
- Relations: `images`, `clientImages`, `comments`

### Image
- `id`, `url`, `publicId`, `uploaderId`, `clientId`, `clientName`, `designTypeId`
- `status`: PENDING, APPROVED, REJECTED, REVISION_REQUESTED
- `clientFeedback`, `approvedAt`, `rejectedAt`, `rejectionReason`
- Technical info: `format`, `bytes`, `width`, `height`
- `revisionRequestCount`: number of revision requests made
- Relations: `uploader`, `client`, `designType`, `comments`, `revisionRequests`

### Comment
- `id`, `imageId`, `authorId`, `content`, `createdAt`
- Relations: `image`, `author`

### RevisionRule
- `id`, `text`, `order`, `createdAt`, `updatedAt`
- Used for displaying and enforcing revision rules

### RevisionRequest
- `id`, `imageId`, `clientId`, `designerId`, `feedback`, `status`, `doneAt`, `createdAt`
- Tracks each revision request for an image

### Setting
- `id`, `key`, `value`
- Used for global settings like max allowed revision requests

---

## 6. API Endpoints Used
- `/api/revision-rules` — fetches revision rules
- `/api/users/[clientId]/revision-rules-confirmed` — gets/sets agreement status
- `/api/images/[imageId]/approval` — handles approve/reject/revision actions
- `/api/images/[imageId]/comments` — handles comments
- `/api/settings/max-revision-requests` — gets max allowed revision requests

---

## 7. User Flow Summary
1. **Page Load:** Fetches all necessary data (client, image, comments, revision count, settings).
2. **Revision Rules:** User must read and agree to rules before taking actions.
3. **Actions:**
   - Approve: Confirms approval, updates status.
   - Reject: Requires reason, updates status.
   - Request Revision: Requires feedback, checks limit, updates status.
4. **Comments:** User can add/view comments at any time.
5. **UI/UX:** All actions are confirmed with toasts, and the UI is RTL/Arabic.

---

## 8. Error Handling & Edge Cases
- If the client or image is not found, shows a not found message.
- If the user tries to act without agreeing to rules or after reaching the revision limit, actions are disabled.
- All API errors are caught and surfaced via toast notifications.

---

## 9. Reference for Debugging
- Use this document to trace the flow, data, and permissions if any issues arise with the client image detail page or its actions. 