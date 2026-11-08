import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Agentation } from "agentation";
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

const isDev = process.env.NODE_ENV === "development";
const isVercelPreview = process.env.NEXT_PUBLIC_VERCEL_ENV === "preview";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={cn("h-full antialiased", inter.variable)}>
      <body className="min-h-full flex flex-col">
        {children}
        {/*
          Feedback toolbar: on locally (synced to the agentation MCP server)
          and on Vercel preview deployments (copy-only). Never in production.
        */}
        {isDev && (
          <Agentation endpoint="http://localhost:4747" appName="Yopki" />
        )}
        {isVercelPreview && <Agentation appName="Yopki (preview)" />}
      </body>
    </html>
  );
}
