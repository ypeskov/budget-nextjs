import type { Metadata } from "next";
import "./globals.css";


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
        {children}
      </body>
    </html>
  );
}
