"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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
    fetch("/api/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const handleSetUser = async (newUser: { name: string; teamId: number } | null) => {
    if (newUser) {
      try {
        const res = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newUser.name, teamId: newUser.teamId }),
        });
        const data = await res.json();
        if (data.user) {
          setUser({ name: data.user.name, teamId: data.user.team_id });
        }
      } catch {
        setUser(newUser);
      }
    } else {
      await fetch("/api/session", { method: "DELETE" });
      setUser(null);
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
