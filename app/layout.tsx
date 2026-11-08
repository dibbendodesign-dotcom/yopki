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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={cn("h-full antialiased", inter.variable)}>
      <body className="min-h-full flex flex-col">
        {children}
        {/*
          Feedback toolbar, shown everywhere. Locally it syncs to the
          agentation MCP server; deployed builds can't reach localhost,
          so there it's copy-only.
        */}
        <Agentation
          endpoint={isDev ? "http://localhost:4747" : undefined}
          appName="Yopki"
        />
      </body>
    </html>
  );
}
