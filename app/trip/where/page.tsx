import type { Metadata } from "next";
import { TripProgress } from "@/components/trip/TripProgress";
import { WhereStep } from "@/components/trip/WhereStep";

export const metadata: Metadata = {
  title: "Where · Yopki",
};

/** Trip creation — step 1 (City): destination search ("Where"). */
export default function WherePage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[linear-gradient(116.25deg,var(--color-bg-gradient-from)_0.585%,var(--color-bg-gradient-to)_100.49%)]">
      <header className="mx-auto w-full max-w-[552px] px-4 pt-10">
        <TripProgress current="City" />
      </header>
      <WhereStep />
    </div>
  );
}
