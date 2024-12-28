import type { Metadata } from "next";
import "./globals.css";

import { UserProvider } from "@/context/UserContext";
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
        <UserProvider>
          <Header />
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
