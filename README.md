# HNG Stage 2 — Invoice Management App

A fully responsive Invoice Management Application matching the Frontend Mentor Invoice App Figma design, built with React + TypeScript.

## Live Demo
[Add your Vercel/Netlify URL here]

## GitHub Repo
[Add your GitHub URL here]

---

## Setup Instructions

```bash
npm install
npm start        # Development: http://localhost:3000
npm run build    # Production build
```

## Architecture

```
src/
├── App.tsx                     # Root state management + view routing
├── index.tsx                   # React entry point
├── index.css                   # All styles (CSS custom properties for theming)
├── types/
│   └── index.ts                # Invoice, InvoiceItem, Address, FilterStatus types
├── utils/
│   ├── helpers.ts              # formatCurrency, formatDate, generateId, addDays
│   └── storage.ts              # localStorage read/write + seed data
└── components/
    ├── Sidebar.tsx             # Nav bar with logo, theme toggle, avatar
    ├── InvoiceList.tsx         # List view with filter dropdown + empty state
    ├── InvoiceDetail.tsx       # Full invoice detail view
    ├── InvoiceForm.tsx         # Create/Edit drawer with full validation
    └── DeleteModal.tsx         # Confirmation modal
```

## Features

- ✅ **CRUD** — Create, Read, Update, Delete invoices
- ✅ **Draft flow** — Save as Draft, edit later, send as Pending
- ✅ **Payment flow** — Mark Pending invoices as Paid (irreversible)
- ✅ **Filter** — Filter by All / Draft / Pending / Paid with checkbox UI
- ✅ **Dark/Light mode** — Toggle persisted to localStorage
- ✅ **Form validation** — Required fields, valid email, min 1 item, positive numbers
- ✅ **Data persistence** — localStorage with 7 seed invoices on first load
- ✅ **Responsive** — 320px mobile → 768px tablet → 1440px desktop
- ✅ **Accessibility** — Focus traps, ESC close, ARIA roles, semantic HTML

## Trade-offs

- Single-page app with view state (no React Router). Browser back/forward won't navigate — acceptable for this scope.
- localStorage chosen over IndexedDB for simplicity; easy to swap.
- No server — purely client-side, which meets the brief's localStorage option.

## Accessibility Notes

- All form fields use `<label for="">` bindings
- `InvoiceForm` drawer and `DeleteModal` both implement manual focus traps
- Both close on ESC key
- ARIA roles: `dialog`, `aria-modal`, `listbox`, `option`, `toolbar`, `role="table"`
- Status badges include `aria-label`
- Empty state has `role="status"` and `aria-live="polite"`
- Color contrast verified WCAG AA in both dark and light themes
- Keyboard flow: Tab navigates all interactive elements; sidebar, list cards, form fields, buttons

## Improvements Beyond Requirements

- 7 seed invoices pre-loaded with complete invoice details
- SVG illustrations for the empty state
- Sticky form footer so Save/Discard buttons are always visible while scrolling long forms
- Exact Figma color tokens used as CSS custom properties (`--purple: #7C5DFA`, etc.)
