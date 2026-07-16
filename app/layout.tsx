import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mirus KPI Tracker",
  description: "Manager KPI tracking system for Mirus Skincare",
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
