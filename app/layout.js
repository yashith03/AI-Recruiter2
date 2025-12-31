// app/layout.js

import { Outfit } from "next/font/google";
import "./globals.css";
import Provider from "./provider"; 
import { Toaster } from "sonner";
import { SpeedInsights } from "@vercel/speed-insights/next"; 

const outfit = Outfit({ 
  variable: "--font-outfit", 
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "AI Recruiter - Hire Faster",
  description: "Streamline your recruitment process from creation to feedback with intelligent AI voice conversations. Save time and reduce bias automatically.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" 
        />
      </head>
      <body className={`${outfit.variable} antialiased`}>
        <Provider>
          {children}
          <Toaster />
          <SpeedInsights /> 
        </Provider>
      </body>
    </html>
  );
}
