"use client";

import { useSearchParams } from "next/navigation";
import { ProductForm } from "@/components/ProductForm";

export default function NewProductPageClient() {
  const searchParams = useSearchParams();
  const ideaTitle = searchParams.get("title");
  const ideaDesc = searchParams.get("description");
  const innovator = searchParams.get("innovator");

  const fromInnovator = Boolean(searchParams.get("fromIdea") && ideaTitle);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">
        {fromInnovator ? "Promote innovator product" : "Add product"}
      </h1>
      <p className="text-muted mb-8">
        TechFlare built-in products or innovator-shared products — set status to Ready, In the Fire, or Coming.
      </p>
      <ProductForm
        initial={
          fromInnovator
            ? {
                title: ideaTitle || "",
                description: ideaDesc || "",
                tagline: "Innovator shared product",
                source: "innovator",
                innovatorName: innovator || "",
                status: "in-development",
              }
            : undefined
        }
        submitLabel="Add product"
      />
    </div>
  );
}
