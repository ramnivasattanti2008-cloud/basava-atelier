import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BASAVA — Handcrafted Leather & Bespoke Studio",
    short_name: "BASAVA",
    description: "Rooted in craft. Made for living. Handcrafted bespoke leather bags made in Bengaluru.",
    start_url: "/",
    display: "standalone",
    background_color: "#f1e9da",
    theme_color: "#30251e",
    icons: [
      {
        src: "/images/basava-favicon.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/images/basava-logo.png",
        sizes: "38x32",
        type: "image/png",
      },
    ],
  };
}
