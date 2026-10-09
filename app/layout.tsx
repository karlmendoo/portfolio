import type { Metadata } from "next";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-500.css";
import "@fontsource/dm-sans/latin-600.css";
import "@fontsource/instrument-serif/latin-400.css";
import "@fontsource/instrument-serif/latin-400-italic.css";
import { assetPath, siteUrl } from "@/lib/paths";
import "lenis/dist/lenis.css";
import "./globals.css";
import "./music.css";

const description =
  "Normand Karol Mendoza — Computer Science student majoring in Data Science at UST and Backend AI Engineering intern at FlyRank AI. Experience in editorial leadership, event coordination, and student organizations.";

export const metadata: Metadata = {
  metadataBase: new URL(`${siteUrl}/`),
  alternates: { canonical: `${siteUrl}/` },
  title: "Normand Karol Mendoza — Computer Science & Backend AI",
  description,
  openGraph: {
    title: "Normand Karol Mendoza",
    description,
    type: "website",
    locale: "en_PH",
    url: `${siteUrl}/`,
  },
  twitter: { card: "summary", title: "Normand Karol Mendoza", description },
  icons: { icon: assetPath("/favicon.svg"), apple: assetPath("/favicon.svg") },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
