import { create } from "zustand";

interface HistoryRecord {
  date: string;
  wpm: number;
  accuracy: number;
  progress: number;
  duration: number;
}

interface TypingStore {
  text: string;
  setText: (text: string) => void;
  history: HistoryRecord[];
  addHistory: (record: HistoryRecord) => void;
  clearHistory: () => void;
}

export const useTypingStore = create<TypingStore>((set) => ({
  text: "",
  history: JSON.parse(localStorage.getItem("typing-history") || "[]"),
  setText: (text) => set({ text }),
  addHistory: (record) =>
    set((state) => {
      const history = [record, ...state.history];
      localStorage.setItem("typing-history", JSON.stringify(history));
      return { history };
    }),
  clearHistory: () => {
    localStorage.removeItem("typing-history");
    set({ history: [] });
  },
}));
