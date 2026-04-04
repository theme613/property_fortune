import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Property Destiny | Magical Real Estate",
  description: "Discover your true property fortune powered by celestial alignment and AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
