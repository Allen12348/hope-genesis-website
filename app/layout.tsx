import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { WebVitals } from "@/app/_components/web-vitals";
import { AppProviders } from "@/components/providers/app-providers";
import { OrganizationJsonLd } from "@/components/seo/organization-json-ld";
import { defaultMetadata } from "@/lib/metadata-config";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fontDisplay = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = defaultMetadata;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontDisplay.variable} min-h-dvh font-sans`}
      >
        <WebVitals />
        <OrganizationJsonLd />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
