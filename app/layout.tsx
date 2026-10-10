import type { Metadata, Viewport } from "next";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-500.css";
import "@fontsource/dm-sans/latin-600.css";
import "@fontsource/instrument-serif/latin-400.css";
import "@fontsource/instrument-serif/latin-400-italic.css";
import { assetPath, siteUrl } from "@/lib/paths";
import { siteDetails } from "@/lib/personal-details";
import { LocalTimeProvider } from "@/components/local-clock";
import "lenis/dist/lenis.css";
import "./globals.css";
import "./music.css";

const socialImage = `${siteUrl}/social-preview.png`;

export const metadata: Metadata = {
  metadataBase: new URL(`${siteUrl}/`),
  alternates: { canonical: `${siteUrl}/` },
  title: { default: siteDetails.title, template: `%s — ${siteDetails.name}` },
  description: siteDetails.description,
  authors: [{ name: siteDetails.name }],
  openGraph: {
    title: siteDetails.title,
    description: siteDetails.description,
    siteName: siteDetails.name,
    type: "website",
    locale: "en_PH",
    url: `${siteUrl}/`,
    images: [
      {
        url: socialImage,
        width: 1200,
        height: 630,
        alt: siteDetails.previewAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteDetails.title,
    description: siteDetails.description,
    images: [{ url: socialImage, alt: siteDetails.previewAlt }],
  },
  icons: {
    icon: [
      {
        url: assetPath("/favicon.ico"),
        sizes: "16x16 32x32",
        type: "image/x-icon",
      },
      { url: assetPath("/favicon.svg"), sizes: "any", type: "image/svg+xml" },
      { url: assetPath("/favicon-32.png"), sizes: "32x32", type: "image/png" },
    ],
    apple: [
      {
        url: assetPath("/apple-touch-icon.png"),
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#eaf3ff",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LocalTimeProvider>{children}</LocalTimeProvider>
      </body>
    </html>
  );
}
