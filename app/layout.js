import { Outfit, Material_Symbols_Outlined } from "next/font/google";
import "./globals.css";
import Provider from "./provider";
import { Toaster } from "sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["100","200","300","400","500","600","700","800","900"],
});

const materialSymbols = Material_Symbols_Outlined({
  variable: "--font-material-symbols",
  subsets: ["latin"],
});

export const metadata = {
  title: "AI Recruiter - Hire Faster",
  description:
    "Streamline your recruitment process from creation to feedback with intelligent AI voice conversations.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${materialSymbols.variable} antialiased`}>
        <Provider>
          {children}
          <Toaster />
          <SpeedInsights />
        </Provider>
      </body>
    </html>
  );
}
