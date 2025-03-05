# SentWatch Platform - Setup Guide

## Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Git
- Supabase CLI
- Vercel CLI (optional)

## Initial Setup

1. Clone the repository:
```bash
git clone https://github.com/your-org/sentwatch.git
cd sentwatch
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure Supabase:
```bash
supabase init
supabase start
```

5. Run database migrations:
```bash
pnpm db:migrate
```

6. Start development server:
```bash
pnpm dev
```

## Environment Variables

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key

# Stripe
STRIPE_SECRET_KEY=your-stripe-secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your-google-maps-key

# Other
NEXT_PUBLIC_DEFAULT_LANGUAGE=en
```

## Development Workflow

1. Create feature branch:
```bash
git checkout -b feature/your-feature
```

2. Make changes and test:
```bash
pnpm test
pnpm lint
```

3. Build for production:
```bash
pnpm build
```

4. Deploy to staging:
```bash
vercel
```

## Database Migrations

1. Create migration:
```bash
pnpm migration:create my-migration
```

2. Apply migrations:
```bash
pnpm migration:up
```

3. Rollback migration:
```bash
pnpm migration:down
```

## Testing

1. Run unit tests:
```bash
pnpm test
```

2. Run E2E tests:
```bash
pnpm test:e2e
```

3. Check coverage:
```bash
pnpm test:coverage
```

## Deployment

### Staging

```bash
vercel
```

### Production

```bash
vercel --prod
```

## Common Issues

### Database Connection

If you can't connect to Supabase:
1. Check environment variables
2. Ensure Supabase is running
3. Check network access

### Build Errors

1. Clear cache:
```bash
pnpm clean
```

2. Reinstall dependencies:
```bash
pnpm install
```

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)