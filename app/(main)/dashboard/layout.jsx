"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/provider";

export default function DashboardLayout({ children }) {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user !== undefined && user === null) {
      router.replace("/auth");
    }
  }, [user, router]);

  // Prevent flash before redirect
  if (user === undefined) return null;

  return <>{children}</>;
}