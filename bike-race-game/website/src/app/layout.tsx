import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sunset Ridge — Bike Race",
  description: "A fast, physics-driven canyon bike race for the web.",
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
