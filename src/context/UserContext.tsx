"use client";

import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { jwtVerify } from "jose";

interface User {
  email: string | null;
  token: string | null;
}

interface UserContextType {
  user: User;
  setUser: (user: User) => void;
}

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET_KEY || 'your-secret-key');

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>({ email: null, token: null });

  useEffect(() => {
    const loadUser = async () => {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("authToken="))
        ?.split("=")[1];

      if (token) {
        try {
          const { payload } = await jwtVerify(token, SECRET_KEY);
          const decoded = payload as { email: string };
          setUser({ email: decoded.email, token });
        } catch (error) {
          console.error("Invalid token", error);
        }
      }
    };

    loadUser();
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