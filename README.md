# PRIMEPOLICY-AI

Insurance Policy Intelligence Layer. Engineered for high-fidelity conversion of insurance policy specifications into production-ready configuration artifacts.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org) (App Router)
- **Authentication**: [Clerk](https://clerk.com)
- **Database**: [Supabase](https://supabase.com) (PostgreSQL + Vector)
- **AI**: Google Gemini (RAG-powered)
- **Styling**: Tailwind CSS + shadcn/ui

## Getting Started

### 1. Environment Setup

Clone the repository and create a `.env.local` file:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Supabase (Database & Vector Store)
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-project-anon-key

# AI Configuration
GEMINI_API_KEY=your-gemini-key
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Run Locally

```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Features

- **Deep Extraction**: RAG-powered engine for policy attribute identification.
- **Schema Mapping**: Automatic mapping to Guidewire, Duck Creek, or custom JSON.
- **Batch Intake**: High-scale policy processing protocol.

## Auth Protocol

The system uses Clerk for identity management. Routes under `/dashboard` are protected by `proxy.ts`. Authentication persists across client and server environments.
