import type { Metadata, Viewport } from "next";
import { Geist, Poppins } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import LayoutWrapper from "@/components/LayoutWrapper";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const siteName = "Sreyes V Portfolio";
const description =
  "An independent creative designer and frontend developer focused on immersive digital products and clean execution.";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["200","300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: {
    default: "Sreyes V - Portfolio",
    template: "%s | Sreyes V",
  },
  description,
  keywords: [
    "Sreyes V",
    "frontend developer",
    "creative developer",
    "portfolio",
    "web designer",
    "react",
    "nextjs",
    "typescript",
  ],
  authors: [{ name: "Sreyes V" }],
  creator: "Sreyes V",
  publisher: "Sreyes V",
  alternates: {
    canonical: `${siteUrl}`,
  },
  openGraph: {
    type: "website",
    url: `${siteUrl}`,
    siteName,
    title: "Sreyes V - Portfolio",
    description,
    images: [
      {
        url: `${siteUrl}og_image.png`,
        width: 1200,
        height: 630,
        alt: "Sreyes V portfolio preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sreyes V - Portfolio",
    description,
    images: [`${siteUrl}og_image.png`],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
  icons: {
    icon: [
      { url: "/web-app-manifest-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/web-app-manifest-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/web-app-manifest-192x192.png", sizes: "192x192", type: "image/png" }],
    shortcut: ["/og_image.png"],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    title: "Sreyes V",
    capable: true,
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#111522",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full antialiased", "font-sans", geist.variable)}
    >
      <head>
        <meta name="google-site-verification" content="IXLZy3qF39qA_HVQLsRhC7TV24TYEHEEsXoQCBjSUgw" />
      </head>
      <body className={`${poppins.className} min-h-full flex flex-col`}
        style={{
					background:
						"radial-gradient(800px 400px at 10% 20%, rgba(109,129,255,0.18), transparent 70%), radial-gradient(700px 380px at 85% 80%, rgba(67,94,212,0.18), transparent 75%), linear-gradient(180deg, #0b1020 0%, #080d1a 100%)",
				}}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Sreyes V",
              url: siteUrl,
              jobTitle: "Frontend Developer",
              description,
              image: `${siteUrl}og_image.png`,
              sameAs: [
                "https://github.com/sre-yes-v",
                "https://www.linkedin.com/in/sreyes-v",
                "https://sreyes.com",
              ],
            }),
          }}
        />
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
