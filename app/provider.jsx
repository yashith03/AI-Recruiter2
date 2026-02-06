"use client";

import React, { useState, useEffect, useContext, createContext } from "react";
import { supabase } from "@/services/supabaseClient";
import { ThemeProvider } from "next-themes";

export const UserDetailContext = createContext();

function Provider({ children }) {
  /**
   * user === undefined → auth loading
   * user === null      → not logged in
   * user !== null      → logged in
   */
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      const { data } = await supabase.auth.getSession();
      const sessionUser = data.session?.user ?? null;

      if (!mounted) return;

      if (!sessionUser) {
        setUser(null);
        return;
      }

      setUser({
        email: sessionUser.email,
        name: sessionUser.user_metadata?.name ?? "",
        picture: sessionUser.user_metadata?.picture ?? "",
      });
    };

    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const sessionUser = session?.user ?? null;

        if (!mounted) return;

        if (!sessionUser) {
          setUser(null);
        } else {
          setUser({
            email: sessionUser.email,
            name: sessionUser.user_metadata?.name ?? "",
            picture: sessionUser.user_metadata?.picture ?? "",
          });
        }
      }
    );

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  return (
    <UserDetailContext.Provider
      value={{
        user,
        setUser,
        isAuthLoading: user === undefined,
      }}
    >
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </UserDetailContext.Provider>
  );
}

export default Provider;
export const useUser = () => useContext(UserDetailContext);
