import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import routes from "@/routes/routes";

const SESSION_TIMEOUT_MINUTES = parseInt(process.env.NEXT_PUBLIC_SESSION_TIMEOUT || "30", 10); // default 30 minutes
const SESSION_TIMEOUT = SESSION_TIMEOUT_MINUTES * 60 * 1000;

export function useAuthTimer(locale: string) {
  const router = useRouter();
  const [expireTime, setExpireTime] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const counterRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function logout() {
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push(routes.login(locale));
  }

  function resetTimer() {
    const newExpireTime = Date.now() + SESSION_TIMEOUT;
    setExpireTime(newExpireTime);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      logout();
    }, SESSION_TIMEOUT);

    if (counterRef.current) clearInterval(counterRef.current);
  }

  useEffect(() => {
    if (!expireTime) return;

    const timeLeft = expireTime - Date.now();

    if (timeLeft > 0) {
      if (!timerRef.current) {
        timerRef.current = setTimeout(() => {
          logout();
        }, timeLeft);
      }
    } else {
      logout();
    }

    return () => { };
  }, [expireTime]);

  return { expireTime, resetTimer };
}