# Modern E-Commerce Platform

A feature-rich, full-stack E-Commerce application built with **Next.js 14 (App Router)**, **Prisma**, **PostgreSQL**, **NextAuth.js**, **Tailwind CSS**, and **Stripe**.

---

## 🚀 Features

### 🛒 Customer Experience
- **Product Catalog**: Filter by categories, search, paginate, and view rich product details.
- **Shopping Cart**: Real-time slide-over & page cart management powered by Zustand.
- **Seamless Checkout**: Stripe Integration with secure payment processing & webhooks.
- **User Authentication**: Email/Password credentials and optional Google / GitHub OAuth support.
- **User Dashboard**: Profile management, address book, and order tracking.

### 🛡️ Admin Dashboard
- **Analytics Overview**: Store metrics including revenue, total orders, customers, and inventory count.
- **Product Management**: Create, edit, and delete products with category associations.
- **Order Management**: View customer orders and update fulfillment statuses.

### 🎨 UI & UX
- Modern, responsive design built with **Tailwind CSS** and **Radix UI**.
- Dark Mode support with smooth transitions.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router & Server Actions / Route Handlers)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [NextAuth.js v4](https://next-auth.js.org/)
- **Payments**: [Stripe](https://stripe.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), Lucide Icons
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Form Handling & Validation**: React Hook Form + [Zod](https://zod.dev/)
- **Email Service**: [Resend](https://resend.com/)

---

## 🚦 Getting Started

### Prerequisites

- **Node.js**: `v18.x` or higher
- **Package Manager**: `npm`
- **Database**: Local PostgreSQL server or Docker

---

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Abhinav-Krishnan-10/e-commerce.git
   cd e-commerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Fill in your PostgreSQL connection string and secrets in `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ecommerce?schema=public"
   NEXTAUTH_SECRET="your-super-secret-key-min-32-chars"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Database Setup**
   Run Prisma migrations and seed the database with initial sample data:
   ```bash
   # Push schema to database
   npm run db:push

   # Seed sample products and categories
   npm run db:seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server |
| `npm run build` | Builds the production application |
| `npm run start` | Runs the production build server |
| `npm run lint` | Runs Next.js ESLint checks |
| `npm run db:push` | Pushes Prisma schema changes directly to DB |
| `npm run db:seed` | Seeds database with initial sample data |
| `npm run db:studio` | Opens Prisma Studio GUI to inspect DB records |

---

## 📁 Project Structure

```text
e-commerce/
├── prisma/
│   ├── schema.prisma       # Database models & relations
│   └── seed.ts             # Initial database seed script
├── public/                 # Static assets & images
├── src/
│   ├── app/                # Next.js App Router pages & API routes
│   │   ├── (auth)/         # Login, Register, Password reset routes
│   │   ├── (main)/         # Store pages (Products, Cart, Checkout, Account)
│   │   ├── admin/          # Admin management dashboard
│   │   └── api/            # Backend API endpoints
│   ├── components/         # Reusable UI components
│   ├── hooks/              # Custom React hooks (e.g., useCart)
│   ├── lib/                # Database, Auth, Stripe & utility setup
│   └── types/              # TypeScript declaration files
├── docker-compose.yml      # Local Docker configuration for PostgreSQL
├── package.json
└── README.md
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
