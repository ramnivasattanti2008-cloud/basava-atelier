import { Suspense } from "react";
import { notFound } from "next/navigation";
import { seedProducts, findSeedProduct } from "@/data/catalogue";
import ProductDetailView from "./ProductDetailView";

export async function generateStaticParams() {
  return seedProducts.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = findSeedProduct(slug);
  if (!product) notFound();

  return (
    <Suspense fallback={<div className="shell py-20 text-center"><p className="font-display text-2xl">Loading piece…</p></div>}>
      <ProductDetailView initialSlug={slug} />
    </Suspense>
  );
}
