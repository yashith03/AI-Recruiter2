// app/layout.js

"use client";

import { Outfit } from "next/font/google";
import "./globals.css";
import Provider from "./provider";
import { Toaster } from "sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["100","200","300","400","500","600","700","800","900"],
});

export default function RootLayout({ children }) {
  // Create QueryClient in component to avoid sharing between requests
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,        // 1 minute
        cacheTime: 10 * 60 * 1000,   // 10 minutes
        refetchOnWindowFocus: false, // Avoid aggressive refetch
        retry: 1,                     // One retry on failure
      },
    },
  }));

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>AI Recruiter - Hire Faster</title>
        <link rel="icon" href="/favicon.png" />
        <meta name="description" content="Streamline your recruitment process from creation to feedback with intelligent AI voice conversations." />
      </head>
      <body suppressHydrationWarning className={`${outfit.variable} antialiased`}>
        <QueryClientProvider client={queryClient}>
          <Provider>
            {children}
            <Toaster />
            <SpeedInsights />
          </Provider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
