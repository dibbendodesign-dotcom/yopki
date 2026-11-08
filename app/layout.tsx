import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

/**
 * Inter with its optical-size axis: browsers apply `opsz` automatically
 * (font-optical-sizing: auto), so 32px titles render as "Inter Display".
 */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  axes: ["opsz"],
});

export const metadata: Metadata = {
  title: "Yopki",
  description: "Plan your trip with Yopki",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={cn("h-full antialiased", inter.variable)}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
