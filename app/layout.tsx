import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

/** Trip flow v2 screens are set in Plus Jakarta Sans (Figma "1" frame). */
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yopki",
  description: "Plan your trip with Yopki",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={cn("h-full antialiased", inter.variable, jakarta.variable)}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
