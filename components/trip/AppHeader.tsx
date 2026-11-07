import Image from "next/image";

/** Top navigation bar for the onboarding / trip creation flow. */
export function AppHeader() {
  return (
    <header className="flex h-[72px] w-full items-center gap-6 border-b border-stroke-soft-200 px-11 py-6">
      <Image src="/trip/yopki-logo.svg" alt="Yopki" width={58} height={32} priority />
    </header>
  );
}
