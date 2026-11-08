import Image from "next/image";
import Link from "next/link";

/** Top navigation bar for the onboarding / trip creation flow (Figma node 49:6389). */
export function AppHeader() {
  return (
    <header className="flex w-full items-center justify-between border-b border-stroke-soft-200 px-11 py-6">
      <Image src="/trip/v3/yopki-logo.svg" alt="Yopki" width={72} height={40} priority />
      <Link
        href="/"
        aria-label="Close trip planner"
        className="flex shrink-0 rounded-6 transition-colors outline-none hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-primary-base/30"
      >
        <Image src="/trip/v3/close-fill.svg" alt="" width={28} height={28} />
      </Link>
    </header>
  );
}
