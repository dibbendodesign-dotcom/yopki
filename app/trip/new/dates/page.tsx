import type { Metadata } from "next";
import { AppHeader } from "@/components/trip/AppHeader";
import { DatesStep } from "@/components/trip/DatesStep";

export const metadata: Metadata = {
  title: "When · Yopki",
};

/** Trip creation — step 3: dates (exact or flexible). Figma 66:6752. */
export default function DatesPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[linear-gradient(116.25deg,var(--color-bg-gradient-from)_0.585%,var(--color-bg-gradient-to)_100.49%)]">
      <AppHeader />
      <DatesStep />
    </div>
  );
}
