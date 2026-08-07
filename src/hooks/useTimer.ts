import { useEffect, useState } from "react";

export function useTimer(started: boolean) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!started) return;
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [started]);

  const reset = () => {
    setSeconds(0);
  };
  return {
    seconds,
    reset,
  };
}
