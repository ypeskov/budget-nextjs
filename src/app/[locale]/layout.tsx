import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "../globals.css";

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

import { UserProvider } from "@/context/UserContext";
import Header from "@/components/common/Header";

export const metadata: Metadata = {
  title: "Another Budget Tracker",
  description: "Not a simple budget tracker",
};


export default async function RootLayout(
  {
    children,
    params,
  }: RootLayoutProps) {

  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <UserProvider>
            <Header />
            <div className="container mx-auto px-4 py-6">
              {children}
            </div>
          </UserProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
