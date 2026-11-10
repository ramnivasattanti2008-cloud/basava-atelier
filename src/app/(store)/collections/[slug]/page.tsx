import { Suspense, use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { seedCategories } from "@/data/categories";
import { findSeedProduct, seedProducts } from "@/data/catalogue";
import CollectionView from "./CollectionView";

export async function generateStaticParams() {
  return seedCategories.map((c) => ({ slug: c.slug }));
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = seedCategories.find((c) => c.slug === slug);
  if (!category) notFound();

  return (
    <Suspense fallback={<div className="shell py-20 text-center"><p className="font-display text-2xl">Loading collection…</p></div>}>
      <CollectionView categorySlug={slug} />
    </Suspense>
  );
}
