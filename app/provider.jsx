// app/provider.jsx

"use client";

import React, { useState, useEffect, useContext, createContext } from "react";
import { supabase } from "@/services/supabaseClient";
import { ThemeProvider } from "next-themes";
import { PLAN, CREDITS } from "./utils/constants";

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
        // First check if user exists to avoid overwriting credits
        const { data: existingUser } = await supabase
          .from("users")
          .select("email")
          .eq("email", sessionUser.email)
          .single();

        if (!existingUser) {
          // New User: Grant initial credits and set plan
          await supabase.from("users").insert({
            email: sessionUser.email,
            name: formatName(sessionUser.user_metadata?.name),
            picture: sessionUser.user_metadata?.picture,
            credits: CREDITS.INITIAL_GRANT,
            subscription_plan: PLAN.STARTER,
          });
          console.log("New user initialized with credits");
        } else {
          // Existing User: Just update basic profile info
          await supabase.from("users").update({
            name: formatName(sessionUser.user_metadata?.name),
            picture: sessionUser.user_metadata?.picture,
          }).eq("email", sessionUser.email);
        }
      } catch (err) {
        console.error("User save error:", err);
      }
    };

    /**
     * Initial auth check
     */
    const loadUser = async () => {
      try {
        // 1. Use getSession for instant UI response (reads from local storage)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;

        const sessionUser = session?.user;

        if (!sessionUser) {
          setUser(null);
          return;
        }

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
