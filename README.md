# Biiggg X — Official Website

> **"Biiggg moves. X marks the moment."**

Full-stack streetwear brand website for **Biiggg X** — built with React + TailwindCSS, powered by Convex backend, animated with GSAP/canvas spray effects, and wired to Stripe for payments.

---

## Tech Stack

| Layer      | Technology                                          |
|------------|-----------------------------------------------------|
| Frontend   | React 18, Vite, TailwindCSS                         |
| Animations | GSAP 3, CSS keyframes, Canvas API, Web Audio API    |
| Backend    | Convex (real-time DB + serverless functions)        |
| Payments   | Stripe Checkout + Webhooks                          |
| State      | Zustand (cart persistence via localStorage)         |
| Routing    | React Router v6                                     |
| Deploy     | Vercel (frontend) + Convex Cloud (backend)          |

---

## Project Structure

```
BiigggX/
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        — Fixed nav + mobile overlay menu
│   │   │   ├── Hero.jsx          — Canvas spray particle animation
│   │   │   ├── ProductCard.jsx   — 3D tilt, spray-sound add-to-cart
│   │   │   ├── VideoGallery.jsx  — Filterable video/reel grid
│   │   │   ├── ContactForm.jsx   — Validated collab request form
│   │   │   ├── Cart.jsx          — Slide-out cart drawer + Stripe
│   │   │   └── Footer.jsx        — Neon icons + hashtag marquee
│   │   ├── pages/
│   │   │   ├── Home.jsx          — Hero + featured drops + CTA
│   │   │   ├── About.jsx         — Timeline + philosophy + stats
│   │   │   ├── Shop.jsx          — Filterable + sortable product grid
│   │   │   ├── Media.jsx         — Video gallery + hashtag wall
│   │   │   └── Contact.jsx       — Collab types + contact form
│   │   ├── hooks/
│   │   │   ├── useCart.js        — Cart operations convenience hook
│   │   │   └── useConvex.js      — Convex query/mutation wrappers
│   │   ├── store/
│   │   │   └── cartStore.js      — Zustand cart (persisted)
│   │   ├── styles/
│   │   │   └── index.css         — Tailwind + custom animations
│   │   ├── App.jsx               — Router + animated loading screen
│   │   └── main.jsx              — Convex provider + React root
│   ├── tailwind.config.js        — Brand colors, fonts, keyframes
│   ├── vite.config.js
│   ├── postcss.config.js
│   ├── index.html                — Google Fonts + meta tags
│   └── package.json
├── backend/
│   └── convex/
│       ├── schema.ts             — 5-table schema (users, merch, orders, media, collab)
│       └── functions/
│           ├── merch.ts          — getMerch, getFeaturedMerch, seedMerch
│           ├── orders.ts         — placeOrder, updateOrderStatus, webhooks
│           ├── media.ts          — getMedia, addMedia, seedMedia
│           ├── collab.ts         — submitCollabForm, getCollabRequests
│           ├── brandContent.ts   — getBrandStory, getTimeline, getPhilosophy
│           └── stripe.ts         — createCheckoutSession, handleWebhook
└── README.md
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- A [Convex](https://convex.dev) account (free tier works)
- A [Stripe](https://stripe.com) account (test mode for dev)

### 1. Install dependencies

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 2. Set up Convex backend

```bash
cd backend
npx convex dev
```

This will prompt you to log in and create a project. Copy the deployment URL.

Create `frontend/.env`:
```env
VITE_CONVEX_URL=https://your-project.convex.cloud
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

### 3. Configure Stripe

Add to Convex env vars:
```bash
npx convex env set STRIPE_SECRET_KEY sk_test_your_secret_key
npx convex env set STRIPE_WEBHOOK_SECRET whsec_your_webhook_secret
```

### 4. Seed the database

In the Convex dashboard (dashboard.convex.dev), run these mutations:
- `functions/merch:seedMerch`
- `functions/media:seedMedia`
- `functions/brandContent:seedBrandContent`

### 5. Run frontend

```bash
cd frontend
npm run dev
# Opens at http://localhost:3000
```

---

## Deployment

### Frontend → Vercel

```bash
npm i -g vercel
cd frontend
vercel --prod

# Set in Vercel Dashboard > Settings > Environment Variables:
# VITE_CONVEX_URL
# VITE_STRIPE_PUBLISHABLE_KEY
```

### Backend → Convex Cloud

```bash
cd backend
npx convex deploy
# Auto-deploys to Convex cloud infrastructure
```

---

## Connecting Live Data

The frontend ships with mock data. To switch to real Convex data, update each page:

```jsx
// Shop.jsx — replace ALL_PRODUCTS array:
import { useMerch } from '../hooks/useConvex';
const products = useMerch(activeCategory) ?? [];

// Home.jsx — replace FEATURED_PRODUCTS array:
import { useFeaturedMerch } from '../hooks/useConvex';
const featured = useFeaturedMerch() ?? [];

// Media.jsx — replace PLACEHOLDER_VIDEOS array:
import { useMedia } from '../hooks/useConvex';
const videos = useMedia() ?? [];

// Contact.jsx — wire form submission:
import { useSubmitCollab } from '../hooks/useConvex';
const submitCollab = useSubmitCollab();
```

---

## Brand Design System

### Colors
| Token         | Hex       | Use Case                    |
|---------------|-----------|-----------------------------|
| Crimson Blaze | `#E53935` | CTAs, X mark, accents       |
| Neon Pulse    | `#00BFFF` | Hover states, glow effects  |
| Urban Dust    | `#B0B0B0` | Body text, labels           |
| Midnight Wall | `#000000` | Primary background          |

### Fonts
- **Bebas Neue** — Headlines, logo (Google Fonts)
- **Montserrat** — Body, navigation (Google Fonts)
- **Permanent Marker** — Graffiti accents (Google Fonts)

### Animations
- Hero spray: Canvas particle system (spray paint simulation)
- Loading screen: SVG path draw + fade sequence
- Scroll reveals: IntersectionObserver-triggered CSS transitions
- Product tilt: Perspective transform on mouse move
- Add-to-cart sound: Web Audio API white noise burst
- Marquee: CSS infinite scroll animation

---

## License

© 2026 Biiggg X. All rights tagged.
