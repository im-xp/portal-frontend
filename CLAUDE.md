# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
```

Backend API repo: [EdgeOS_API](https://github.com/p2p-lanes/EdgeOS_API). Set `NEXT_PUBLIC_API_URL=http://localhost:8000` when running it locally.

## Architecture

**Next.js 15 App Router** portal for pop-up city event management (applications, passes, payments, attendee directories). Uses TypeScript, TailwindCSS, and Shadcn/Radix UI components.

### Routing

- `/auth` — Login (email magic link + World ID)
- `/portal` — Dashboard hub
- `/portal/[popupSlug]/application` — Dynamic application form
- `/portal/[popupSlug]/passes` — Pass purchase (Stripe + crypto)
- `/portal/[popupSlug]/attendees` — Attendee directory
- `/portal/[popupSlug]/groups/[group_id]` — Group management
- `/checkout` — Express group checkout
- `/online-checkin` — Event check-in

Multi-domain support: middleware (`src/middleware.ts`) resolves host to popup slug via `src/lib/domainPopup.ts`, and `vercel.json` rewrites inject `?popup=` query params for custom domains.

### State Management

Context API + custom hooks (no Redux). Providers in `src/providers/`:
- **CityProvider** — active popup/event data
- **ApplicationContext** — user's applications
- **PassesProvider** — pass selections & cart
- **TotalProvider** — cart totals with discount calculations
- **ProductsProvider**, **GroupsProvider**, **PoapsProvider**

### API Layer

`src/api/index.js` — Axios instance wrapping `NEXT_PUBLIC_API_URL`. Auth token set on the instance via `instance.defaults.headers.common.Authorization`. All methods return response objects (errors caught and return `e.response`).

### Strategy Pattern (Pricing)

`src/strategies/` contains pricing logic:
- **PriceStrategy** — applies highest discount (application, coupon, or group — no stacking). Excludes patron/lodging categories.
- **ProductStrategies** — product selection logic
- **TotalStrategy** — cart total computation

### Authentication Flow

Email → API sends magic link → JWT in URL → stored in localStorage → Axios interceptor adds to requests → auto-logout on 401.

## Dynamic Application Form System

This is the most complex subsystem. See `FORM_CONTEXT.md` for full details.

### How it works

1. **Popup configs** in `src/constants/Forms/*.ts` define which fields each event shows
2. **Slug mapping** in `src/constants/index.ts` maps popup slugs to configs (`dynamicForm` record)
3. **`useGetFields`** hook returns a `Set<string>` from the config's `fields` array
4. **Section components** check `fields.has("fieldName")` before rendering each field
5. **Custom fields** use `custom_` prefix in formData; `useSavesForm.ts` extracts them into a `custom_data` JSONB object (prefix stripped) at submission

### Adding new form fields

- **Standard field**: Add to popup config `fields` array, add initial value in `helpers/constants.ts`, conditionally render with `fields.has()`
- **Custom field**: Use `custom_` prefix, add to config's `customFields` array with type/section/options, add initial value, add to `customRequiredFieldsBySlug` in `useFormValidation.ts` if required
- **Always use** existing form components from `src/components/ui/Form/` (InputForm, SelectForm, CheckboxForm, TextAreaForm, RadioGroupForm) and wrap sections in `SectionWrapper`

### Validation

`src/hooks/useFormValidation.ts` has two mechanisms:
- `requiredFields` — standard fields validated only if present in the `fields` Set
- `customRequiredFieldsBySlug` — per-popup required fields that bypass `fields.has()` check

## Multi-Event Theming

`src/constants/popupBranding.ts` stores per-event colors and logos. CSS variables injected via `PopupTheme` component.

## Key Conventions

- Path alias: `@/*` → `src/*`
- Form components in `src/components/ui/Form/`, UI primitives in `src/components/ui/`
- Section layout: `SectionWrapper` (two-column: title/subtitle left, fields right) with `SectionSeparator` between sections
- Two-column field grid: `<div className="grid gap-4 sm:grid-cols-2">`
- Framer Motion for scroll-in animations on sections
- S3 uploads via `src/helpers/upload.ts` (bucket: `imxp-portal-uploads`, region: `us-east-2`)
- Environment variables prefixed `NEXT_PUBLIC_` for client access

## Environment Variables

```
NEXT_PUBLIC_API_URL        # Backend API base URL
NEXT_PUBLIC_X_API_KEY      # API key
NEXT_PUBLIC_ACCESS_KEY     # AWS S3 access key
NEXT_PUBLIC_SECRET_KEY     # AWS S3 secret key
NEXT_PUBLIC_DEVELOP        # Development mode flag
```
