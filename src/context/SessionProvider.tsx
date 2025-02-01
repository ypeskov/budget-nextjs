"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/store/sessionStore";
import { getCookie } from "@/utils/cookies";

export default function SessionProvider({ children, locale }: { children: React.ReactNode; locale: string }) {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setRouter = useSessionStore((state: any) => state.setRouter);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setLocale = useSessionStore((state: any) => state.setLocale);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resetTimer = useSessionStore((state: any) => state.resetTimer);

  useEffect(() => {
    setRouter(router);
    setLocale(locale);

    const checkAuthToken = () => {
      const authToken = getCookie("authToken");

      if (authToken) {
        console.log("Auth token updated, resetting session timer...");
        resetTimer();
        sessionStorage.setItem("sessionExpireTime", String(Date.now() + 30 * 60 * 1000)); // 30 минут
      }
    };

    checkAuthToken();

    const interval = setInterval(checkAuthToken, 10000);

    return () => clearInterval(interval);
  }, [router, locale, setRouter, setLocale, resetTimer]);

  return <>{children}</>;
}