// src/store/sessionStore.ts
import { create } from "zustand";
import routes from "@/routes/routes";
import { useRouter } from "next/navigation";

const SESSION_TIMEOUT_MINUTES = parseInt(process.env.NEXT_PUBLIC_SESSION_TIMEOUT || "30", 10); // default 30 minutes
const SESSION_TIMEOUT = SESSION_TIMEOUT_MINUTES * 60 * 1000;

interface SessionState {
  expireTime: number | null;
  resetTimer: () => void;
  logout: () => void;
}

export const useSessionStore = create<SessionState>((set, get) => {
  let timer: ReturnType<typeof setTimeout> | null = null;

  const logout = () => {
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    const router = useRouter();
    router.push(routes.login({ locale: "en" })); // локаль можно передавать динамически
  };

  const resetTimer = () => {
    const newExpireTime = Date.now() + SESSION_TIMEOUT;
    set({ expireTime: newExpireTime });

    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      get().logout();
    }, SESSION_TIMEOUT);
  };

  return { expireTime: null, resetTimer, logout };
});