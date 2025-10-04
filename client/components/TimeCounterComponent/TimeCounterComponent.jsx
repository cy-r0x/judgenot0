"use client";

import { useEffect, useState, useCallback } from "react";

/**
 * Time Counter Component - Countdown timer for contests
 *
 * @param {Object} props - Component props
 * @param {number} props.startUnix - Contest start time (Unix timestamp)
 * @param {number} props.endUnix - Contest end time (Unix timestamp)
 * @returns {JSX.Element} Countdown timer display
 *
 * @example
 * <TimeCounterComponent startUnix={1609459200} endUnix={1609545600} />
 */
function TimeCounterComponent({ startUnix, endUnix }) {
  const nowUnix = useCallback(() => Math.floor(Date.now() / 1000), []);
  const [currentTime, setCurrentTime] = useState(nowUnix());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(nowUnix());
    }, 1000);

    return () => clearInterval(interval);
  }, [nowUnix]);

  const getTimeLeft = useCallback(() => {
    if (currentTime < startUnix) {
      return {
        label: "Starts In",
        seconds: startUnix - currentTime,
        color: "text-blue-400",
      };
    } else if (currentTime < endUnix) {
      return {
        label: "Ends In",
        seconds: Math.max(0, endUnix - currentTime),
        color: "text-green-400",
      };
    } else {
      return {
        label: "Ended",
        seconds: 0,
        color: "text-red-400",
      };
    }
  }, [currentTime, startUnix, endUnix]);

  const formatTime = useCallback((seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  }, []);

  const { label, seconds, color } = getTimeLeft();

  return (
    <div
      className="h-32 border-4 border-zinc-800 flex flex-col items-center justify-center gap-y-1"
      role="timer"
      aria-label={`Contest ${label.toLowerCase()}: ${formatTime(seconds)}`}
    >
      <p className={`font-semibold text-2xl ${color}`}>{label}</p>
      <p className="font-mono text-2xl font-bold">{formatTime(seconds)}</p>
    </div>
  );
}

export default TimeCounterComponent;
