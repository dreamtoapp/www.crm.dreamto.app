# Comment System Enhancement: Deep-Dive Task Checklist & Technical Plan

## Goals
- Deliver a robust, user-friendly comment/chat system for clients, designers, and admins
- Support moderation, role badges, and threaded (nested) replies for rich conversations
- Ensure schema, API, and UI are scalable and maintainable

---

## 1. Schema Changes (Prisma)

### **a. Threaded Replies**
- **Add `parentId` (nullable, self-referencing) to `Comment`**
  - Allows any comment to be a reply to another comment, enabling unlimited nesting (conversation tree).
  - Example:
    | id  | content         | parentId |
    |-----|----------------|----------|
    | 1   | Hello           | null     |
    | 2   | Hi!             | 1        |
    | 3   | Please update   | 2        |
- **Add `parent` and `children` relations**
  - Prisma self-relation with `onDelete: NoAction, onUpdate: NoAction` to avoid cyclic issues.

### **b. Moderation**
- **Add `isDeleted: Boolean @default(false)`**
  - Allows soft-deleting comments for moderation (admin or author can hide a comment without losing history).

### **c. (Optional) Type/Role Fields**
- Add `type` (e.g., comment, system, note) for future extensibility.
- Add `role` if you want to avoid always joining with User for display.

### **d. Migration Notes**
- Run `prisma db push` after schema changes.
- Ensure existing data is compatible (no orphaned replies, etc).

---

## 2. Backend API

### **a. Comment Creation**
- **POST /api/comments**
  - Accepts: `imageId`, `authorId`, `content`, `parentId` (optional)
  - Validates parentId (must belong to same image, must exist)
  - Returns the created comment (with author info)

### **b. Fetching Comments**
- **GET /api/comments?imageId=...**
  - Returns all comments for an image, including parent/child relationships
  - Option 1: Return as a flat array with parentId (frontend builds tree)
  - Option 2: Return as a nested tree (backend builds tree)
  - Include author info (name, role, avatar)

### **c. Deleting/Moderating Comments**
- **DELETE /api/comments/[id]** (or PATCH for soft delete)
  - Only author or admin can delete
  - Sets `isDeleted: true` (soft delete)
  - Replies remain visible, but parent may be marked as deleted

### **d. Role Checks & Security**
- Only allow comment creation for authenticated users
- Only allow delete for author or admin
- (Optional) Add rate limiting or spam protection

### **e. Notifications (Optional)**
- Trigger notifications for new replies (e.g., designer gets notified when client replies)

---

## 3. Frontend

### **a. Display Comments**
- Show all comments for an image, grouped by thread (nested view)
- Each comment shows:
  - Author name, role badge (عميل/مصمم/مشرف), avatar
  - Timestamp (relative or absolute)
  - Content (or 'تم حذف التعليق' if deleted)
  - Reply button (if user can reply)
  - Delete button (if user is author or admin)
- Replies are indented/nested visually under their parent
- (Optional) Show a chat bubble style for better UX

### **b. Add/Reply to Comments**
- Input box for new comments (root or reply)
- When replying, pre-fill or highlight the parent comment
- Auto-focus, loading state, and error handling for input

### **c. Moderation UI**
- Show delete/report actions for admin/author
- Deleted comments show a placeholder ("تم حذف التعليق")
- (Optional) Highlight new/unread comments for the user

### **d. Accessibility & RTL**
- Ensure all UI is accessible (keyboard, screen reader)
- Fully support RTL for Arabic

---

## 4. UX/Workflow

### **a. Client**
- Can add comments, reply to any comment, and delete own comments
- Sees all comments and replies in context

### **b. Designer**
- Can reply to any comment, delete own comments
- Sees all threads, can follow up on client questions

### **c. Admin**
- Can delete (soft delete) any comment
- Can moderate/report inappropriate content
- (Optional) Can leave system notes (type: system)

### **d. Threaded Conversation Example**
- Client: "أريد تعديل على التصميم"
- Designer (reply): "ما هو التعديل المطلوب؟"
- Client (reply to reply): "تغيير اللون إلى الأزرق"
- Designer (reply): "تم التعديل، هل يناسبك الآن؟"

---

## 5. Technical Notes
- Use efficient queries to fetch all comments for an image (with parent/child info)
- Avoid N+1 queries by including author in the initial fetch
- For large threads, consider pagination or lazy loading
- Test all changes for RTL, accessibility, and error states

---

## 6. Testing & QA
- [ ] Unit tests for API endpoints (creation, fetch, delete)
- [ ] Integration tests for frontend (add, reply, delete, display)
- [ ] Manual QA for RTL, accessibility, and edge cases (deep nesting, deleted parents)

---

## 7. Rollout & Migration
- [ ] Migrate existing comments (set parentId: null)
- [ ] Communicate new features to users (if needed)
- [ ] Monitor for issues after deployment

---

**This document is now a comprehensive technical reference for your threaded, moderated, role-aware comment system.** 