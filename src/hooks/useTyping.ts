import { useMemo } from "react";

export function useTyping(
  targetText: string,
  inputText: string,
  seconds: number,
) {
  const chars = useMemo(() => {
    return targetText.split("").map((char, index) => {
      let status = "pending";
      if (index < inputText.length) {
        status = inputText[index] === char ? "correct" : "wrong";
      }
      return {
        char,
        status,
      };
    });
  }, [targetText, inputText]);

  const correctCount = useMemo(() => {
    let count = 0;
    for (let i = 0; i < inputText.length; i++) {
      if (inputText[i] === targetText[i]) {
        count++;
      }
    }
    return count;
  }, [inputText, targetText]);

  // correct rate
  const accuracy = useMemo(() => {
    if (!inputText.length) return 100;

    return Math.round((correctCount / inputText.length) * 100);
  }, [correctCount, inputText]);

  // progress
  const progress = useMemo(() => {
    if (!targetText.length) return 0;

    return Math.min(
      100,
      Math.round((inputText.length / targetText.length) * 100),
    );
  }, [inputText, targetText]);

  // Words Per Minute
  const wpm = useMemo(() => {
    if (seconds === 0) return 0;

    return Math.round((correctCount / 5 / seconds) * 60);
  }, [correctCount, seconds]);

  // finished
  const finished = inputText.length >= targetText.length;

  return {
    chars,
    accuracy,
    progress,
    wpm,
    finished,
    correctCount,
  };
}
