"use client";

import React, { useState, useEffect, useContext, createContext } from "react";
import { supabase } from "@/services/supabaseClient";

export const UserDetailContext = createContext();

function Provider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const formatName = (name) => {
      if (!name) return "";
      return name
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
    };

    // Store user in DB
    const saveUserToDB = async (sessionUser) => {
      try {
        const formattedName = formatName(sessionUser.user_metadata?.name);

        const { error } = await supabase
          .from("users")
          .upsert(
            {
              email: sessionUser.email,
              name: formattedName,
              picture: sessionUser.user_metadata?.picture,
            },
            { onConflict: "email" }
          );

        if (error) console.error("Error saving user:", error.message);
        else console.log("✅ User saved to DB");
      } catch (err) {
        console.error("User save error:", err);
      }
    };

    // Load current user on first render
    const loadUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        const sessionUser = data?.user;

        if (!sessionUser) {
          setUser(null);
          return;
        }

        const formattedName = formatName(sessionUser.user_metadata?.name);

        setUser({
          name: formattedName,
          email: sessionUser.email,
          picture: sessionUser.user_metadata?.picture,
        });

        await saveUserToDB(sessionUser);
      } catch (err) {
        console.error("Error loading user:", err);
      }
    };

    loadUser();

    // Listen to future logins/logouts
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        const sessionUser = session?.user;

        if (!sessionUser) {
          setUser(null);
          return;
        }

        const formattedName = formatName(sessionUser.user_metadata?.name);

        setUser({
          name: formattedName,
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
