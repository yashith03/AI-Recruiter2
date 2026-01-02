"use client";

import React, { useState, useEffect, useContext, createContext } from "react";
import { supabase } from "@/services/supabaseClient";

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
      const { data } = await supabase.auth.getUser();
      const sessionUser = data?.user;

      if (!sessionUser) {
        setUser(null); // explicitly NOT logged in
        return;
      }

      setUser({
        name: formatName(sessionUser.user_metadata?.name),
        email: sessionUser.email,
        picture: sessionUser.user_metadata?.picture,
      });

      saveUserToDB(sessionUser);
    };

    loadUser();

    /**
     * Listen for login / logout events
     */
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        const sessionUser = session?.user;

        if (!sessionUser) {
          setUser(null);
          return;
        }

        setUser({
          name: formatName(sessionUser.user_metadata?.name),
          email: sessionUser.email,
          picture: sessionUser.user_metadata?.picture,
        });

        saveUserToDB(sessionUser);
      }
    );

    return () => listener?.subscription?.unsubscribe();
  }, []);

  return (
    <UserDetailContext.Provider value={{ user, setUser }}>
      {children}
    </UserDetailContext.Provider>
  );
}

export default Provider;
export const useUser = () => useContext(UserDetailContext);
