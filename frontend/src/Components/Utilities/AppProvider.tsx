import React, { useState, useEffect } from "react";
import { AppContext } from "./AppContext";
import type { UserWithoutPassword } from "./TableTypes";

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedUser, setSelectedUser] = useState<UserWithoutPassword | null>(
    null
  );
  const [token, setToken] = useState<string | null>(null);
  const [userAccess, setUserAccess] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("Login");
    if (stored) {
      try {
        const { user, token: savedToken } = JSON.parse(stored);
        const payload = JSON.parse(atob(savedToken.split(".")[1]));
        const now = Date.now() / 1000;

        if (payload.exp < now) {
          // Token expired → reset
          localStorage.removeItem("Login");
          setSelectedUser(null);
          setToken(null);
          setUserAccess(false);
        } else {
          // Token valid → restore
          setSelectedUser(user);
          setToken(savedToken);
          setUserAccess(true);
        }
      } catch {
        localStorage.removeItem("Login");
        setSelectedUser(null);
        setToken(null);
        setUserAccess(false);
      }
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        selectedUser,
        setSelectedUser,
        token,
        setToken,
        userAccess,
        setUserAccess,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
