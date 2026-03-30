---
description: React best practices and patterns for modern web applications — tailored to Sanele Krakra's stack and architectural standards
globs: **/*.tsx, **/*.jsx, **/*.ts, components/**/*
---

# Claude Instructions — Sanele Krakra

## Identity & Stack
- **Primary languages:** TypeScript, JavaScript (ES6+)
- **Frameworks:** React (Vite), Next.js
- **Styling:** Tailwind CSS, CSS3
- **State management:** Zustand (preferred), Context API for lightweight shared state, useState/useReducer for local state
- **Forms & validation:** React Hook Form + Zod (schema-first validation)
- **API mocking:** MSW (Mock Service Worker)
- **Build & CI/CD:** Docker, Azure DevOps, GitHub Actions
- **CMS:** Builder.io (headless)
- **Architecture:** Feature-based folder structure, component-driven development, domain-driven thinking

---

## Component Structure
- Always use **functional components** — never class components
- Keep components **small and focused** — one responsibility per component
- Extract reusable logic into **custom hooks**
- Favour **composition over inheritance**
- All props must be **typed with TypeScript interfaces or types**
- Split large components into smaller, focused ones — if a component exceeds ~150 lines, consider breaking it up
- Co-locate styles, tests, and types with the component they belong to

---

## TypeScript Standards
- Prefer `interface` for object shapes, `type` for unions/intersections
- Never use `any` — use `unknown` and narrow types explicitly
- Use `strict` mode in `tsconfig.json`
- Always type API response shapes explicitly — do not infer from raw fetches
- Use Zod schemas as the single source of truth for runtime validation and derive TypeScript types from them:
  ```ts
  const userSchema = z.object({ id: z.string(), name: z.string() });
  type User = z.infer<typeof userSchema>;
  ```

---

## Hooks
- Follow the **Rules of Hooks** strictly (no conditional hooks, no nested hooks)
- Build **custom hooks** for reusable or complex logic — prefix with `use`
- Keep hooks focused — one concern per hook
- Always specify **dependency arrays** correctly in `useEffect`
- Implement **cleanup functions** in `useEffect` when subscribing to events, timers, or external resources
- Avoid business logic leaking into components — push it into hooks

---

## State Management
- **Local UI state:** `useState`
- **Complex local state transitions:** `useReducer`
- **Cross-feature shared state:** Zustand (preferred over Context for anything non-trivial)
- **Lightweight shared state:** Context API
- Keep state **as close to where it's used as possible**
- Avoid prop drilling — lift state or use Zustand stores
- Do not reach for heavy state libraries unless Zustand is insufficient

---

## Forms & Validation
- Use **React Hook Form** for all form management
- Use **Zod** for schema validation — always define the schema first, then pass it to `zodResolver`
- Handle loading, error, and success states explicitly on every form submission
- Show **user-friendly validation messages** — not raw error objects
- Implement **dynamic rule composition** for conditional validation (e.g., insurance workflows with branching logic)
- All form fields must have proper labels and `aria-describedby` for accessibility

---

## API Integration
- Use **RESTful conventions** for all API calls
- Always type request payloads and response shapes explicitly
- Use **MSW** for development-time API mocking — never hardcode mock data inline
- Reference **Swagger/OpenAPI specs** when integrating with backend teams
- Handle all async states: `loading`, `error`, `success`, `empty`
- Never expose raw API errors to the UI — map them to user-friendly messages
- Centralise API client configuration (base URL, headers, interceptors) in one place

---

## Architecture & Folder Structure
Follow a **feature-based folder structure**:

```
src/
├── features/
│   └── insurance/
│       ├── components/
│       ├── hooks/
│       ├── store/
│       ├── schemas/
│       ├── types/
│       └── index.ts
├── shared/
│   ├── components/
│   ├── hooks/
│   └── utils/
├── pages/ (or app/ for Next.js App Router)
└── lib/
```

