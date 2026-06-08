import type { Metadata } from "next";
import { Geist, Geist_Mono, Chakra_Petch } from "next/font/google";
import { site } from "@/config/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const chakra = Chakra_Petch({
  variable: "--font-chakra",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "lampa warsztatowa COB",
    "latarka magnetyczna do auta",
    "endoskop USB-C",
    "kamera inspekcyjna",
    "EDC dla kierowców",
    "akcesoria samochodowe premium",
  ],
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${chakra.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink text-chalk">
        {children}
      </body>
    </html>
  );
}
