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
