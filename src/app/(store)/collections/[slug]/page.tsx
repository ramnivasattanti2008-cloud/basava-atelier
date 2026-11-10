import { Suspense, use } from "react";
import { notFound } from "next/navigation";
import { seedCategories } from "@/data/categories";
import CollectionView from "./CollectionView";

export async function generateStaticParams() {
  return seedCategories.map((c) => ({ slug: c.slug }));
}

function CollectionContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const category = seedCategories.find((c) => c.slug === slug);
  if (!category) notFound();

  return <CollectionView categorySlug={slug} />;
}

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<div className="shell py-20 text-center"><p className="font-display text-2xl">Loading collection…</p></div>}>
      <CollectionContent params={params} />
    </Suspense>
  );
}

