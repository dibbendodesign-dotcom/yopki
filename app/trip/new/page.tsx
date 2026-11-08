import { redirect } from "next/navigation";

/** Step 1 (Destination) now lives on the homepage; keep old /trip/new links working. */
export default function TripNewPage() {
  redirect("/");
}
