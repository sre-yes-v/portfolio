import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sreyes V Portfolio",
    short_name: "Sreyes V",
    description:
      "An independent creative designer and frontend developer focused on immersive digital products and clean execution.",
    start_url: "/",
    display: "standalone",
    background_color: "#111522",
    theme_color: "#111522",
    icons: [
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
