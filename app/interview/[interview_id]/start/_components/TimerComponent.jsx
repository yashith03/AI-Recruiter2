// app/interview/[interview_id]/start/_components/TimerComponent.jsx

"use client";

import React, { useEffect, useRef, useState } from "react";

export default function TimerComponent({ start, stop }) {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);

  // --------------------------------------------------
  // START TIMER
  // --------------------------------------------------
  useEffect(() => {
    if (!start) return;

    // ✅ FIX: clear any existing interval first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null; // ✅ FIX: cleanup ref
    };
  }, [start]);

  // --------------------------------------------------
  // STOP TIMER
  // --------------------------------------------------
  useEffect(() => {
    if (!stop) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null; // ✅ FIX: prevent reuse
    }
  }, [stop]);

  // --------------------------------------------------
  // FORMAT TIME
  // --------------------------------------------------
  const formatTime = () => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    return [
      h.toString().padStart(2, "0"),
      m.toString().padStart(2, "0"),
      s.toString().padStart(2, "0"),
    ].join(":");
  };

  return <span>{formatTime()}</span>;
}
