import type { Metadata, Viewport } from "next";
import "@fontsource/poppins/latin-300.css";
import "@fontsource/poppins/latin-400.css";
import "@fontsource/poppins/latin-500.css";
import "@fontsource/poppins/latin-600.css";
import "@fontsource/allison/latin-400.css";
import "./globals.css";
import { offer } from "@/content/offer";

export const metadata: Metadata = {
  title: `${offer.name} ${offer.accent} — Riad Noor, Marrakech`,
  description: offer.promise,
  openGraph: {
    title: `${offer.name} ${offer.accent} — Riad Noor`,
    description: offer.promise,
    locale: "fr_FR",
    type: "website",
    images: [{ url: "/images/suite-noor.webp", width: 1448, height: 1086, alt: "La Suite Noor ouverte sur le patio" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F7F2E9",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* Active les animations d'apparition seulement si JavaScript tourne (contenu visible sinon). */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
