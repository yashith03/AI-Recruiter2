"use client"

import React, { useState, useEffect, useContext } from "react"
import { UserDetailContext } from "@/context/UserDetailContext"
import { supabase } from "/services/supabaseClient"

function Provider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const createNewUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // format name with capitalized words
      const formatName = (name) => {
        if (!name) return ""
        return name
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(" ")
      }

      const formattedName = formatName(user?.user_metadata?.name)

      setUser({
        name: formattedName,
        email: user?.email,
        picture: user?.user_metadata?.picture,
      })
    }

    createNewUser()
  }, [])

  return (
    <UserDetailContext.Provider value={{ user, setUser }}>
      {children}
    </UserDetailContext.Provider>
  )
}

export default Provider

export const useUser = () => useContext(UserDetailContext)
