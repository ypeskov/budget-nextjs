"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { request } from "@/utils/request/browser";
import apiRoutes from "@/routes/apiRoutes";
import { useSessionStore } from "@/store/sessionStore";

type User = {
  email: string | null;
  token: string | null;
}

type UserContextType = {
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
  const { expireTime, resetTimer } = useSessionStore();

  const [token, setToken] = useState<string | null>(null);

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