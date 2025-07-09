# 🚨 Deployment Fix Guide

## Issues Found:
1. **500 Server Error**: SQLite database doesn't work on Vercel serverless
2. **React Error #31**: Likely from error object rendering
3. **404 Errors**: API routing issues

## Quick Fixes:

### 1. Database Issue (Critical!)
SQLite doesn't work on Vercel. You need PostgreSQL:

**Option A: Use Supabase (Free)**
1. Go to [supabase.com](https://supabase.com) → Create project
2. Get your connection string from Settings → Database
3. Add to Vercel environment variables:
   ```
   DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres
   ```

**Option B: Use Railway (Free)**
1. Go to [railway.app](https://railway.app) → New Project → PostgreSQL
2. Copy connection string
3. Add to Vercel environment variables

### 2. Environment Variables in Vercel
Go to your Vercel project settings and add:
```
DATABASE_URL=your-postgresql-connection-string
JWT_SECRET=your-super-secure-secret-key-min-32-chars
NODE_ENV=production
```

### 3. Create .env file locally
Create `server/.env`:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=5000
FRONTEND_URL="https://buildable-omega.vercel.app"
NODE_ENV="development"
```

### 4. Deploy Steps
1. Create the .env file above
2. Commit and push changes
3. Set up PostgreSQL database
4. Add environment variables to Vercel
5. Redeploy

### 5. Database Setup
After deploying with PostgreSQL:
```bash
# Push database schema
npx prisma db push --schema=server/prisma/schema.prisma
```

This will fix the 500 errors and make your app work properly! 🚀 