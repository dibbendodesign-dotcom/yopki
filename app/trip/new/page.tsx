import type { Metadata } from "next";
import { AppHeader } from "@/components/trip/AppHeader";
import { CityStep } from "@/components/trip/CityStep";

export const metadata: Metadata = {
  title: "Choose your city · Yopki",
};

/** Trip creation — step 1: city selection (Figma "1", node 17:8649). */
export default function CitySelectionPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[linear-gradient(116.25deg,var(--color-bg-gradient-from)_0.585%,var(--color-bg-gradient-to)_100.49%)] font-jakarta [font-feature-settings:'calt'_0,'liga'_0]">
      <AppHeader />
      <CityStep />
    </div>
  );
}
