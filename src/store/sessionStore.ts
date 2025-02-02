// src/store/sessionStore.ts
import { create } from "zustand";
import routes from "@/routes/routes";

const SESSION_TIMEOUT_MINUTES = parseInt(process.env.NEXT_PUBLIC_SESSION_TIMEOUT || "30", 10); // default 30 minutes
const SESSION_TIMEOUT = SESSION_TIMEOUT_MINUTES * 60 * 1000;

export interface SessionState {
  expireTime: number | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resetTimer: (router?: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  logout: (router?: any) => void;
}

export const useSessionStore = create<SessionState>((set, get) => {
  let timer: ReturnType<typeof setTimeout> | null = null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const logout = (router: any) => {
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("sessionExpireTime");
    // router.push(routes.login({ locale: "en" }));
    window.location.href = routes.login({ locale: "en" });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resetTimer = (router: any) => {
    const newExpireTime = Date.now() + SESSION_TIMEOUT;
    set({ expireTime: newExpireTime });

    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      if (router) {
        get().logout(router);
      }
    }, SESSION_TIMEOUT);
  };

  return { expireTime: null, resetTimer, logout };
});