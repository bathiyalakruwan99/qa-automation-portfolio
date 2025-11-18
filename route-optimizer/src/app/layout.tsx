import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Free Route Optimizer - TSP Solver',
  description: 'Optimize your travel route using the Traveling Salesman Problem. No API keys required. Supports up to 50 locations with map visualization.',
  keywords: 'route optimizer, TSP, traveling salesman, route planning, map, optimization',
  authors: [{ name: 'Route Optimizer' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#3b82f6" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Suppress hydration warnings for browser extension attributes
              const originalConsoleError = console.error;
              console.error = function(...args) {
                if (args[0] && args[0].includes && (
                    args[0].includes('inject_video_svd') || 
                    args[0].includes('data-new-gr-c-s-check-loaded') ||
                    args[0].includes('data-gr-ext-installed') ||
                    args[0].includes('data-qb-installed') ||
                    args[0].includes('suppresshydrationwarning'))) {
                  return;
                }
                originalConsoleError.apply(console, args);
              };
            `,
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  )
}
