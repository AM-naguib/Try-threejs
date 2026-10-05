import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WAVE Fragrances",
  description: "WAVE Fragrances interactive collection",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
