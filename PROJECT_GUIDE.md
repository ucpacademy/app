# Project Guide

## Overview
This project is a multilingual education marketplace website with two main areas:
- Public catalog pages for students and visitors
- Authenticated dashboard sections for admin and student users

The app uses Next.js App Router and a route structure based on `src/app/[lang]`.

---

## Top-Level Routes
The app lives under a language prefix: `/fr` or `/ar`.

### Main public pages
- `/fr` or `/ar`
  - Home page with hero, branch search, featured programs, and top benefits.
- `/fr/login` or `/ar/login`
  - Login page. Uses `AuthForm` to authenticate via Supabase.
- `/fr/signup` or `/ar/signup`
  - Signup page. Uses `AuthForm` for registration.
- `/fr/majors` or `/ar/majors`
  - Majors listing page with major categories and branch links.
- `/fr/majors/[majorSlug]` or `/ar/majors/[majorSlug]`
  - Major detail page listing branches within that major.
- `/fr/majors/[majorSlug]/[branchSlug]` or `/ar/majors/[majorSlug]/[branchSlug]`
  - Branch detail page showing branch content, major, gallery, FAQs, and inquiry form.
- `/fr/branches/[branchSlug]` or `/ar/branches/[branchSlug]`
  - Branch landing page showing a specific branch plus registration/inquiry options.
- `/fr/institutions` or `/ar/institutions`
  - Institution catalog page.
- `/fr/institutions/[slug]` or `/ar/institutions/[slug]`
  - Single institution detail page.
- `/fr/blog` or `/ar/blog`
  - Blog listing page.
- `/fr/blog/[slug]` or `/ar/blog/[slug]`
  - Blog post detail page.
- `/fr/events` or `/ar/events`
  - Event listing page.
- `/fr/events/[eventId]` or `/ar/events/[eventId]`
  - Event detail page with registration logic.
- `/fr/faq` or `/ar/faq`
  - FAQ page with category grouping and accordion-style expansion.
- `/fr/programs` or `/ar/programs`
  - Programs page listing published programs and redirecting to branch details.

---

## Catalog group layout
- `src/app/[lang]/(catalog)/layout.tsx`
  - Wraps catalog pages in a shared container.

## Auth group layout
- `src/app/[lang]/(auth)/layout.tsx`
  - Wraps login/signup pages in a centered auth container.

---

## Dashboard Routes
There are two dashboard sections behind language prefixes:
- `/fr/admin` or `/ar/admin`
- `/fr/student` or `/ar/student`

### Admin dashboard
- `/fr/admin` or `/ar/admin`
  - Admin landing page with summary cards and links.
- `/fr/admin/dashboard` or `/ar/admin/dashboard`
  - Admin dashboard page showing counts and quick links.
- `/fr/admin/majors` or `/ar/admin/majors`
  - Manage majors and branches.
- `/fr/admin/majors/new` or `/ar/admin/majors/new`
  - Add a new major.
- `/fr/admin/branches` or `/ar/admin/branches`
  - Manage branches.
- `/fr/admin/branches/new` or `/ar/admin/branches/new`
  - Add a new branch.
- `/fr/admin/branches/[id]` or `/ar/admin/branches/[id]`
  - Edit a branch.
- `/fr/admin/institutions` or `/ar/admin/institutions`
  - Manage institutions.
- `/fr/admin/institutions/new` or `/ar/admin/institutions/new`
  - Add institution.
- `/fr/admin/institutions/[id]` or `/ar/admin/institutions/[id]`
  - Edit institution.
- `/fr/admin/events/list` or `/ar/admin/events/list`
  - Manage event listings.
- `/fr/admin/blog/list` or `/ar/admin/blog/list`
  - Manage blog posts.
- `/fr/admin/blog/new` or `/ar/admin/blog/new`
  - Add blog article.
- `/fr/admin/faqs/list` or `/ar/admin/faqs/list`
  - Manage FAQ entries.
- `/fr/admin/inquiries` or `/ar/admin/inquiries`
  - View inquiries.
- `/fr/admin/inquiries/advanced` or `/ar/admin/inquiries/advanced`
  - Advanced inquiry management.
- `/fr/admin/reviews/list` or `/ar/admin/reviews/list`
  - Manage reviews.
- `/fr/admin/users` or `/ar/admin/users`
  - User management placeholder.

### Student dashboard
- `/fr/student` or `/ar/student`
  - Student dashboard home.
- `/fr/student/bookmarks` or `/ar/student/bookmarks`
  - Saved favorites page.
- `/fr/student/branches` or `/ar/student/branches`
  - Student branch list page.
- `/fr/student/courses` or `/ar/student/courses`
  - Student courses page.
