import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Aquário da Sede",
    short_name: "Aquário",
    description: "Beba água pra encher o aquário do peixinho.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#eef7f6",
    theme_color: "#1f9bab",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
