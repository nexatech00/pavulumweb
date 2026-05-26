# Pavulum — Next.js

This is the Next.js 15 (App Router) version of the Pavulum project, converted from TanStack Start.

## Getting started

```bash
cd nextjs-app
npm install   # or: bun install / pnpm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Copy `.env.local` and fill in your values:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SITE_URL=https://pavulum.com   # used for sitemap
```

## Project structure

```
src/
  app/                  # Next.js App Router pages
    (site pages)        # /, /shop, /books, /courses, /apparel, /product/[slug]
    /cart               # Shopping cart
    /checkout           # Checkout (test mode)
    /about, /contact    # Static pages
    /journal, /podcast  # Editorial pages
    /login, /signup     # Auth pages
    /admin/             # Admin dashboard (protected)
    sitemap.ts          # Dynamic sitemap
    not-found.tsx       # 404 page
    error.tsx           # Error boundary
  components/
    site/               # Header, Footer, Layout, ProductCard, CategoryPage
    admin/              # ProductForm
    providers.tsx       # QueryClient + Auth + Cart providers
  integrations/
    supabase/           # Supabase client (browser + server)
  lib/
    auth.tsx            # AuthProvider + useAuth hook
    cart.tsx            # CartProvider + useCart hook
    products.ts         # Product types, fetch functions, React Query hooks
    utils.ts            # cn() utility
  styles/
    globals.css         # Tailwind v4 + brand theme
```

## Key differences from TanStack Start

| TanStack Start | Next.js |
|---|---|
| `createFileRoute` | `export default function Page()` |
| `<Link to="...">` | `<Link href="...">` |
| `useNavigate()` | `useRouter()` from `next/navigation` |
| `useRouterState` for pathname | `usePathname()` |
| `Route.useParams()` | `params` prop (async in Next 15) |
| `import.meta.env.VITE_*` | `process.env.NEXT_PUBLIC_*` |
| `<img>` tags | `<Image>` from `next/image` |
| TanStack Start SSR | Next.js App Router (RSC + Client Components) |
| Cloudflare Workers | Vercel / Node.js (or any Next.js host) |

## Deployment

Deploy to Vercel with one click, or any platform that supports Next.js.
Set the environment variables in your deployment dashboard.
