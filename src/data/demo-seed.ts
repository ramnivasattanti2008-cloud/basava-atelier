import type { CustomEnquiry, Order, OrderItem, OrderStatus, Product } from "@/lib/types";

/**
 * Sample operational records for the admin demonstration.
 *
 * These are NOT real customers, orders or enquiries. Every record carries
 * `sample: true` and is badged "Sample" in the admin. Names are generic,
 * e-mail addresses use example.com and phone numbers are non-working.
 */

const DAY = 86_400_000;

const samplePeople = [
  { name: "Ananya Rao", email: "ananya.rao@example.com", phone: "+91 90000 00001", city: "Bengaluru", state: "Karnataka", pin: "560001" },
  { name: "Meera Iyer", email: "meera.iyer@example.com", phone: "+91 90000 00002", city: "Chennai", state: "Tamil Nadu", pin: "600001" },
  { name: "Kavya Nair", email: "kavya.nair@example.com", phone: "+91 90000 00003", city: "Kochi", state: "Kerala", pin: "682001" },
  { name: "Sneha Kulkarni", email: "sneha.k@example.com", phone: "+91 90000 00004", city: "Pune", state: "Maharashtra", pin: "411001" },
  { name: "Divya Menon", email: "divya.menon@example.com", phone: "+91 90000 00005", city: "Hyderabad", state: "Telangana", pin: "500001" },
  { name: "Rohan Shetty", email: "rohan.shetty@example.com", phone: "+91 90000 00006", city: "Mumbai", state: "Maharashtra", pin: "400001" },
];

const orderPlan: Array<{
  daysAgo: number;
  person: number;
  status: OrderStatus;
  method: Order["paymentMethod"];
  slugs: string[];
}> = [
  { daysAgo: 12, person: 0, status: "delivered", method: "upi", slugs: ["textured-stylish-genuine-leather-brown-tote-carryall"] },
  { daysAgo: 10, person: 1, status: "delivered", method: "card", slugs: ["textured-rustic-romance-genuine-leather-brown-envelope-bag", "textured-urban-genuine-leather-black-wrislet"] },
  { daysAgo: 8, person: 2, status: "delivered", method: "upi", slugs: ["solid-classic-genuine-leather-grey-shoulder-bag"] },
  { daysAgo: 6, person: 3, status: "dispatched", method: "netbanking", slugs: ["textured-effortless-genuine-leather-chic-red-crossbody"] },
  { daysAgo: 5, person: 4, status: "dispatched", method: "upi", slugs: ["textured-chic-and-spacious-genuine-leather-chocolate-tote-companion", "textured-modern-simplicity-genuine-leather-gold-envelope-bag"] },
  { daysAgo: 3, person: 5, status: "packed", method: "upi", slugs: ["functional-and-fashionable-genuine-leather-black-crossbody-companion"] },
  { daysAgo: 1, person: 0, status: "paid", method: "card", slugs: ["textured-leather-chic-genuine-brown-sling-bag"] },
  { daysAgo: 0, person: 2, status: "placed", method: "upi", slugs: ["textured-trendy-genuine-leather-tote-shoulder-bag"] },
];

const statusPath: OrderStatus[] = ["placed", "paid", "packed", "dispatched", "delivered"];

export function buildSampleOrders(products: Product[], now: number): Order[] {
  return orderPlan.map((plan, index) => {
    const person = samplePeople[plan.person];
    const createdAt = now - plan.daysAgo * DAY - (index + 2) * 2_700_000;
    const items: OrderItem[] = plan.slugs
      .map((slug) => products.find((p) => p.slug === slug))
      .filter((p): p is Product => Boolean(p))
      .map((p) => ({
        productId: p.id,
        name: p.name,
        slug: p.slug,
        image: p.images[0] ?? null,
        colour: p.colours[0] ?? null,
        quantity: 1,
        unitPriceINR: p.priceINR ?? 0,
      }));
    const subtotal = items.reduce((sum, item) => sum + item.unitPriceINR * item.quantity, 0);
    const reached = statusPath.slice(0, statusPath.indexOf(plan.status) + 1);
    return {
      id: `KD-${10001 + index}`,
      createdAt: new Date(createdAt).toISOString(),
      status: plan.status,
      customer: { name: person.name, email: person.email, phone: person.phone },
      address: { line1: "Sample address line", line2: "", city: person.city, state: person.state, pin: person.pin },
      items,
      subtotalINR: subtotal,
      shippingINR: 0,
      totalINR: subtotal,
      paymentMethod: plan.method,
      paymentState: "demo" as const,
      note: "",
      sample: true,
      history: reached.map((status, step) => ({
        status,
        at: new Date(Math.min(now, createdAt + step * 0.9 * DAY)).toISOString(),
      })),
    };
  });
}

export function buildSampleEnquiries(products: Product[], now: number): CustomEnquiry[] {
  const reference = products.find((p) => p.slug === "textured-stylish-genuine-leather-sand-tote-carryall");
  return [
    {
      id: "CR-2001",
      createdAt: new Date(now - 9 * DAY).toISOString(),
      status: "in_progress",
      productType: "Tote",
      referenceProduct: reference?.slug ?? null,
      colour: "Brown",
      material: "Genuine leather",
      engraving: "A.R.",
      dimensions: "A little wider than the Sand Tote Carryall",
      quantity: 1,
      budget: "₹5,000 – ₹10,000",
      requirements: "Like the tote in the catalogue photo, but with a zip pocket inside and initials on the tag.",
      images: reference?.images[0] ? [reference.images[0]] : [],
      customer: { name: samplePeople[0].name, email: samplePeople[0].email, phone: samplePeople[0].phone },
      internalNote: "Sample note: quote accepted, cutting scheduled.",
      sample: true,
    },
    {
      id: "CR-2002",
      createdAt: new Date(now - 4 * DAY).toISOString(),
      status: "quoted",
      productType: "Belt",
      referenceProduct: null,
      colour: "Brown",
      material: "Genuine leather",
      engraving: "",
      dimensions: "Waist 34",
      quantity: 2,
      budget: "₹2,500 – ₹5,000",
      requirements: "Two matching belts as a gift. Brass buckle if possible.",
      images: [],
      customer: { name: samplePeople[5].name, email: samplePeople[5].email, phone: samplePeople[5].phone },
      internalNote: "",
      sample: true,
    },
    {
      id: "CR-2003",
      createdAt: new Date(now - 2 * DAY).toISOString(),
      status: "reviewing",
      productType: "Sleeve or pouch",
      referenceProduct: null,
      colour: "Black",
      material: "No preference",
      engraving: "MEERA",
      dimensions: "To fit a 13-inch laptop",
      quantity: 1,
      budget: "Not sure yet",
      requirements: "A simple sleeve with the name engraved on the front corner.",
      images: [],
      customer: { name: samplePeople[1].name, email: samplePeople[1].email, phone: samplePeople[1].phone },
      internalNote: "",
      sample: true,
    },
    {
      id: "CR-2004",
      createdAt: new Date(now - 6 * 3_600_000).toISOString(),
      status: "new",
      productType: "Sling or crossbody",
      referenceProduct: null,
      colour: "Sand",
      material: "Leather with canvas",
      engraving: "",
      dimensions: "",
      quantity: 1,
      budget: "Under ₹2,500",
      requirements: "Small sling for everyday use with an outside phone pocket.",
      images: [],
      customer: { name: samplePeople[3].name, email: samplePeople[3].email, phone: samplePeople[3].phone },
      internalNote: "",
      sample: true,
    },
  ];
}