- `/fr/student/enrollments` or `/ar/student/enrollments`
  - Enrollment page.
- `/fr/student/majors` or `/ar/student/majors`
  - Student major favorites page.

---

## Shared UI and behavior
### Navigation
- `src/components/ui/Navbar.tsx`
  - Main top navigation for public pages.
  - Shows links to majors, institutions, student dashboard, and auth pages.

### Dashboard wrappers
- `src/components/dashboard/AdminDashboardLayout.tsx`
  - Admin sidebar and top header.
- `src/components/dashboard/StudentDashboardLayout.tsx`
  - Student sidebar and header.
- `src/components/ui/DashboardLayout.tsx`
  - Shared dashboard frame, logout, sidebar and main content container.

### Search and listing helpers
- `src/components/BranchSearch.tsx`
  - Branch search input on the homepage.
- `src/components/InquiryForm.tsx`
  - Handles student inquiries from branch pages.
- `src/components/ProgramRegistrationButton.tsx`
  - Register button for programs.

---

## Key features by page
### Public catalog
- `Home` - branch search, hero, featured benefits
- `Majors` - browse major categories, then branch lists
- `Branch details` - branch overview, gallery, FAQs, inquiry form
- `Institutions` - browse institutions and read institution details
- `Blog` - list blog posts and view individual article details
- `Events` - list upcoming/ongoing events and event registration
- `FAQ` - category-based FAQ accordion
- `Programs` - list programs and branch links

### Authentication
- Login and signup pages are built with `AuthForm`.
- Signup sends a Supabase signup request with redirect callback.
- Login pushes users to `/student` after successful auth.

### Admin management
- Admin dashboard cards show counts of majors, institutions, programs, events, blog posts, inquiries, reviews, and FAQ entries.
- Admin areas are wrapped by `AdminDashboardLayout`.
- Each admin section is a managed CRUD list where items can be created or edited.

### Student dashboard
- Student pages are wrapped by `StudentDashboardLayout`.
- Bookmarks page fetches favorites for the signed-in user.
- Pages appear to be placeholders for a student experience flow.

---

## Important file locations
- `src/app/[lang]/page.tsx` — public home page
- `src/app/[lang]/login/page.tsx` — login
- `src/app/[lang]/signup/page.tsx` — signup
- `src/app/[lang]/majors/page.tsx` — major categories
- `src/app/[lang]/majors/[majorSlug]/page.tsx` — major details
- `src/app/[lang]/majors/[majorSlug]/[branchSlug]/page.tsx` — branch details
- `src/app/[lang]/blog/page.tsx` — blog list
- `src/app/[lang]/blog/[slug]/page.tsx` — blog post detail
- `src/app/[lang]/events/page.tsx` — events list
- `src/app/[lang]/events/[eventId]/page.tsx` — event detail
- `src/app/[lang]/faq/page.tsx` — FAQ page
- `src/app/[lang]/programs/page.tsx` — program catalog
- `src/app/[lang]/institutions/page.tsx` — institutions list
- `src/app/[lang]/institutions/[slug]/page.tsx` — institution detail
- `src/app/[lang]/(dashboard)/admin/page.tsx` — admin root
- `src/app/[lang]/(dashboard)/admin/dashboard/page.tsx` — admin dashboard
- `src/app/[lang]/(dashboard)/student/page.tsx` — student dashboard

---

## Quick URL reference
- Public home: `/fr`, `/ar`
- Public majors: `/fr/majors`, `/ar/majors`
- Public blog: `/fr/blog`, `/ar/blog`
- Public events: `/fr/events`, `/ar/events`
- Login: `/fr/login`, `/ar/login`
- Signup: `/fr/signup`, `/ar/signup`
- Admin home: `/fr/admin`, `/ar/admin`
- Student home: `/fr/student`, `/ar/student`

---

## Notes on structure
- All pages are organized under `src/app/[lang]`.
- The app uses route-group folders like `(catalog)` and `(dashboard)` to group pages without affecting final URLs.
- Auth pages are in `(auth)` and use a lightweight centered layout.
- Admin/student dashboards use sidebar layouts and custom wrappers.

---

## Helpful hints
- Search for `href={`${lang}/...`}` in pages to trace navigation behavior.
- Look at `src/components/ui/DashboardLayout.tsx` for how dashboard sidebars and logout work.
- The public navbar is in `src/components/ui/Navbar.tsx` and hides itself on admin/student routes.
- Language handling is centralized in `src/app/[lang]/layout.tsx` and `src/utils/dictionary.ts`.

---

## Optional additional context
- The project is built with a multi-language first design.
- Public routes and dashboard routes are separated by route-group layouts.
- Data is loaded server-side on many pages using Supabase utilities.
