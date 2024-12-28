import type { Metadata } from "next";
import "./globals.css";

import Header from "@/components/common/Header";

export const metadata: Metadata = {
  title: "Another Budget Tracker",
  description: "Not a simple budget tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
