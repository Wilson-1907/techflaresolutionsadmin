"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProductForm, type ProductFormValues } from "@/components/ProductForm";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const [initial, setInitial] = useState<Partial<ProductFormValues>>();
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/catalog/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.product) {
          setInitial({
            ...d.product,
            imageUrl: d.product.image || "",
            externalUrl: d.product.externalUrl || "",
          });
        } else setError("Product not found");
      })
      .catch(() => setError("Failed to load product"));
  }, [id]);

  if (error) return <p className="text-red-400">{error}</p>;
  if (!initial) return <p className="text-muted">Loading...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Edit product</h1>
      <ProductForm initial={initial} productId={id} submitLabel="Update product" />
    </div>
  );
}
