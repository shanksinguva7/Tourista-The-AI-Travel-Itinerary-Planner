# Tourista — AI-Powered Travel Planning Dashboard

Tourista is a full-stack travel management platform where admins can generate AI-powered trip itineraries, manage users, and track analytics — while users can browse, view, and book curated trips.

---

## Features

- **AI Trip Generation** — Describe your ideal trip (destination, duration, style, budget) and Google Gemini builds a full day-by-day itinerary
- **Trip Booking** — Stripe-powered payment links on every trip; users land on a confirmation page with a confetti animation after booking
- **Admin Dashboard** — Charts showing user growth and popular travel styles, summary stats, and tables of recent signups and trips
- **User Management** — View all registered users with roles, join dates, and profile pictures
- **Trip Browsing** — Paginated public trip feed with destination images from Unsplash
- **Google OAuth** — One-click sign-in via Google; user profiles stored in Appwrite
- **Interactive World Map** — Highlights the selected destination on a world map while creating a trip

---

## Screenshots

> Save your screenshots into a `screenshots/` folder at the project root, using the filenames below.

**Homepage** — 

![alt text](<Screenshot 2026-04-26 165710.png>)

The public-facing landing page with a full-screen hero image, a "Get Started" CTA, a featured destinations grid, and a paginated list of AI-generated trips available for booking.

---

**Admin Dashboard** — 

![alt text](<Screenshot 2026-04-26 165726.png>)
The admin overview showing real-time stats (Total Users, Total Trips, Active Users) with monthly trend indicators, a User Growth column/spline chart, a Trip Trends chart by travel style, and tables for latest signups and trips by interest.

---

**Create Trip Form** — 

![alt text](<Screenshot 2026-04-26 165845.png>)
The AI trip generation form where admins select a country (with flag emoji), set a duration, pick multiple interests via checkbox dropdown, and choose group type, travel style, and budget.

---

**World Map & Trip Generation** — 
![alt text](<Screenshot 2026-04-26 170947.png>)

The lower half of the create trip form, showing the interactive world map that highlights the selected country in red. The Generate Trip button submits the form to the Gemini AI backend.

---

**Sign-In Page** — 

![alt text](<Screenshot 2026-04-26 165653.png>)

The Google OAuth sign-in screen with an illustrated travel-themed background, used for both admin and regular user authentication.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + React Router v7 |
| Styling | Tailwind CSS v4 |
| UI Components | Syncfusion EJ2 React (charts, grids, maps, dropdowns) |
| Backend / Auth / DB | Appwrite (BaaS) |
| AI | Google Gemini 2.0 Flash |
| Images | Unsplash API |
| Payments | Stripe |
| Language | TypeScript |
| Build Tool | Vite |

---

## Project Structure

```
├── app/
│   ├── appwrite/
│   │   ├── auth.ts          # Google OAuth, user helpers
│   │   ├── client.ts        # Appwrite SDK setup
│   │   ├── dashboard.ts     # Analytics queries
│   │   └── trips.ts         # Trip CRUD
│   ├── lib/
│   │   ├── stripe.ts        # Stripe product & payment link creation
│   │   └── utils.ts         # Shared utilities
│   ├── routes/
│   │   ├── admin/           # Protected admin routes
│   │   │   ├── dashboard.tsx
│   │   │   ├── create-trip.tsx
│   │   │   ├── all-users.tsx
│   │   │   ├── trips.tsx
│   │   │   └── trip-detail.tsx
│   │   ├── root/            # Public routes
│   │   │   ├── travel-page.tsx
│   │   │   ├── travel-detail.tsx
│   │   │   ├── payment-success.tsx
│   │   │   └── sign-in.tsx
│   │   └── api/
│   │       └── create-trip.ts   # Server action — AI + Unsplash + Stripe
│   ├── constants/           # App constants & world map GeoJSON
│   └── index.d.ts           # Global TypeScript types
├── components/              # Shared components (Header, TripCard, NavItems, etc.)
├── public/                  # Static assets
├── vite.config.ts
└── react-router.config.ts
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- An [Appwrite](https://appwrite.io) project with:
  - Google OAuth enabled
  - A database with two collections: `users` and `trips`
- A [Google AI Studio](https://aistudio.google.com) API key (Gemini)
- An [Unsplash](https://unsplash.com/developers) developer account
- A [Stripe](https://stripe.com) account

### Installation

```bash
git clone <repo-url>
cd "Travel Agent Dashboard"
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
# Syncfusion (get a free community license at syncfusion.com)
VITE_SYNCFUSION_LICENSE_KEY=

# Appwrite
VITE_APPWRITE_API_ENDPOINT=https://<region>.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=
VITE_APPWRITE_API_KEY=
VITE_APPWRITE_DATABASE_ID=
VITE_APPWRITE_USERS_COLLECTION_ID=
VITE_APPWRITE_TRIPS_COLLECTION_ID=

# Google Gemini
GEMINI_API_KEY=

# Unsplash
UNSPLASH_ACCESS_KEY=

# Stripe
STRIPE_SECRET_KEY=

# App
VITE_BASE_URL=http://localhost:5174
```

### Run the App

```bash
npm run dev
```

The app runs at `http://localhost:5174` by default.

---

## Appwrite Setup

### Users Collection — required attributes

| Attribute | Type |
|---|---|
| `accountId` | String |
| `name` | String |
| `email` | String |
| `imageUrl` | String |
| `joinedAt` | String (ISO date) |
| `status` | String (`"user"` or `"admin"`) |

### Trips Collection — required attributes

| Attribute | Type |
|---|---|
| `userId` | String |
| `tripDetails` | String (JSON blob) |
| `imageUrls` | String[] |
| `createdAt` | String (ISO date) |
| `payment_link` | String |

After signing in for the first time, update your user document's `status` field to `"admin"` in the Appwrite console to access the admin dashboard.

---

## How AI Trip Generation Works

1. Admin fills out the trip form (country, duration, travel style, interests, budget, group type)
2. The form POSTs to the `/api/create-trip` server action
3. The action builds a prompt and calls **Google Gemini** to generate a structured JSON itinerary
4. **Unsplash** is queried for destination photos
5. The trip is saved to **Appwrite** with the itinerary and image URLs
6. A **Stripe** product and payment link are created and attached to the trip
7. The admin is redirected to the new trip's detail page

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | Run TypeScript type checking |
