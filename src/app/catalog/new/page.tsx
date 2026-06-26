import { Suspense } from "react";
import NewProductPageClient from "./NewProductPageClient";

export default function NewProductPage() {
  return (
    <Suspense fallback={<p className="text-muted">Loading...</p>}>
      <NewProductPageClient />
    </Suspense>
  );
}
