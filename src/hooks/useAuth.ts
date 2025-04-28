"use client";

import { useCallback, useReducer, useTransition } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  credits: number;
  monthlyCredits: number;
  avatar?: string;
  // Add other user properties as needed
  [key: string]: unknown;
}

export interface AuthState {
  user: User | null;
  error: string | null;
}

type AuthAction =
  | { type: "SET_USER"; payload: User }
  | { type: "SET_ERROR"; payload: string }
  | { type: "LOGOUT" };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_USER":
      return { user: action.payload, error: null };
    case "SET_ERROR":
      return { user: null, error: action.payload };
    case "LOGOUT":
      return { user: null, error: null };
    default:
      return state;
  }
}

// Server action to fetch user
async function fetchUserAction(): Promise<User> {
  const response = await fetch("/api/auth/me", {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return response.json();
}

// Server action to logout
async function logoutAction(): Promise<void> {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to logout");
  }
}

export function useAuth() {
  const [isPending, startTransition] = useTransition();
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    error: null,
  });

  const fetchCurrentUser = useCallback(async () => {
    startTransition(async () => {
      try {
        const user = await fetchUserAction();
        dispatch({ type: "SET_USER", payload: user });
      } catch (error) {
        dispatch({
          type: "SET_ERROR",
          payload: error instanceof Error ? error.message : "An error occurred",
        });
      }
    });
  }, []);

  const logout = useCallback(async () => {
    startTransition(async () => {
      try {
        await logoutAction();
        dispatch({ type: "LOGOUT" });
      } catch (error) {
        dispatch({
          type: "SET_ERROR",
          payload: error instanceof Error ? error.message : "Failed to logout",
        });
      }
    });
  }, []);

  return {
    user: state.user,
    isLoading: isPending,
    error: state.error,
    logout,
    refetchUser: fetchCurrentUser,
  };
}
