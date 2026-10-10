"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { localTime } from "@/lib/personal-details";

type ClockReading = {
  time: string;
  dateTime: string;
};

const ClockContext = createContext<ClockReading | null>(null);

export function LocalTimeProvider({ children }: { children: React.ReactNode }) {
  const [clock, setClock] = useState<ClockReading | null>(null);

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: localTime.timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });
    let timer: number;
    const updateClock = () => {
      const now = new Date();
      setClock({
        time: formatter.format(now),
        dateTime: now.toISOString(),
      });
      // One shared timer for both displays, aligned to the next minute.
      timer = window.setTimeout(updateClock, 60_000 - (now.getTime() % 60_000));
    };
    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      window.clearTimeout(timer);
      updateClock();
    };

    updateClock();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return (
    <ClockContext.Provider value={clock}>{children}</ClockContext.Provider>
  );
}

export function LocalClock() {
  const clock = useContext(ClockContext);
  return (
    <span
      className="local-clock"
      title={`Manila local time (${localTime.timeZone}, ${localTime.utcOffset})`}
    >
      <span>{localTime.label} —</span>
      <time dateTime={clock?.dateTime}>{clock?.time ?? "--:--"}</time>
    </span>
  );
}
