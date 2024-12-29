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
          <div className="container mx-auto px-4 py-6">
            {children}
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
