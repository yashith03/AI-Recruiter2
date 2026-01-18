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
        .split(/\s+/) // Use regex to handle multiple spaces
        .filter(w => w.length > 0) // Remove empty strings
        .map(w => w[0].toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
    };

    // Safety Timeout: If auth check takes > 5 seconds, stop showing skeleton
    const timeout = setTimeout(() => {
      setUser(prev => (prev === undefined ? null : prev));
    }, 5000);

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
      try {
        console.log("AuthProvider: Loading user...");
        // 1. Use getSession for instant UI response (reads from local storage)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;

        const sessionUser = session?.user;
        console.log("AuthProvider: Session user:", sessionUser ? "Found" : "Not Found");

        if (!sessionUser) {
          setUser(null);
          return;
        }

        // 2. Set user immediately with data from session metadata
        const basicUser = {
          name: formatName(sessionUser.user_metadata?.name),
          email: sessionUser.email,
          picture: sessionUser.user_metadata?.picture,
        };
        setUser(basicUser);

        // 3. Fetch extended profile info from DB in the background
        const { data: userData, error: dbError } = await supabase
          .from('users')
          .select('*')
          .eq('email', sessionUser.email)
          .single();

        if (dbError) {
          console.warn("AuthProvider: DB fetch warning (non-critical):", dbError.message);
        }

        if (userData) {
          setUser(prev => ({
            ...prev,
            ...userData,
          }));
        }

        await saveUserToDB(sessionUser);
      } catch (err) {
        console.error("AuthProvider: Critical load error:", err);
        setUser(null); // Fallback to not-logged-in state so UI shows
      }
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

        // Set basic data immediately
        setUser({
          name: formatName(sessionUser.user_metadata?.name),
          email: sessionUser.email,
          picture: sessionUser.user_metadata?.picture,
        });

        // Background fetch for extended data
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('email', sessionUser.email)
          .single();

        if (userData) {
          setUser(prev => ({
            ...prev,
            ...userData, // Spread all fields including credits, phone, job, company, etc.
          }));
        }

        saveUserToDB(sessionUser);
      }
    );

    return () => {
      listener?.subscription?.unsubscribe();
      clearTimeout(timeout);
    };
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
