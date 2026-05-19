# Upstride Frontend

### Frontend web application for the [Upstride](https://upstride.bilalnsmuhammed.in) platform, built for mentorship, collaboration, content publishing, and community-driven communication.

Built with **React**, **TypeScript**, **TanStack Router**, **TanStack Query**, **Tailwind CSS**, and **shadcn/ui** in a **feature-based architecture** for scalable UI development, maintainability, and consistent user experience.

---

## Features

### Authentication & Onboarding

- Email registration and login
- Google OAuth integration
- OTP verification flows
- User onboarding and profile setup
- Role-aware public and protected layouts

### Mentorship Experience

- Mentor discovery and public profile browsing
- Mentor registration workflows
- Availability management
- Session booking flows
- Mentor and user dashboards

### Real-Time Communication

- One-to-one chat
- Live session call interfaces
- Real-time updates using [Socket.IO](https://socket.io/)
- In-app notifications

### Content & Community

- Article creation and publishing
- Rich text editing
- Reports and moderation flows
- Reviews and ratings

### Platform Operations

- Admin dashboard
- User, mentor, catalog, and report management
- Platform settings and transaction monitoring
- Wallet and payment-related user flows

### UI & Experience

- File-based routing
- Reusable component system
- Form validation
- Responsive layouts
- Toasts, dialogs, and accessible UI primitives

---

## Tech Stack

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [TanStack Router](https://tanstack.com/router)
- [TanStack Query](https://tanstack.com/query)
- [TanStack Form](https://tanstack.com/form)
- [shadcn/ui](https://ui.shadcn.com/)
- [Zod](https://zod.dev/)
- [Axios](https://axios-http.com/)
- [Socket.IO Client](https://socket.io/)
- [TipTap](https://tiptap.dev/)

---

## Architecture

This project follows:

- Feature-based frontend architecture
- File-based routing using [TanStack Router](https://tanstack.com/router)
- Shared UI component and utility layers
- Centralized API and environment configuration
- Schema-driven validation using [Zod](https://zod.dev/)
- Server-state management using [TanStack Query](https://tanstack.com/query)

---

## Project Structure

```bash
.
├── src
│   ├── api
│   ├── app
│   │   ├── contexts
│   │   └── router
│   │
│   ├── components
│   │   ├── common
│   │   ├── editor
│   │   ├── blocks
│   │   └── ui
│   │
│   ├── features
│   │   ├── auth
│   │   ├── article
│   │   ├── chat
│   │   ├── mentor-discovery
│   │   ├── mentor-registration
│   │   ├── sessions
│   │   ├── wallet
│   │   ├── admin
│   │   └── ...
│   │
│   ├── routes
│   │   ├── _public-layout
│   │   ├── _app-layout
│   │   ├── _admin-layout
│   │   └── __root.tsx
│   │
│   ├── shared
│   │   ├── config
│   │   ├── constants
│   │   ├── hooks
│   │   ├── services
│   │   ├── types
│   │   ├── utils
│   │   └── validators
│   │
│   └── types
├── public
└── vite.config.ts
```

---

## Installation

Clone repository:

```bash
git clone https://github.com/mohammedbilalns/upstride-frontend.git
cd upstride-frontend
```

Install dependencies:

```bash
pnpm install
```

---

## Environment Setup

Configure the required environment variables in:

```bash
.env
```

Required variables:

```bash
VITE_API_URL=
VITE_GOOGLE_CLIENT_ID=
VITE_LINKEDIN_CLIENT_ID=
VITE_LINKEDIN_REDIRECT_URI=
VITE_VAPID_PUBLIC_KEY=
```

---

## Running Locally

Development:

```bash
pnpm dev
```

Build:

```bash
pnpm build
```

Preview Production Build:

```bash
pnpm preview
```

Format Code:

```bash
pnpm format
```

Lint and Format:

```bash
pnpm lint-format
```

---

## License

MIT
