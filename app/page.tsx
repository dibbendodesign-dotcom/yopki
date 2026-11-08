import type { Metadata } from "next";
import { AppHeader } from "@/components/trip/AppHeader";
import { CityStep } from "@/components/trip/CityStep";

export const metadata: Metadata = {
  title: "Choose your city · Yopki",
};

/** Home — trip creation step 1: city selection (Figma "1 · Built from code", node 49:6388). */
export default function HomePage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[linear-gradient(116.25deg,var(--color-bg-gradient-from)_0.585%,var(--color-bg-gradient-to)_100.49%)]">
      <AppHeader />
      <CityStep />
    </div>
  );
}
