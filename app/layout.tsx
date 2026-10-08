import type { Metadata } from "next";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/600.css";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "lenis/dist/lenis.css";
import "./globals.css";

const description =
  "Normand Karol Mendoza — Computer Science student majoring in Data Science at UST and Backend AI Engineering intern at FlyRank AI. Experience in editorial leadership, event coordination, and student organizations.";

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://normand-karol-mendoza.hale-hare-6315.chatgpt.site",
  ),
  alternates: { canonical: "/" },
  title: "Normand Karol Mendoza — Computer Science & Backend AI",
  description,
  openGraph: {
    title: "Normand Karol Mendoza",
    description,
    type: "website",
    locale: "en_PH",
    url: "/",
  },
  twitter: { card: "summary", title: "Normand Karol Mendoza", description },
  icons: { icon: "/favicon.svg", apple: "/favicon.svg" },
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
