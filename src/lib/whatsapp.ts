/**
 * Click-to-chat links. Messages carry the piece or reference being asked
 * about — never the shopper's own details.
 */
export function whatsappLink(number: string, message: string): string {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export const whatsappMessages = {
  general: (brandName: string) => `Hello ${brandName}, I have a question about your leather pieces.`,
  product: (productName: string) => `Hello, I would like to ask about this piece: ${productName}.`,
  custom: (reference: string, productType: string) =>
    `Hello, I have just sent custom request ${reference} (${productType}) through the website.`,
  order: (orderId: string) => `Hello, I have a question about order ${orderId}.`,
};
