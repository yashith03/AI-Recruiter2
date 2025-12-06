// app/interview/[interview_id]/start/_components/TimerComponent.jsx

"use client";

import React, { useEffect, useState, useRef } from "react";

export default function TimerComponent({ start, stop }) {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (start) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [start]);

  useEffect(() => {
    if (stop) clearInterval(intervalRef.current);
  }, [stop]);

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
