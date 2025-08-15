# SaaS LMS Platform

A full-featured SaaS-based Learning Management System (LMS) built with **Next.js**, **Supabase**, and **Clerk**, featuring AI-powered voice tutors and subscription-based access.


---

## 🚀 Features

- 🎙️ **AI Voice Tutors**: Interactive tutoring via voice agents powered by Vapi.
- 🔐 **Authentication**: Secure sign-in and sign-up with Clerk (including OAuth support).
- 💳 **Billing & Subscriptions**: Managed through Clerk with Stripe integration.
- 🔖 **Bookmarks & History**: Track previous learning sessions and favorite tutors.
- 🧱 **Reusable Components**: Modular architecture using shadcn/ui & Tailwind CSS.
- 🧠 **Create AI Tutors**: Users can customize and deploy their own AI tutors.
- 🧩 **Responsive UI**: Mobile-first design for cross-device compatibility.
- 🧮 **Real-time Database**: Backed by Supabase for authentication and storage.
- 🔍 **Search and Filter**: Easily find tutors based on subject and topic.

---

## 🛠️ Tech Stack

- **Next.js** – Full-stack React framework
- **Supabase** – Realtime backend (PostgreSQL, Auth, Storage)
- **Clerk** – Authentication and billing
- **Stripe** – Subscription payment processing
- **Tailwind CSS** – Utility-first CSS framework
- **shadcn/ui** – Component library based on Radix UI
- **TypeScript** – Static typing for scalability
- **Vapi** – Voice AI agent integration
- **Zod** – Schema validation for TypeScript
- **Sentry** – Monitoring and error reporting

---

## 🚦 How to Run This Project

### 1. Clone the repository
```sh
git clone https://github.com/UmenSama/saas-app.git
cd saas-app/saas-app
```

### 2. Install dependencies
```sh
npm install
```

### 3. Set up environment variables
- Copy `.env.example` to `.env.local` (if present)
- Fill in your Supabase, Clerk, and any other required keys

### 4. Run the development server
```sh
npm run dev
```
- The app will be available at `http://localhost:3000`

### 5. Build for production
```sh
npm run build
```

### 6. Start the production server
```sh
npm start
```

---

## 📝 Notes
- Make sure your Supabase and Clerk projects are set up and configured in `.env.local`
- For Sentry integration, add your Sentry DSN to the environment variables
- For AI features, ensure any required API keys are present
- If you encounter database errors, run the SQL migrations in `/database/migrations/` on your Supabase instance

---