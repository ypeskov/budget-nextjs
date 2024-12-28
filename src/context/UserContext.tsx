"use client";

import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import jwt from "jsonwebtoken";

interface User {
  email: string | null;
  token: string | null;
}

interface UserContextType {
  user: User;
  setUser: (user: User) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>({ email: null, token: null });

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];

    if (token) {
      try {
        const decoded: { email: string } = jwt.decode(token) as { email: string };
        setUser({ email: decoded.email, token });
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
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