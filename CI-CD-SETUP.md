# CI/CD Setup Guide

This document outlines the CI/CD pipeline setup for the Expense Tracker application.

## GitHub Actions Workflow

The CI/CD pipeline is configured in `.github/workflows/ci-cd.yml` and includes:

### Frontend Pipeline
- **Linting**: ESLint checks for code quality
- **Type Checking**: TypeScript compilation verification
- **Format Check**: Prettier formatting validation
- **Build**: Next.js production build

### Backend Pipeline
- **Dependency Installation**: npm install
- **Tests**: Run backend test suite

### Deployment
- **Preview Deployments**: Automatic deployment for pull requests
- **Production Deployments**: Automatic deployment for main branch pushes

## Vercel Configuration

### Required Environment Variables

Set these in your Vercel project settings:

```
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXTAUTH_URL=https://your-frontend-domain.com
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### GitHub Secrets Required

Add these secrets to your GitHub repository:

1. **VERCEL_TOKEN**: Your Vercel API token
2. **VERCEL_ORG_ID**: Your Vercel organization ID
3. **VERCEL_PROJECT_ID**: Your Vercel project ID
4. **NEXT_PUBLIC_API_URL**: Your backend API URL

## Setup Instructions

### 1. Vercel Setup
1. Connect your GitHub repository to Vercel
2. Set the root directory to `apps/frontend`
3. Configure environment variables in Vercel dashboard

### 2. GitHub Secrets
1. Go to your repository settings
2. Navigate to "Secrets and variables" > "Actions"
3. Add the required secrets listed above

### 3. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://your-domain.com/api/auth/callback/google` (production)

## Branch Strategy

- **main**: Production branch (auto-deploys to production)
- **develop**: Development branch (auto-deploys to preview)
- **feature/***: Feature branches (auto-deploys to preview)

## Local Development

1. Copy `env.example` to `.env.local`
2. Fill in your environment variables
3. Run `pnpm dev` in the frontend directory

## Monitoring

- **GitHub Actions**: Check workflow runs in the Actions tab
- **Vercel**: Monitor deployments in the Vercel dashboard
- **Logs**: View application logs in Vercel's function logs