- Keep **domain logic inside feature folders**
- `shared/` is for truly reusable, domain-agnostic code only
- Use **barrel exports** (`index.ts`) per feature for clean imports
- Maintain **separation of concerns** — UI, logic, and data layers should be clearly distinct

---

## Performance
- Apply `React.memo` to components that receive stable props but render often
- Use `useMemo` for expensive derived values; use `useCallback` for stable function references passed as props
- Avoid premature optimisation — profile first with React DevTools
- Implement **lazy loading** (`React.lazy` + `Suspense`) for route-level and heavy components
- Always provide stable, unique `key` props in lists — never use array index as key in dynamic lists
- Avoid anonymous functions in JSX props when the component is performance-sensitive

---

## Error Handling
- Wrap route-level and feature-level trees with **Error Boundaries**
- Handle async errors at the hook/service layer — not inside components
- Always provide **fallback UI** for error and loading states
- Log errors with enough context to debug (feature, action, payload shape)
- Handle edge cases explicitly — empty states, partial data, network failures
- Never silently swallow errors

---

## Accessibility
- Use **semantic HTML** elements (`<button>`, `<nav>`, `<main>`, `<section>`, etc.)
- Add proper **ARIA attributes** where semantic HTML is insufficient
- Ensure full **keyboard navigation** — every interactive element must be reachable via keyboard
- Manage **focus** explicitly after modals, route changes, and async actions
- Provide `alt` text for all images; decorative images get `alt=""`
- Test with a screen reader periodically (NVDA / VoiceOver)

---

## Testing
- Write **unit tests** for all custom hooks and utility functions
- Write **integration tests** for multi-step user journeys (e.g., multi-step forms)
- Use **React Testing Library** — test behaviour, not implementation
- Use **MSW** to mock API calls in tests — no inline fetch mocks
- Always test: happy path, error state, loading state, edge cases
- Co-locate test files with the component/hook they test: `ComponentName.test.tsx`

---

## Code Style & Conventions
- Use **named exports** for components (not default exports, except for Next.js pages/layouts)
- File naming: `PascalCase` for components, `camelCase` for hooks and utilities
- Avoid magic numbers and strings — extract to named constants
- Write **self-documenting code**; add comments only for non-obvious business logic
- Keep imports ordered: external → internal → relative → styles
- No unused imports, variables, or dead code

---

## Git & CI/CD
- Branch naming: `feature/`, `fix/`, `chore/` prefixes
- Write **clear, imperative commit messages** (e.g., `feat: add Zod validation to quote form`)
- Every PR must have a description explaining what changed and why
- Use **Azure DevOps** pipelines for CI/CD — no manual production deployments
- Docker containers must be used to package frontend applications for deployment
- PRs require at least one review before merging to main/staging

---

## Next.js — App Router

### Server vs Client Components
- **Default to Server Components (RSC)** — move to client only when you need interactivity, browser APIs, or hooks
- Mark client components explicitly with `'use client'` at the top of the file — never assume
- Keep `'use client'` boundaries as **deep in the tree as possible** to maximise server-rendered surface area
- Never import a Server Component into a Client Component — pass them as `children` or props instead
- Use Server Components for: data fetching, access to backend resources, sensitive logic, large dependency imports

### File Conventions (App Router)
- `page.tsx` — route UI, always a Server Component by default
- `layout.tsx` — persistent shell across child routes; use for nav, providers, shared UI
- `loading.tsx` — automatic Suspense boundary for the route segment
- `error.tsx` — must be a Client Component (`'use client'`); handles segment-level errors
- `not-found.tsx` — rendered when `notFound()` is called from a Server Component
- `route.ts` — API route handlers; use for backend logic that must stay server-side
- Directory naming: **lowercase with dashes** (e.g., `app/quote-wizard/`)
- Group routes logically with **Route Groups** `(groupName)` — no URL impact, clean organisation

