import type { Metadata } from "next";
import { Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vastos.in"),
  title: {
    default: "VASTOS — Software for real estate, design, and construction teams",
    template: "%s | VASTOS",
  },
  description:
    "VASTOS builds a real estate and construction CRM, an Unreal Engine interior visualisation platform, and an AI studio that turns floor plans into renders.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://vastos.in",
    siteName: "VASTOS",
    title: "Software for real estate, design, and construction teams",
    description:
      "A real estate and construction CRM, an Unreal Engine interior visualisation platform, and an AI studio that turns floor plans into renders.",
    images: [
      {
        url: "/media/vastos-hero-poster.jpg",
        width: 1920,
        height: 1080,
        alt: "A VASTOS interior visualisation rendered from a floor plan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VASTOS — Software for real estate, design, and construction teams",
    description:
      "A real estate and construction CRM, an Unreal Engine visualisation platform, and an AI design studio.",
    images: ["/media/vastos-hero-poster.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
