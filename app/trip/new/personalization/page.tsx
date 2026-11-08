import type { Metadata } from "next";
import { AppHeader } from "@/components/trip/AppHeader";
import { PersonalizationStep } from "@/components/trip/PersonalizationStep";

export const metadata: Metadata = {
  title: "Preferences · Yopki",
};

/** Trip creation — step 4: must-dos and must-avoids. Figma 17:9403. */
export default function PersonalizationPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[linear-gradient(116.25deg,var(--color-bg-gradient-from)_0.585%,var(--color-bg-gradient-to)_100.49%)]">
      <AppHeader />
      <PersonalizationStep />
    </div>
  );
}
