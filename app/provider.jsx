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

      // 2. Fetch full user profile from 'users' table
      const { data: dbUser, error: dbError } = await supabase
        .from("users")
        .select("*")
        .eq("email", sessionUser.email)
        .single();

      if (dbError) {
        console.warn("Error fetching DB user profile:", dbError.message);
      }

      setUser({
        email: sessionUser.email,
        name: dbUser?.name ?? sessionUser.user_metadata?.name ?? "",
        picture: dbUser?.picture ?? sessionUser.user_metadata?.picture ?? "",
        phone: dbUser?.phone ?? "",
        job: dbUser?.job ?? "",
        company: dbUser?.company ?? "",
        credits: dbUser?.credits ?? 0,
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
          // Fetch DB user on auth change too
          supabase
            .from("users")
            .select("*")
            .eq("email", sessionUser.email)
            .single()
            .then(({ data: dbUser, error: dbError }) => {
              if (mounted) {
                setUser({
                  email: sessionUser.email,
                  name: dbUser?.name ?? sessionUser.user_metadata?.name ?? "",
                  picture: dbUser?.picture ?? sessionUser.user_metadata?.picture ?? "",
                  phone: dbUser?.phone ?? "",
                  job: dbUser?.job ?? "",
                  company: dbUser?.company ?? "",
                  credits: dbUser?.credits ?? 0,
                });
              }
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