### Data Fetching
- Fetch data directly in **Server Components** using `async/await` — no `useEffect` for initial data
- Use Next.js extended `fetch` with explicit cache options:
  ```ts
  // Static — cached indefinitely
  fetch(url, { cache: 'force-cache' })

  // Dynamic — never cached
  fetch(url, { cache: 'no-store' })

  // Revalidate on interval
  fetch(url, { next: { revalidate: 60 } })
  ```
- Use `unstable_cache` for caching non-fetch async work (DB queries, external SDKs)
- Prefer **parallel data fetching** with `Promise.all` in Server Components to avoid waterfalls
- Use **React `cache()`** to deduplicate identical fetches within a render pass

### Caching Strategy
- Understand the four Next.js cache layers: Request Memoization → Data Cache → Full Route Cache → Router Cache
- Tag cached data with `{ next: { tags: ['tag-name'] } }` so it can be invalidated precisely
- Call `revalidateTag('tag-name')` or `revalidatePath('/path')` from Server Actions after mutations
- Opt out of caching explicitly when data must always be fresh (e.g., user-specific financial data)

### Server Actions
- Use **Server Actions** for form mutations and data writes — avoid dedicated API routes for simple CRUD
- Define actions in `'use server'` files or inline with the directive at the top of the function
- Always validate Server Action inputs with **Zod** before processing — treat them like API endpoints
- Return structured results from Server Actions (never throw raw errors to the client):
  ```ts
  return { success: true, data } // or { success: false, error: 'message' }
  ```
- Use `useActionState` (React 19) or `useFormState` to bind Server Action state to forms
- Pair with `useFormStatus` for pending/loading states on submit buttons

### Routing & Navigation
- Use `<Link>` for all internal navigation — never `<a>` tags for same-origin routes
- Use `useRouter` (from `next/navigation`) for programmatic navigation in Client Components only
- Use `redirect()` and `notFound()` from `next/navigation` in Server Components
- Implement **Parallel Routes** (`@slot`) for complex layouts with independent loading states (e.g., dashboards with sidebars)
- Use **Intercepting Routes** for modals that should be shareable via URL
- Add `loading.tsx` to every route segment that fetches data — never leave users staring at a blank shell

### Images & Static Assets
- Always use **`next/image`** (`<Image />`) — never raw `<img>` for content images
- Always provide `width` and `height` (or `fill` with a positioned parent) to prevent layout shift
- Use `priority` prop for above-the-fold images (hero, LCP candidate)
- Store images in `/public` only for truly static assets; prefer a CDN or CMS (Builder.io) for content images
- Use **WebP** format where possible; Next.js will auto-convert when using `<Image />`

### Metadata & SEO
- Define metadata using the **Metadata API** — never raw `<head>` tags:
  ```ts
  // Static
  export const metadata: Metadata = { title: '...', description: '...' }

  // Dynamic
  export async function generateMetadata({ params }): Promise<Metadata> { ... }
  ```
- Set a root `layout.tsx` metadata template with `title.template` so page titles compose automatically
- Add `openGraph` and `twitter` metadata for all public-facing pages
- Use `robots` metadata to control indexing per route segment

### Middleware
- Use `middleware.ts` at the project root for: auth guards, redirects, locale detection, A/B flags
- Keep middleware **lightweight** — it runs on every matched request on the Edge
- Use `matcher` config to restrict middleware to only the routes that need it
- Never perform heavy computation or DB calls in middleware — delegate to Server Components or API routes

### Environment & Security
- Prefix variables with `NEXT_PUBLIC_` only when they must be exposed to the browser — everything else stays server-only
- Use `server-only` package to hard-enforce that sensitive modules never ship to the client bundle:
  ```ts
  import 'server-only';
  ```
- Never access `process.env` in Client Components — pass only what's needed as props from Server Components
- Sanitise and validate all data coming through route params, search params, and form inputs before use

