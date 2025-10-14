// src/Components/Utilities/AppContext.tsx
import React from "react";
import type { UserWithoutPassword } from "./TableTypes";

interface AppContextType {
  userAccess: boolean;
  setUserAccess: React.Dispatch<React.SetStateAction<boolean>>;
  selectedUser: UserWithoutPassword | null;
  setSelectedUser: React.Dispatch<
    React.SetStateAction<UserWithoutPassword | null>
  >;
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

export const AppContext = React.createContext<AppContextType>({
  userAccess: false,
  setUserAccess: () => {},
  selectedUser: null,
  setSelectedUser: () => {},
  token: null,
  setToken: () => {},
});
