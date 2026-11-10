import { Suspense, use } from "react";
import OrderConfirmationView from "./OrderConfirmationView";

export async function generateStaticParams() {
  return [{ id: "BV-10001" }, { id: "BV-10002" }];
}

function Content({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <OrderConfirmationView orderId={id} />;
}

export default function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="shell py-20 text-center"><p className="font-display text-2xl">Loading confirmation…</p></div>}>
      <Content params={params} />
    </Suspense>
  );
}
