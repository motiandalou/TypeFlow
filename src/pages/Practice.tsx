import { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import TypingText from "../components/TypingText";
import StatsBar from "../components/StatsBar";
import { useTypingStore } from "../store/typingStore";
import { useTyping } from "../hooks/useTyping";
import { useTimer } from "../hooks/useTimer";
import { playKeySound, playErrorSound } from "../lib/sound";

export default function Practice() {
  const navigate = useNavigate();

  const text = useTypingStore((state) => state.text);
  const setText = useTypingStore((state) => state.setText);
  const addHistory = useTypingStore((state) => state.addHistory);

  const [input, setInput] = useState("");
  // 单词连击计数
  const [wordStreak, setWordStreak] = useState(0);
  // 是否展示庆祝动画
  const [showCelebrate, setShowCelebrate] = useState(false);
  // 庆祝展示文字
  const [celebrateText, setCelebrateText] = useState("Great!");

  // ========== 词典弹窗相关状态 ==========
  const [showDictPopup, setShowDictPopup] = useState(false);
  const [queryWord, setQueryWord] = useState("");
  const [dictLoading, setDictLoading] = useState(false);
  const [dictResult, setDictResult] = useState<null | {
    word: string;
    phonetic: string;
    audioUrl?: string;
    meanings: Array<{ pos: string; def: string }>;
  }>(null);

  const hiddenInputRef = useRef<HTMLTextAreaElement>(null);
  // 记录上一次已完成单词数量，用来检测刚完成一个新单词，避免重复触发
  const prevCompletedWordRef = useRef(0);

  const { seconds } = useTimer(input.length > 0);

  const { chars, accuracy, progress, wpm, finished } = useTyping(
    text,
    input,
    seconds,
  );

  // 将字符数组切分成一个个单词分组，空格、换行作为分隔符
  const wordGroups = useMemo(() => {
    const groups: Array<{ items: typeof chars }> = [];
    let temp: typeof chars = [];
    for (const c of chars) {
      if (c.char === " " || c.char === "\n") {
        groups.push({ items: temp });
        temp = [];
      } else {
        temp.push(c);
      }
    }
    if (temp.length > 0) {
      groups.push({ items: temp });
    }
    return groups;
  }, [chars]);

  // 计算已经完整打完的单词数量：输入长度已经覆盖该单词全部字符
  const completedWordCount = useMemo(() => {
    let count = 0;
    let consumedLength = 0;
    for (const group of wordGroups) {
      const wordLen = group.items.length;
      // 判断当前输入是否已经把这个单词全部打完
      if (input.length >= consumedLength + wordLen) {
        count++;
        consumedLength += wordLen + 1; // +1 把分隔符(空格/换行)算进去
      } else {
        break;
      }
    }
    return count;
  }, [wordGroups, input.length]);

  // 监听完成单词数量变化，处理连击逻辑
  useEffect(() => {
    const prevCount = prevCompletedWordRef.current;
    // 刚刚完成了一个新单词
    if (completedWordCount > prevCount) {
      const targetWordIndex = completedWordCount - 1;
      const targetWord = wordGroups[targetWordIndex];
      if (!targetWord) return;

      // 判断这个单词内部是否存在任意错误字符
      const hasAnyWrong = targetWord.items.some(
        (item) => item.status === "wrong",
      );

      if (!hasAnyWrong) {
        // 单词完全正确，连击+1
        const newStreak = wordStreak + 1;
        setWordStreak(newStreak);

        // 连续5个正确，触发庆祝
        if (newStreak === 5) {
          setCelebrateText("Awesome! 🔥");
          setShowCelebrate(true);
          setTimeout(() => setShowCelebrate(false), 1200);
        }
        // 连续10个正确，触发更强庆祝
        if (newStreak === 10) {
          setCelebrateText("Incredible! ⭐");
          setShowCelebrate(true);
          setTimeout(() => setShowCelebrate(false), 1200);
        }
      } else {
        // 该单词存在错误，连击直接清零
        setWordStreak(0);
      }

      // 更新记录，标记本次已经处理过这个单词
      prevCompletedWordRef.current = completedWordCount;
    }
  }, [completedWordCount, wordGroups, wordStreak]);

  // 刷新页面恢复打字文本
  useEffect(() => {
    if (!text) {
      const cacheContent = localStorage.getItem("lastTypingContent");
      if (cacheContent) {
        setText(cacheContent);
      }
    }
  }, [text, setText]);

  // 本地缓存当前打字文本
  useEffect(() => {
    if (text && text.trim()) {
      localStorage.setItem("lastTypingContent", text);
    }
  }, [text]);

  const handleInput = (value: string) => {
    const nextIndex = value.length - 1;

    // 按键音效
    if (nextIndex >= 0) {
      if (value[nextIndex] === text[nextIndex]) {
        playKeySound();
      } else {
        playErrorSound();
      }
    }

    setInput(value);
  };

  // 点击单词查询词典
  const handleWordClick = async (word: string) => {
    setQueryWord(word);
    setShowDictPopup(true);
    setDictLoading(true);
    setDictResult(null);

    try {
      const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          word,
        )}&langpair=en|zh-CN`,
      );
      const data = await res.json();
      setDictResult({
        word,
        phonetic: "",
        audioUrl: "",
        meanings: [
          {
            pos: "",
            def: data.responseData.translatedText,
          },
        ],
      });
    } catch (err) {
      console.error("查询单词失败", err);
    } finally {
      setDictLoading(false);
    }
  };

  // 播放单词发音
  const playWordAudio = () => {
    if (!queryWord) return;

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(queryWord);

    utterance.lang = "en-US";
    utterance.rate = 0.9;

    speechSynthesis.speak(utterance);
  };

  const focusInput = () => {
    const scrollY = window.scrollY;
    hiddenInputRef.current?.focus();
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollY);
    });
  };

  useEffect(() => {
    focusInput();
  }, []);

  // 打字完成，写入历史记录
  useEffect(() => {
    if (!finished) return;
    addHistory({
      date: new Date().toLocaleString(),
      wpm,
      accuracy,
      progress,
      duration: seconds,
    });
  }, [finished, wpm, accuracy, seconds, addHistory]);

  if (!text) {
    return (
      <div style={{ padding: 40 }}>
        <h2>No text selected.</h2>
        <button onClick={() => navigate("/")}>Back Home</button>
      </div>
    );
  }

  return (
    <div
      onClick={focusInput}
      style={{
        maxWidth: 1500,
        margin: "40px auto",
        padding: 24,
        cursor: "text",
        position: "relative",
      }}
    >
      {/* 庆祝动画浮层 */}
      {showCelebrate && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            pointerEvents: "none",
            top: 100,
            zIndex: 999,
          }}
        >
          <div
            style={{
              fontSize: 48,
              fontWeight: "bold",
              color: "#10b981",
              animation: "bouncePop 0.6s ease-out",
            }}
          >
            {celebrateText}
          </div>
        </div>
      )}

      <style>{`
        @keyframes bouncePop {
         0% {transform: scale(0.85); opacity: 0;}
         50% {transform: scale(1.08);}
         100% {transform: scale(1); opacity: 1;}
        }
      `}</style>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <StatsBar
          wpm={wpm}
          accuracy={accuracy}
          progress={progress}
          seconds={seconds}
        />

        <button
          onClick={() => navigate("/")}
          style={{
            padding: "10px 24px",
            border: "1px solid #d1d5db",
            borderRadius: 8,
            background: "#fff",
            cursor: "pointer",
          }}
        >
          Back
        </button>
      </div>

      <TypingText
        chars={chars}
        currentIndex={input.length}
        onWordClick={handleWordClick}
      />

      <textarea
        ref={hiddenInputRef}
        value={input}
        onChange={(e) => handleInput(e.target.value)}
        spellCheck={false}
        autoComplete="off"
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: "1px",
          height: "1px",
          opacity: 0,
          border: "none",
          padding: 0,
          resize: "none",
          zIndex: -1,
        }}
      />

      {/* ===== 单词查询弹窗，模仿截图样式 ===== */}
      {showDictPopup && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setShowDictPopup(false)}
        >
          <div
            style={{
              width: 620,
              background: "white",
              borderRadius: 16,
              padding: 24,
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 关闭按钮 */}
            <div
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                cursor: "pointer",
              }}
              onClick={() => setShowDictPopup(false)}
            >
              ✕
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 8,
              }}
            >
              <h2 style={{ margin: 0, fontSize: 26 }}>{queryWord}</h2>
              <button
                onClick={playWordAudio}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 6,
                  padding: "4px 8px",
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                🔊发音
              </button>
            </div>

            {dictLoading && <div style={{ padding: "10px 0" }}>查询中...</div>}

            {dictResult && (
              <>
                <div style={{ color: "#666", margin: "6px 0 16px 0" }}>
                  {dictResult.phonetic}
                </div>
                {dictResult.meanings.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      border: "1px solid #f1f1f1",
                      borderRadius: 10,
                      padding: 14,
                      marginBottom: 10,
                      background: "#f9fafb",
                    }}
                  >
                    {item.pos && (
                      <span
                        style={{
                          color: "#444",
                          fontWeight: 600,
                        }}
                      >
                        {item.pos}
                      </span>
                    )}
                    <span style={{ color: "#444", marginLeft: 6 }}>
                      {item.def}
                    </span>
                  </div>
                ))}
              </>
            )}

            {!dictLoading && !dictResult && (
              <div style={{ color: "#888", padding: "10px 0" }}>
                未查询到该单词释义
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
