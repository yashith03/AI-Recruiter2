// app/interview/[interview_id]/start/_components/AlertConfirmation.jsx

"use client"; // ✅ REQUIRED because Radix uses client-side hooks

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function AlertConfirmation({ children, stopInterview }) {
  const [loading, setLoading] = useState(false); // ✅ prevent double trigger

  const handleContinue = async () => {
    if (loading) return;          // ✅ guard
    setLoading(true);

    await stopInterview();        // ✅ ensure interview stops fully
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will immediately end the interview. Feedback will be generated
            if a conversation exists.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleContinue}  // ✅ FIXED
            disabled={loading}        // ✅ prevent double click
          >
            {loading ? "Ending..." : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default AlertConfirmation;
