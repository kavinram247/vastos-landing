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
    default: "VASTOS | Engineering Tomorrow's Intelligent Businesses",
    template: "%s | VASTOS",
  },
  description:
    "VASTOS builds intelligent software, AI systems, immersive experiences, and enterprise platforms for ambitious businesses.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://vastos.in",
    siteName: "VASTOS",
    title: "Engineering Tomorrow's Intelligent Businesses",
    description:
      "Intelligent software, AI systems, immersive experiences, and enterprise platforms built for ambitious businesses.",
    images: [
      {
        url: "/media/vastos-hero-poster.jpg",
        width: 1920,
        height: 1080,
        alt: "A city tower transforming into an intelligent digital system",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VASTOS | Engineering Tomorrow's Intelligent Businesses",
    description:
      "Intelligent software, AI systems, immersive experiences, and enterprise platforms.",
    images: ["/media/vastos-hero-poster.jpg"],
  },
  icons: {
    icon: "/brand/vastos-mark.png",
    apple: "/brand/vastos-mark.png",
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
