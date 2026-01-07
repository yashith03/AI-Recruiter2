// app/layout.js

import { Outfit } from "next/font/google"; // Line 1
import "./globals.css";
import Provider from "./provider";
import { Toaster } from "sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["100","200","300","400","500","600","700","800","900"],
});

export const metadata = {
  title: "AI Recruiter - Hire Faster",
  icons: {
    icon: "favicon.avif",
  },
  description:
    "Streamline your recruitment process from creation to feedback with intelligent AI voice conversations.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${outfit.variable} antialiased`}>
        <Provider>
          {children}
          <Toaster />
          <SpeedInsights />
        </Provider>
      </body>
    </html>
  );
}
