# Vote Escrow Epoch Explorer

A Next.js application for calculating Vote Escrow epochs. This tool helps users monitor different protocol phases and their respective epoch transitions.

- [Vote Escrow Epoch Explorer](#vote-escrow-epoch-explorer)
  - [Configuration](#configuration)
    - [Structure](#structure)
    - [Epoch System](#epoch-system)
    - [Protocol Configuration](#protocol-configuration)
    - [Usage](#usage)
    - [Adding New Environments](#adding-new-environments)
  - [Features](#features)
  - [Getting Started](#getting-started)
  - [Project Structure](#project-structure)
  - [Development](#development)
  - [Deploy on Vercel](#deploy-on-vercel)
  - [Contributing](#contributing)

## Configuration

The application supports environment-specific configurations in both TypeScript and JSON formats.

### Structure

```
src/config/
├── environments/        # Environment-specific configs
│   ├── development.ts  # Development environment
│   └── production.ts   # Production environment (create as needed)
├── protocols.ts        # Config loader
└── schema.ts          # Type definitions and validation
```

### Epoch System

The application uses a week-based epoch system where:

- Each epoch starts on Thursday at 00:00 UTC
- Epochs are continuous 7-day periods
- Protocols can reference any epoch using a timestamp-epoch pair

### Protocol Configuration

Each protocol is configured with:

1. A reference timestamp (must be a Thursday 00:00 UTC)
2. The epoch number for that timestamp

Example:

```typescript
{
  id: "alpha",
  name: "Protocol Alpha",
  referenceTimestamp: 1707350400, // Feb 8, 2024 00:00:00 UTC
  referenceEpoch: 0, // This was epoch 0 for this protocol
}
```

The system will:

- Calculate the protocol's first epoch timestamp using:
  `firstEpochTimestamp = referenceTimestamp - (referenceEpoch * WEEK_IN_SECONDS)`
- Use this to determine epoch numbers for any given timestamp

### Usage

1. Create environment configs in `src/config/environments/`:

   ```typescript
   // development.ts
   import { Config } from "../schema";
   
   export const config: Config = {
     protocols: [
       {
         id: "alpha",
         name: "Protocol Alpha",
         color: "#3B82F6",
         logo: "/protocol-alpha.svg",
         referenceTimestamp: 1707350400, // Feb 8, 2024 00:00:00 UTC
         referenceEpoch: 0,
       },
       // ... more protocols
     ],
   };
   ```

2. Set environment:

   ```bash
   NEXT_PUBLIC_ENV=development # or production, staging, etc.
   ```

3. The config loader will:
   - First try to load TypeScript config (`[env].ts`)
   - Fall back to JSON config if TypeScript fails (`[env].json`)
   - Validate the config against the schema
   - Calculate the initial epoch timestamp from the earliest reference point
   - Throw an error if validation fails

### Adding New Environments

1. Create a new config file in `src/config/environments/`:
   - Use TypeScript (`[env].ts`) for type safety
   - Or JSON (`[env].json`) for simpler configs
2. Set `NEXT_PUBLIC_ENV=[env]` when running the app

## Features

- Real-time epoch clock tracking
- Multiple protocol phase visualization
- Protocol-specific epoch transitions
- Dark/Light theme support
- Responsive design

## Getting Started

First, install the dependencies using pnpm:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/                 # Next.js app directory
├── components/          # React components
├── config/             # Configuration files
└── lib/                # Utility functions and hooks
    ├── hooks/          # Custom React hooks
    ├── types/          # TypeScript type definitions
    └── utils/          # Helper functions
```

## Development

This project uses:

- Next.js 15 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- shadcn/ui for UI components
- pnpm as the package manager

## Deploy on Vercel

The easiest way to deploy this Next.js app is to use [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js):

1. Push your code to a Git repository
2. Import your repository on Vercel
3. Vercel will automatically detect Next.js and configure the build settings
4. Your app will be deployed and assigned a URL

For more details, check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
