// app/layout.js

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "./provider"; // ✅ your context provider
import { Toaster } from "sonner";
import { SpeedInsights } from "@vercel/speed-insights/next"; // ✅ import

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "Ai Recruiter",
  description: "AI Recruiter is a comprehensive AI-driven interview platform that streamlines the hiring process by automating interview question generation and candidate assessment. Built with modern web technologies, it enables recruiters and hiring managers to create customized, role-specific interviews in minutes rather than hours.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Provider>
          {children}
          <Toaster />
          <SpeedInsights /> 
        </Provider>
      </body>
    </html>
  );
}
