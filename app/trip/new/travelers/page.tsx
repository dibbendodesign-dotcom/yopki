import type { Metadata } from "next";
import { AppHeader } from "@/components/trip/AppHeader";
import { TravelersStep } from "@/components/trip/TravelersStep";

export const metadata: Metadata = {
  title: "Who's travelling · Yopki",
};

/** Trip creation — step 2: trip type (solo, partner or family). */
export default function TravelersPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[linear-gradient(116.25deg,var(--color-bg-gradient-from)_0.585%,var(--color-bg-gradient-to)_100.49%)]">
      <AppHeader />
      <TravelersStep />
    </div>
  );
}
