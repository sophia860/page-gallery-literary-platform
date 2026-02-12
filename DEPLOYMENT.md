# Deployment Guide - Page Gallery Literary Platform

This guide will help you deploy the Page Gallery Literary Platform to production at thepagegalleryjournal.com.

## Prerequisites

1. **Supabase Account** - Create a free account at [supabase.com](https://supabase.com)
2. **Vercel Account** - Create a free account at [vercel.com](https://vercel.com)
3. **Domain Access** - Access to DNS settings for thepagegalleryjournal.com

## Step 1: Set Up Supabase

### 1.1 Create a New Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in:
   - **Name**: Page Gallery
   - **Database Password**: (generate a secure password)
   - **Region**: Choose closest to your users
4. Click "Create new project" and wait for setup to complete

### 1.2 Get Your Supabase Credentials

1. In your project dashboard, go to **Settings** → **API**
2. Copy these values (you'll need them later):
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJhbG...`)

### 1.3 Configure Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider (enabled by default)
3. **Optional**: Enable **GitHub OAuth**:
   - Go to GitHub → Settings → Developer Settings → OAuth Apps
   - Create new OAuth App
   - Set Authorization callback URL to: `https://your-project.supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret
   - Paste them in Supabase GitHub provider settings

### 1.4 Configure Redirect URLs

1. Go to **Authentication** → **URL Configuration**
2. Add these to **Redirect URLs**:
   - `http://localhost:3000/auth/callback` (for local development)
   - `https://thepagegalleryjournal.com/auth/callback` (production)
   - `https://your-vercel-url.vercel.app/auth/callback` (Vercel preview)
3. Set **Site URL** to: `https://thepagegalleryjournal.com`

## Step 2: Deploy to Vercel

### 2.1 Connect Your Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository: `sophia860/page-gallery-literary-platform`
4. Click **"Import"**

### 2.2 Configure Environment Variables

Before deploying, add these environment variables:

1. In the "Configure Project" step, scroll to **Environment Variables**
2. Add the following variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=https://thepagegalleryjournal.com
```

3. Click **"Deploy"** and wait for the build to complete

### 2.3 Configure Custom Domain

1. After deployment, go to your project in Vercel
2. Click **Settings** → **Domains**
3. Add your domain: `thepagegalleryjournal.com`
4. Vercel will provide DNS records to add

## Step 3: Configure DNS

1. Go to your domain registrar's DNS settings
2. Add the DNS records provided by Vercel:
   - **Type**: A
   - **Name**: @ (or leave blank)
   - **Value**: Vercel's IP (e.g., `76.76.21.21`)
   
   OR
   
   - **Type**: CNAME
   - **Name**: @ (or leave blank)
   - **Value**: `cname.vercel-dns.com`

3. For `www` subdomain:
   - **Type**: CNAME
   - **Name**: www
   - **Value**: `cname.vercel-dns.com`

4. Wait for DNS propagation (can take up to 48 hours, usually much faster)

## Step 4: Verify Deployment

### 4.1 Test Authentication

1. Visit `https://thepagegalleryjournal.com/signin`
2. Try signing in with email/password
3. Test GitHub OAuth (if configured)
4. Verify redirect to `/editor-dashboard` after login

### 4.2 Test Protected Routes

1. Try accessing `/editor-dashboard` without logging in
2. Verify you're redirected to `/signin`
3. After login, verify you can access the dashboard

## Step 5: Set Up Automatic Deployments

Vercel automatically deploys on every push to `main` branch:

- **Production**: Deploys from `main` branch to thepagegalleryjournal.com
- **Preview**: Deploys from other branches to temporary URLs

## Local Development Setup

### 1. Clone and Install

```bash
git clone https://github.com/sophia860/page-gallery-literary-platform.git
cd page-gallery-literary-platform
pnpm install
```

### 2. Configure Environment Variables

Create a `.env.local` file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Troubleshooting

### Login Not Working

1. **Check environment variables** are set correctly in Vercel
2. **Verify redirect URLs** in Supabase match your domain
3. **Check browser console** for error messages
4. **Ensure CORS** is not blocking requests

### GitHub OAuth Issues

1. **Verify callback URL** in GitHub OAuth app settings
2. **Check Client ID and Secret** are correct in Supabase
3. **Ensure GitHub provider** is enabled in Supabase

### Domain Not Working

1. **Check DNS propagation**: Use [whatsmydns.net](https://www.whatsmydns.net/)
2. **Verify DNS records** match Vercel's instructions
3. **Clear browser cache** and try incognito mode
4. **Wait up to 48 hours** for full DNS propagation

### Build Failures

1. **Check build logs** in Vercel dashboard
2. **Verify all dependencies** are in package.json
3. **Test build locally**: `pnpm build`
4. **Check TypeScript errors**: `pnpm lint`

## Monitoring and Maintenance

### Vercel Analytics

1. Enable Vercel Analytics in project settings
2. Monitor page views, performance, and errors

### Supabase Dashboard

1. Monitor authentication activity
2. Check database usage and performance
3. Review error logs

### Updates and Maintenance

1. Keep dependencies updated: `pnpm update`
2. Monitor security alerts on GitHub
3. Test changes in preview deployments before merging to main

## Support

For issues or questions:

1. Check [Next.js Documentation](https://nextjs.org/docs)
2. Review [Supabase Docs](https://supabase.com/docs)
3. Visit [Vercel Documentation](https://vercel.com/docs)
4. Open an issue in the GitHub repository

## Security Checklist

- [ ] Environment variables are set correctly
- [ ] Supabase RLS (Row Level Security) policies are configured
- [ ] Authentication is working properly
- [ ] Protected routes require authentication
- [ ] HTTPS is enabled (automatic with Vercel)
- [ ] No sensitive data in git repository
- [ ] `.env.local` is in `.gitignore`

## Next Steps

After successful deployment:

1. Set up email templates in Supabase
2. Configure custom SMTP settings (optional)
3. Set up database tables for submissions
4. Implement editor dashboard functionality
5. Add user management features
6. Set up backup procedures
