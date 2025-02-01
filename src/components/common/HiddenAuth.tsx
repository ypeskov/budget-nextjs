'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/store/sessionStore";
import { getCookie } from "@/utils/cookies";

const SESSION_TIMEOUT_MINUTES = parseInt(process.env.NEXT_PUBLIC_SESSION_TIMEOUT || "30", 10);
const SESSION_TIMEOUT = SESSION_TIMEOUT_MINUTES * 60 * 1000;

export default function HiddenAuth({ newAccessToken }: { newAccessToken: string }) {
  const resetTimer = useSessionStore((state) => state.resetTimer);
  const router = useRouter();
  useEffect(() => {
    if (newAccessToken) {
      const currentAuthToken = getCookie("authToken");
      if (currentAuthToken) {
        document.cookie = `authToken=${newAccessToken}; Path=/; Secure;`;
        resetTimer(router);
        sessionStorage.setItem("sessionExpireTime", String(Date.now() + SESSION_TIMEOUT));
      }
    }
  }, [newAccessToken, resetTimer, router]);

  return null;
}