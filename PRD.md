# 📄 Product Requirements Document (PRD)

**Title**: Client-Designer Gallery Management System
**Owner**: \[Your Company Name]
**Version**: 1.1
**Date**: July 1, 2025

---

## 1. 🌟 Purpose

To build a secure, modern, and efficient image review and approval platform that connects designers, marketers, and clients. Each client accesses a personal gallery using a unique ID to approve or comment on designs uploaded by the internal team.

---

## 2. 👥 Roles & Permissions

| Role         | Permissions                                                                 |
| ------------ | --------------------------------------------------------------------------- |
| **Admin**    | Create/update/delete clients, view image feedback, moderate comments        |
| **Designer** | Upload images for a client, view client feedback, tag images, filter images |
| **Marketer** | Upload images to Cloudinary (auto-connected), assign to client              |
| **Client**   | View their gallery (via unique ID), approve or comment on each image        |

---

## 3. 🧹 Features

### A. Client Management (Admin Panel)

* [x] Create client (name, unique ID, optional email)
* [x] Edit/delete client
* [x] View list of all clients
* [x] Each client has a dedicated image gallery page

### B. Upload Flow (Designer / Marketer)

* [x] Upload image to Cloudinary (client pre-selected)
* [x] Automatically link image to client record
* [x] Image metadata includes: uploader name, timestamp, status
* [x] Designer can tag images as: **"offer"**, **"product"**, or **"social post"**

### C. Client Gallery View

* [x] Client enters their **Client ID** to access gallery (no login)
* [x] View images assigned to them
* [x] Each image has options:

  * ✅ Confirm / Approve
  * 💬 Add comment
* [x] Confirmation or comments are timestamped and linked
* [x] Filter gallery images by tag (offer, product, social post)

### D. Admin / Designer Feedback View

* [x] View feedback per image
* [x] Filter images by client, status (approved/pending/commented)
* [x] Filter images by tag (offer/product/social post)
* [x] Notification (badge or UI indicator) for new comments

---

## 4. 🛠️ Tech Stack

| Layer           | Technology                                                    |
| --------------- | ------------------------------------------------------------- |
| Frontend        | **Next.js 15**, **React 19**, **shadcn/ui**, **Tailwind CSS** |
| Backend         | Next.js Server Actions, REST API (where needed)               |
| Auth (Internal) | Clerk/Auth.js for designers/admins (optional)                 |
| Client Access   | ID-only (no login) via secure link or input form              |
| DB              | **Prisma + MongoDB Atlas**                                    |
| File Storage    | **Cloudinary**                                                |
| Validation      | **Zod**, **react-hook-form**                                  |
| Localization    | **next-intl** (Arabic + English) (optional)                   |
| Deployment      | Vercel                                                        |

---

## 5. 🧪 Non-Functional Requirements

* ⚡ Fast load times, full SSR for gallery and admin dashboard
* 🔒 Secure uploads and access (client ID token validation)
* 📱 Fully responsive design (mobile-first)
* 🌐 Multilingual support ready
* 💬 All comments stored with client ID + image ID + timestamp
* ♻️ Real-time update optional (with Pusher or polling)

---

## 6. 🧪 Database Models (Prisma)

### `Client`

```ts
model Client {
  id         String   @id @default(auto())
  name       String
  email      String?
  images     Image[]
  createdAt  DateTime @default(now())
}
```

### `Image`

```ts
model Image {
  id         String   @id @default(auto())
  client     Client   @relation(fields: [clientId], references: [id])
  clientId   String
  url        String
  uploadedBy String
  comments   Comment[]
  status     ImageStatus @default(PENDING)
  tag        ImageTag
  createdAt  DateTime    @default(now())
}
```

### `Comment`

```ts
model Comment {
  id        String   @id @default(auto())
  image     Image    @relation(fields: [imageId], references: [id])
  imageId   String
  content   String
  createdAt DateTime @default(now())
}
```

### `ImageStatus` (Enum)

```ts
enum ImageStatus {
  PENDING
  APPROVED
  COMMENTED
}
```

### `ImageTag` (Enum)

```ts
enum ImageTag {
  OFFER
  PRODUCT
  SOCIAL_POST
}
```

---

## 7. ✅ UI Flow

### Client Side

* `/client` → Input form for client ID
* `/client/[clientId]` → Image grid with confirm/comment per image

  * Includes tag-based filtering (dropdown or pills)

### Admin Side

* `/admin/clients` → List of clients
* `/admin/clients/[id]` → Upload area and image list per client
* `/admin/images` → All images with status and tag filters

---

## 8. 🔐 Security Notes

* Client ID must not expose sensitive data.
* Cloudinary uploads secured via signed URLs or upload presets.
* Admin/designer access via secure login.
* Rate limiting on comments to avoid spam.

---

## 9. ⏳ Suggested Timeline

| Phase            | Duration | Deliverables                    |
| ---------------- | -------- | ------------------------------- |
| Planning & Setup | 1 week   | Project structure, DB schema    |
| Admin Panel      | 1 week   | Client CRUD, image uploader     |
| Client Access UI | 1 week   | Gallery + feedback system       |
| Feedback Flow    | 1 week   | Comments + status tracking      |
| Testing & Polish | 3–5 days | Mobile UX, loading states, i18n |

---
