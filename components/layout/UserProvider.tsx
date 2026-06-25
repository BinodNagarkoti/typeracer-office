"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "../../types";

interface UserContextType {
  user: { name: string; teamId: number } | null;
  setUser: (user: { name: string; teamId: number } | null) => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  isLoading: true,
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ name: string; teamId: number } | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("typing-user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  const handleSetUser = (newUser: { name: string; teamId: number } | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem("typing-user", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("typing-user");
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser: handleSetUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}
