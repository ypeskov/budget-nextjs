"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { useAuthTimer } from "@/hooks/authHook";
import { request } from "@/utils/request/browser";
import apiRoutes from "@/routes/apiRoutes";

interface User {
  email: string | null;
  token: string | null;
}

interface UserContextType {
  user: User;
  setUser: (user: User) => void;
  expireTime: number | null;
  resetTimer: () => void;
}

const UserContext = createContext<UserContextType>({
  user: { email: null, token: null },
  setUser: () => { },
  expireTime: null,
  resetTimer: () => { },
});

const defaultUser: User = { email: null, token: null };

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const { expireTime, resetTimer: originalResetTimer } = useAuthTimer("en");
  const resetTimer = useMemo(() => () => originalResetTimer(), [originalResetTimer]);

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      const tokenFromCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("authToken="))
        ?.split("=")[1];

      if (!tokenFromCookie) {
        setUser(null);
        return;
      }
      setToken(tokenFromCookie);

      try {
        const userProfileResponse = await request(apiRoutes.profile(), {});
        setUser({ email: userProfileResponse.email, token });
        resetTimer();
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUser(null);
      }
    };

    loadUserProfile();
  }, [token, resetTimer]);

  return (
    <UserContext.Provider value={{ user: user || defaultUser, setUser, expireTime, resetTimer }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};