### Next.js Performance (beyond React layer)
- Use `next/font` to self-host fonts — eliminates external font network requests and layout shift
- Use `next/script` with appropriate `strategy` (`lazyOnload`, `afterInteractive`, `beforeInteractive`) for third-party scripts
- Enable **Partial Prerendering (PPR)** per route where you want a static shell with streaming dynamic content
- Use `generateStaticParams` for dynamic routes that have a known finite set of values (ISR-friendly)
- Monitor Core Web Vitals via Next.js Analytics or Vercel Speed Insights; treat LCP, CLS, and INP as first-class metrics

---

## Node.js & Express — Backend Standards

### Project Structure
Follow a **domain-driven folder structure** that mirrors the frontend feature organisation:

```
src/
├── features/
│   └── insurance/
│       ├── insurance.router.ts
│       ├── insurance.controller.ts
│       ├── insurance.service.ts
│       ├── insurance.schema.ts      # Zod validation schemas
│       └── insurance.types.ts
├── middleware/
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   └── validate.middleware.ts
├── lib/
│   ├── db.ts                        # DB connection / ORM setup
│   ├── logger.ts
│   └── config.ts                    # Centralised env config
├── app.ts                           # Express app setup (no listen())
└── server.ts                        # Entry point — binds port, handles signals
```

- Keep `app.ts` and `server.ts` separate — `app.ts` exports the Express instance for testing without starting a server
- Never import feature modules in a circular chain — services depend on the DB layer, controllers depend on services, routers depend on controllers

### Express Setup & Middleware Order
Register middleware in this order — sequence matters:
1. Security headers (`helmet`)
2. CORS (`cors` with explicit origin allowlist)
3. Rate limiting (`express-rate-limit`) — before body parsing to block abuse early
4. Body parsing (`express.json()`, `express.urlencoded()`)
5. Request logging
6. Feature routers
7. 404 catch-all handler
8. Global error handler (must have 4 parameters: `err, req, res, next`)

```ts
app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') }));
app.use(rateLimiter);
app.use(express.json());
app.use(requestLogger);
app.use('/api/v1', appRouter);
app.use(notFoundHandler);
app.use(globalErrorHandler);
```

### API Design
- Version all APIs: `/api/v1/...` — never break existing consumers by changing an unversioned route
- Use standard HTTP methods semantically: `GET` (read), `POST` (create), `PUT`/`PATCH` (update), `DELETE` (remove)
- Return consistent response envelopes:
  ```ts
  // Success
  { success: true, data: T, meta?: PaginationMeta }

  // Error
  { success: false, error: { code: string, message: string, details?: unknown } }
  ```
- Use proper HTTP status codes — never return `200` for errors
- Document all endpoints with **Swagger/OpenAPI** (`swagger-jsdoc` + `swagger-ui-express`) — keep it in sync with the frontend Swagger integration
- Use plural nouns for resource routes: `/policies`, `/claims` — not `/getPolicy`

### Request Validation
- Validate **all** incoming data (body, params, query) with **Zod** before it reaches the controller — use a reusable `validate` middleware:
  ```ts
  export const validate = (schema: ZodSchema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) return res.status(400).json({ success: false, error: result.error.flatten() });
    req.body = result.data;
    next();
  };
  ```
- Share Zod schemas between frontend and backend in a `packages/schemas` monorepo package where possible — single source of truth
- Never trust `req.params` or `req.query` — parse and validate them too

### Error Handling
- Use a **centralised async error handler** — wrap all async route handlers to avoid unhandled rejections:
  ```ts
  export const asyncHandler = (fn: RequestHandler): RequestHandler =>
    (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
  ```
- Define a custom `AppError` class with `statusCode`, `code`, and `isOperational` fields
- Distinguish **operational errors** (expected, e.g. 404, validation fail) from **programmer errors** (unexpected bugs) — handle them differently in the global error handler
- Never leak stack traces or internal error details to the client in production
- Log the full error server-side (with request context) before sending a sanitised response

