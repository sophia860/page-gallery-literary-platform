# Page Gallery Literary Platform

> A literary submission platform for sharing poetry, prose, and essays with integrated authentication and editorial dashboard

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sophia860/page-gallery-literary-platform)

## Overview

Page Gallery is a web-based platform designed to facilitate the submission and editorial review of literary works. The platform supports multiple content types including poetry, prose, essays, and hybrid works, with secure authentication powered by Supabase.

## Features

### Authentication
- **Email/Password Login**: Secure authentication with Supabase
- **GitHub OAuth**: Optional social login integration
- **Protected Routes**: Automatic redirect for unauthenticated users
- **Session Management**: Persistent authentication across page refreshes

### Editor Dashboard
- **Submission Queue Management**: Track submissions through various stages (Pending, Under Review, Accepted, Scheduled, Rejected)
- **Filter by Genre**: Easily filter submissions by poetry, prose, essay, or hybrid categories
- **Quick Actions**: Accept or reject submissions with one click
- **Editorial Notes**: Add detailed feedback for writers
- **Publishing Options**: Schedule publications or publish immediately upon acceptance
- **Statistics Tracking**: Monitor monthly submissions, review rates, and acceptance percentages

### Content Types Supported
- Poetry
- Prose
- Essays
- Hybrid works

## Quick Start

### Prerequisites
- Node.js 18+ and pnpm (or npm/yarn)
- A [Supabase](https://supabase.com) account (free tier available)
- A [Vercel](https://vercel.com) account for deployment (optional, free tier available)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/sophia860/page-gallery-literary-platform.git
   cd page-gallery-literary-platform
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure Supabase** (see [Setup Guide](#supabase-setup))
   
   Edit `.env.local` with your Supabase credentials:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Supabase Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project" and fill in:
   - **Name**: Page Gallery
   - **Database Password**: Generate a secure password
   - **Region**: Choose closest to your users
3. Wait for project setup to complete

### 2. Get Your Credentials

1. In your project dashboard, navigate to **Settings → API**
2. Copy:
   - **Project URL** (`NEXT_PUBLIC_SUPABASE_URL`)
   - **anon/public key** (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)

### 3. Configure Authentication

1. Go to **Authentication → URL Configuration**
2. Add these redirect URLs:
   - `http://localhost:3000/auth/callback` (development)
   - `https://yourdomain.com/auth/callback` (production)

### 4. (Optional) Enable GitHub OAuth

1. Create a GitHub OAuth app:
   - Go to GitHub → Settings → Developer Settings → OAuth Apps
   - Authorization callback URL: `https://[your-project-ref].supabase.co/auth/v1/callback`
2. In Supabase: **Authentication → Providers → GitHub**
3. Enable and paste Client ID and Client Secret

## Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL`
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sophia860/page-gallery-literary-platform)

### Custom Domain

1. In Vercel: **Settings → Domains**
2. Add your domain (e.g., `thepagegalleryjournal.com`)
3. Update DNS records as instructed
4. Update Supabase redirect URLs to include your custom domain

## Project Structure

```
page-gallery-literary-platform/
├── app/
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts           # OAuth callback handler
│   ├── editor-dashboard/          # Protected editor interface
│   ├── signin/
│   │   └── page.tsx               # Sign-in page
│   ├── signup/
│   │   └── page.tsx               # Sign-up page
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home page
│   └── globals.css                # Global styles
├── lib/
│   └── supabase/
│       ├── client.ts              # Browser Supabase client
│       └── server.ts              # Server Supabase client
├── middleware.ts                  # Auth middleware
├── .env.example                   # Environment variables template
├── DEPLOYMENT.md                  # Deployment guide
├── package.json                   # Dependencies
└── README.md                      # This file
```

## Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **Language**: TypeScript
- **Authentication**: [Supabase Auth](https://supabase.com/auth)
- **Styling**: TailwindCSS
- **UI Components**: Radix UI
- **Deployment**: Vercel
- **Fonts**: Cardo (Google Fonts)

## Authentication Flow

1. User visits `/signin` or `/signup`
2. Enters credentials or uses GitHub OAuth
3. Supabase handles authentication
4. OAuth redirects to `/auth/callback`
5. Middleware protects `/editor-dashboard`
6. Authenticated users access editor features

## Usage

### For Writers

1. Visit the home page
2. Browse published works
3. Submit your writing through the submission form
4. Track submission status via email notifications

### For Editors

1. Sign in at `/signin`
2. Access the editor dashboard at `/editor-dashboard`
3. Review pending submissions
4. Filter by genre (Poetry, Prose, Essay)
5. Accept/reject with editorial feedback
6. Schedule or immediately publish accepted works

## Development

### Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |
| `NEXT_PUBLIC_SITE_URL` | Your site URL | Yes |

## Troubleshooting

### Login Issues

- **Check environment variables** are set correctly
- **Verify redirect URLs** in Supabase match your domain
- **Clear browser cache** and cookies
- **Check browser console** for error messages

### Build Errors

- Run `pnpm install` to ensure dependencies are installed
- Check TypeScript errors: `pnpm lint`
- Verify all environment variables are set

### OAuth Not Working

- Verify callback URL in OAuth provider settings
- Check provider is enabled in Supabase dashboard
- Ensure credentials are correct

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Security

- All authentication is handled by Supabase
- Environment variables are never exposed to the client (except those prefixed with `NEXT_PUBLIC_`)
- Middleware protects authenticated routes
- HTTPS is enforced in production (automatic with Vercel)
- Security headers are configured in `vercel.json`

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Support

- **Documentation**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
- **Issues**: Open an issue on GitHub for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions

## Roadmap

- [ ] Database schema for submissions
- [ ] Email notifications for submission updates
- [ ] Advanced filtering and search
- [ ] Writer profiles and portfolios
- [ ] Multi-editor collaboration features
- [ ] Submission analytics and reporting
- [ ] Public-facing journal pages
- [ ] RSS feed for published works

## Acknowledgments

- Built with [Next.js](https://nextjs.org)
- Authentication by [Supabase](https://supabase.com)
- Deployed on [Vercel](https://vercel.com)
- UI components from [Radix UI](https://www.radix-ui.com)

---

**Live Site**: [thepagegalleryjournal.com](https://thepagegalleryjournal.com)

**Repository**: [github.com/sophia860/page-gallery-literary-platform](https://github.com/sophia860/page-gallery-literary-platform)
