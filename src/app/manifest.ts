import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kris Designs — Bespoke Leather Goods",
    short_name: "Kris Designs",
    description: "Handcrafted bespoke leather bags and accessories made in Bengaluru.",
    start_url: "/",
    display: "standalone",
    background_color: "#f3ede3",
    theme_color: "#251911",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
