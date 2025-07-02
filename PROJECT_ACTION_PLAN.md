# Project Action Plan & Checklist

This file tracks the main flows and tasks for the CRM/gallery app. Mark tasks as done (`[x]`) as you complete them.

---

## 1. Admin Flow
- [x] Refactor admin page for better management
- [x] Add ability to create/edit/delete **design types**
- [x] Add ability to create/edit/delete **designer accounts**
- [x] When creating a client, ensure they appear in designer upload select
- [x] Ensure backend reflects all changes for other flows

---

## 2. Designer Flow
- [x] Designer sees all clients in select menu (no assignment needed)
- [x] Designer sees only available design types in select menu
- [x] Designer upload page works
- [x] Uploaded design is linked to correct client and type
- [x] Designer dashboard shows only their own designs

---

## 3. Client Flow
- [x] Client login (by identifier or code)
- [x] Client dashboard shows only their designs
- [x] Client can approve a design
- [x] Client can comment on a design
- [ ] Comments/approvals are visible to designer and admin

---

## 4. Main (Public) Page
- [x] Main page shows gallery (infinite scroll, design cards)
- [x] Each design card shows client name and design number
- [ ] (Optional) Allow visitors to copy/share design number for reference

---

## 5. Flow Integration
- [ ] When admin creates a client/design type, it appears for designers
- [ ] When designer uploads a design, it appears for the client
- [ ] When client approves/comments, designer and admin can see the feedback

---

## 🎨 UI/UX Enhancement Plan for Gallery Management System

### 🎯 Target Users

* Marketing companies managing visual content for their clients
* Individual designers
* Press companies/agencies
* Clients who view and process uploaded images from their service providers

---

## ✅ Objective

Enhance the **User Interface (UI)** and **User Experience (UX)** to provide a professional, intuitive, and smooth visual workflow before implementing business logic (e.g., comment/reply system).

---

## 📋 Enhancement Checklist

### 🧭 Global App Flow

* [ ] Simplify navigation with a **left-side collapsible sidebar** and **topbar for actions** (Sidebar not required per user direction)
* [ ] Introduce a **dashboard landing page** for each role (Admin, Designer, Client)
* [ ] Ensure smooth **RTL (Arabic) and LTR (English)** support using `next-intl`
* [ ] Use **server components** by default for performance
* [x] Consistent UI with Tailwind + `shadcn/ui`

### 👨‍🎨 Designer Experience

* [ ] Refactor image upload flow:
  * [ ] Drag-and-drop + file picker with preview and tag options
  * [ ] Auto-suggest tags: `Product`, `Offer`, `Social Post`
* [x] Easy client selection dropdown with search
* [x] Upload progress + success/fail feedback (toasts)
* [ ] Add optional note with each image upload

### 🧑‍💼 Client Experience

* [x] Secure login with only ID access (no passwords)
* [x] Gallery view:
  * [x] Filter by tag
  * [ ] View images in masonry grid (with responsive fallback)
  * [x] Zoom/view full screen
  * [ ] Allow commenting per image (future logic)
* [x] Clear visual tag badges on each image

### 🧑‍💻 Admin Experience

* [x] Create/edit client with clear form and validation
* [ ] Assign designer(s) to client (multi-select)
* [ ] Track image upload history per client/designer
* [ ] Toggle client access (active/inactive)

### 🎨 UI Components

* [x] Design system using `shadcn/ui`
* [x] Badge, Card, Dialog, Dropdown, Sheet, Tabs
* [x] Reusable ImageCard component with tag overlay
* [x] Responsive design for mobile/tablet/desktop

### 🧪 Quality & Accessibility

* [x] Keyboard accessible components
* [x] ARIA labels where needed
* [x] Dark mode support
* [x] Loading skeletons and error boundaries

### 5. UI/UX & Accessibility
- [ ] Unify design system (ensure all components use shadcn/ui)
- [ ] Add error boundaries for robust error handling
- [ ] Test and improve keyboard navigation and ARIA labels
- [x] Add theme (dark/light) toggle to navbar for all users
- [x] Add language switcher UI to navbar (logic not yet implemented)

---

## 🚀 Next Steps (After UI/UX Phase)

* Add comment system per image (client writes, designer replies)
* Notifications for replies and uploads
* Activity log for all roles
* Analytics dashboard (uploads, views, tags usage)

---

## 📌 Final Notes

* Keep UI minimal and clean
* Focus on intuitive interactions
* Role-based entry points
* Fully responsive and mobile-friendly
* Built with performance and SEO in mind (Next.js 15 best practices)

---

## 🚀 Full Project Improvement & Deployment Plan

### 1. Navigation & Layout
- [ ] Refactor topbar/navbar for role-based navigation, mobile support, and language switcher
- [ ] Add dashboard landing pages for Admin, Designer, Client (with quick stats/links)
- [ ] Sidebar is not required (per user direction)

### 2. Localization & RTL
- [ ] Integrate `next-intl` for Arabic/English support
- [ ] Ensure all layouts/components support RTL/LTR switching

### 3. Image Upload & Gallery
- [ ] Add drag-and-drop upload, preview, and tag auto-suggest
- [ ] Allow optional notes with uploads
- [ ] Implement masonry grid for gallery (optional)
- [ ] Add advanced filtering (by date, status, etc.)

### 4. Client/Designer/Admin Flows
- [ ] Implement comment/reply system (with backend)
- [ ] Add notifications for new comments/uploads
- [ ] Show activity log and analytics dashboard
- [ ] Admin: assign designers to clients, toggle client access, track upload history

### 5. UI/UX & Accessibility
- [ ] Unify design system (ensure all components use shadcn/ui)
- [ ] Add error boundaries for robust error handling
- [ ] Test and improve keyboard navigation and ARIA labels

### 6. Deployment & Publishing
- [ ] Add deployment scripts (Vercel, Netlify, or custom)
- [ ] Write a clear README with setup, environment, and deployment instructions
- [ ] Ensure environment variables and secrets are handled securely

---

> ✅ Mark each item as done once implemented and tested.

// Note: Sidebar is not required per user direction. RTL/LTR, next-intl, drag-and-drop, masonry, dashboard landing, and some admin features are not yet implemented. See checklist above for details.

**Update this file as you complete tasks to stay in sync!**

---

## 🎯 Full Target Client List (for Outreach & Marketing)

This app is ideal for:

- Marketing agencies managing visual content for clients
- Design studios and creative agencies
- Freelance designers and illustrators
- Photographers and photo studios
- Press agencies and media companies
- Branding and advertising agencies
- Social media managers
- Printing and production companies
- Any business needing to share, present, or get feedback on images with clients
- Teams collaborating on visual projects with external stakeholders

Use this list to guide your outreach, marketing, and product positioning! 

// Note: The navbar now includes a dark/light mode toggle and a language switcher UI for all users. Language switching logic is not yet implemented. 