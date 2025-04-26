"use client";

import { type ReactNode, createContext, useCallback, useContext, useMemo, useState } from "react";

import { Toaster } from "@/components/ui/sonner";
import { type AuthState, useAuth } from "@/hooks/useAuth";

interface AppContextType {
  auth: AuthState;
  isBusy: boolean;
  setIsBusy: (isBusy: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [isBusy, setIsBusy] = useState(false);

  const auth = useAuth();

  const value = useMemo(
    () => ({
      auth,
      isBusy,
      setIsBusy,
    }),
    [auth, isBusy]
  );

  return (
    <AppContext.Provider value={value}>
      {children}
      <Toaster />
    </AppContext.Provider>
  );
}
