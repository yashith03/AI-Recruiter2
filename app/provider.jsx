// app/provider.jsx

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

    const formatName = (name) => {
      if (!name) return "";
      return name
        .split(" ")
        .map(w => w[0].toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
    };

    /**
     * Save user to database (runs only after login)
     */
    const saveUserToDB = async (sessionUser) => {
      try {
        await supabase.from("users").upsert(
          {
            email: sessionUser.email,
            name: formatName(sessionUser.user_metadata?.name),
            picture: sessionUser.user_metadata?.picture,
          },
          { onConflict: "email" }
        );
      } catch (err) {
        console.error("User save error:", err);
      }
    };

    /**
     * Initial auth check
     */
    const loadUser = async () => {
  const { data: { user: sessionUser } } = await supabase.auth.getUser();

  if (!sessionUser) {
    setUser(null);
    return;
  }

  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('email', sessionUser.email)
    .single();

  setUser({
    name: formatName(sessionUser.user_metadata?.name),
    email: sessionUser.email,
    picture: sessionUser.user_metadata?.picture,
    phone: data?.phone,
    job: data?.job,
    company: data?.company,
  });

  saveUserToDB(sessionUser);
};

    loadUser();

    /**
     * Listen for login / logout events
     */
    const { data: listener } = supabase.auth.onAuthStateChange(
    async (_, session) => {
        const sessionUser = session?.user;

        if (!sessionUser) {
          setUser(null);
          return;
        }

        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('email', sessionUser.email)
          .single();

        setUser({
          name: formatName(sessionUser.user_metadata?.name),
          email: sessionUser.email,
          picture: sessionUser.user_metadata?.picture,
          phone: userData?.phone,
          job: userData?.job,
          company: userData?.company
        });

        saveUserToDB(sessionUser);
      }
    );

    return () => listener?.subscription?.unsubscribe();
  }, []);

  return (
    <UserDetailContext.Provider value={{ user, setUser }}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </UserDetailContext.Provider>
  );
}

export default Provider;
export const useUser = () => useContext(UserDetailContext);
