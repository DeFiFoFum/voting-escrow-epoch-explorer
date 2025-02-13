# Vote Escrow Epoch Explorer

A Next.js application for calculating Vote Escrow epochs. This tool helps users monitor different protocol phases and their respective epoch transitions.

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