### Authentication & Authorisation
- Use **JWT** (short-lived access token + refresh token rotation) — store refresh tokens server-side or in an httpOnly cookie
- Hash passwords with **bcrypt** (minimum 12 salt rounds) — never store plain text or use MD5/SHA1
- Implement **role-based access control (RBAC)** as middleware that checks `req.user.role` against a permission map
- Validate and decode JWTs in a dedicated `auth.middleware.ts` — never repeat this logic in controllers
- Implement proper **OAuth 2.0** flows for third-party auth — never roll a custom OAuth implementation

### Database Integration
- Use an **ORM/ODM** (Prisma preferred for TypeScript) — never write raw SQL in controllers or services
- Define all schema migrations as version-controlled files — never mutate the DB schema manually in production
- Use **connection pooling** — configure pool size based on expected concurrency, not defaults
- Wrap multi-step writes in **transactions** — never leave the DB in a partial state on failure
- Never select `*` — always project only the fields you need
- Index columns used in `WHERE`, `ORDER BY`, and `JOIN` clauses — review query plans before deploying to production

### Security
- Set security headers with `helmet()` — do not disable defaults without explicit reason
- Restrict CORS to a known `ALLOWED_ORIGINS` list — never use `origin: '*'` in production
- Rate-limit all public endpoints; apply stricter limits to auth routes (`/login`, `/register`, `/refresh`)
- Sanitise user input to prevent NoSQL injection, SQL injection, and XSS — rely on the ORM's parameterised queries, not string concatenation
- Store all secrets in **environment variables** — never commit `.env` files; use a secrets manager in production
- Rotate JWT secrets and API keys on a schedule; invalidate on suspected compromise

### Async & Process Management
- Use `async/await` throughout — never mix callbacks and promises in the same flow
- Always `await` async operations — never fire-and-forget unless explicitly intentional (and document it)
- Handle **process signals** for graceful shutdown:
  ```ts
  process.on('SIGTERM', async () => {
    await server.close();
    await db.disconnect();
    process.exit(0);
  });
  ```
- Handle `unhandledRejection` and `uncaughtException` — log and exit cleanly rather than running in a broken state

### Logging
- Use a structured logger (**Pino** preferred for performance) — never `console.log` in production code
- Log at appropriate levels: `debug` (dev only), `info` (requests, lifecycle), `warn` (recoverable issues), `error` (failures)
- Include request ID, user ID (where safe), and feature context in every log entry for traceability
- Never log passwords, tokens, PII, or full request bodies containing sensitive fields

### Performance
- Use `compression` middleware for HTTP response compression on text payloads
- Cache expensive, infrequently-changing responses at the route or service layer (Redis preferred)
- Avoid **N+1 queries** — use eager loading / `include` in your ORM rather than looping over DB calls
- Offload CPU-intensive work (PDF generation, image processing, bulk exports) to a **job queue** (BullMQ + Redis) — never block the event loop
- Use **worker threads** for truly CPU-bound synchronous work if a queue is insufficient

### Testing
- Unit test **services** in isolation — mock the DB layer
- Integration test **routes** using `supertest` against the real Express app (with an in-memory or test DB)
- Use **MSW** or `nock` to mock outbound HTTP calls in tests
- Test all error paths: invalid input, auth failure, DB error, downstream service failure
- Never use the production DB in tests — use a dedicated test database or transactions that roll back

---

## General Principles
- **Clarity over cleverness** — write code that your team can read in 6 months
- **Domain-driven thinking** — name things after the business domain, not the technical implementation
- **Data integrity first** — validate at the boundary (API response, form input) and trust the interior
- **Build for scale** — structure features so they can grow without major rewrites
- **Secure by default** — never expose sensitive data in the frontend; sanitise all user input
