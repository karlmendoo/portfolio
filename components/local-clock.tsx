"use client";

import { useEffect, useState } from "react";

type ClockReading = {
  time: string;
  dateTime: string;
  timeZone: string;
};

export function LocalClock() {
  const [clock, setClock] = useState<ClockReading | null>(null);

  useEffect(() => {
    // Omitting timeZone uses the visitor's browser time zone.
    const formatter = new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    });
    const timeZone = formatter.resolvedOptions().timeZone;
    const updateClock = () => {
      const now = new Date();
      setClock({
        time: formatter.format(now),
        dateTime: now.toISOString(),
        timeZone,
      });
    };

    updateClock();
    const timer = window.setInterval(updateClock, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <span
      className="local-clock"
      title={clock ? `Your local time (${clock.timeZone})` : "Your local time"}
      aria-live="off"
    >
      <span>LOCAL TIME</span>
      <time dateTime={clock?.dateTime}>{clock?.time ?? "--:--:--"}</time>
    </span>
  );
}
