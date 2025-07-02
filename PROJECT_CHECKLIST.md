# 📝 Project Checklist: Client-Designer Gallery Management System

This checklist is a living reference for the project, structured by development phases. Each item follows best practices from official Next.js, Prisma, and UI/UX documentation. Update this file as tasks are completed.

---

## 1. 🏗️ Project Foundation
- [ ] Review and finalize PRD with stakeholders
- [x] Set up Prettier, ESLint, and Husky for code quality *(Installed and configured. Update configuration as needed for project style.)*
- [ ] Document setup steps in README.md
- [ ] Configure environment variables for secrets
- [ ] Initialize task tracking (Notion/Linear/Jira)

## 2. 🗂️ Structure & Boilerplate
- [x] Scaffold required routes/pages:
  - [x] `/client` (ID input)
  - [x] `/client/[clientId]` (gallery grid)
  - [x] `/admin/clients` (list, CRUD)
  - [x] `/admin/clients/[id]` (upload, gallery)
  - [x] `/admin/images` (all images, filters)
- [x] Add shared UI layout (sidebar/topbar) *(Uses shadcn/ui Sidebar and NavigationMenu for navigation, following official best practices.)*
- [ ] Add simple navigation for development/testing

## 3. 🛢️ Database & Backend
- [ ] Add Prisma and configure MongoDB Atlas connection
- [ ] Implement models: `Client`, `Image`, `Comment`, enums
- [ ] Add seed scripts for test data
- [ ] Use Zod for input validation in API routes
- [ ] Use environment variables for DB credentials

## 4. 🔐 Authentication & Security
- [ ] Integrate Clerk/Auth.js for internal roles
- [ ] Implement client access via unique ID (no login)
- [ ] Secure Cloudinary uploads (signed URLs/presets)
- [ ] Use middleware for role-based access control
- [ ] Rate-limit comment endpoints

## 5. 🎨 UI/UX Development
- [ ] Use App Router and file-based routing (Next.js best practice)
- [ ] Use shadcn/ui and Tailwind for consistent design
- [ ] Implement responsive layouts (mobile-first)
- [ ] Add loading, error, and empty states
- [ ] Use accessible markup (labels, alt text, keyboard nav)
- [ ] Add i18n scaffolding (next-intl)

## 6. 🖼️ Image Upload & Gallery
- [ ] Integrate Cloudinary upload widget or custom uploader
- [ ] Store image metadata (uploader, timestamp, tag, status)
- [ ] Implement gallery grid with filtering (tag/status/client)
- [ ] Use lazy loading for images
- [ ] Validate file types and sizes before upload

## 7. 💬 Feedback & Comments
- [ ] Implement approve/comment actions per image
- [ ] Store feedback with timestamps and IDs
- [ ] Show feedback in admin/designer views with filters
- [ ] Sanitize all comment input
- [ ] Show badges/notifications for new feedback
- [ ] (Optional) Add real-time updates (Pusher or polling)

## 8. 🧪 Testing & QA
- [ ] Add unit and integration tests (Jest, Playwright/Cypress)
- [ ] Test accessibility and responsiveness
- [ ] Use CI for linting and tests
- [ ] Write E2E tests for critical flows

## 9. 🚀 Deployment & Monitoring
- [ ] Set up Vercel for deployment
- [ ] Configure environment variables in Vercel dashboard
- [ ] Add error and uptime monitoring (Sentry, LogRocket)
- [ ] Use preview deployments for PRs

## 10. 📚 Documentation & Handover
- [ ] Document all endpoints, models, and workflows
- [ ] Update README with setup, usage, and deployment instructions
- [ ] Provide onboarding docs for new team members

---

**Legend:**
- [ ] = To Do
- [x] = Done

> _Update this checklist as you complete each task. Follow official documentation for each technology and best UI/UX practices._ 