"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface User {
  email: string | null;
  token: string | null;
}

interface UserContextType {
  user: User;
  setUser: (user: User) => void;
}

const UserContext = createContext<UserContextType>({
  user: { email: null, token: null },
  setUser: () => {},
});
const defaultUser: User = { email: null, token: null };
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("authToken="))
        ?.split("=")[1];

      if (!token) {
        setUser(null);
        return;
      }

      try {
        const userResponse = await fetch(`${API_URL}/auth/profile`, {
          headers: {
            "auth-token": token,
          },
        });

        if (userResponse.ok) {
          const response = await userResponse.json();
          setUser({ email: response.email, token });
        } else {
          console.error("Failed to fetch user profile");
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUser(null);
      }
    };

    loadUserProfile();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user: user || defaultUser,
        setUser,
      }}
    >
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