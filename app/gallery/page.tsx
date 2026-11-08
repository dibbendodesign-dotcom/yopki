import type { Metadata } from "next";
import { TripFlowGallery } from "@/components/gallery/TripFlowGallery";

export const metadata: Metadata = {
  title: "UI gallery · Yopki",
  // Internal review page — keep it out of search engines.
  robots: { index: false, follow: false },
};

/** Internal gallery of the trip flow's buttons, inputs and selection cards, with review labels. */
export default function GalleryPage() {
  return (
    <div className="min-h-screen w-full bg-[linear-gradient(116.25deg,var(--color-bg-gradient-from)_0.585%,var(--color-bg-gradient-to)_100.49%)]">
      <TripFlowGallery />
    </div>
  );
}
