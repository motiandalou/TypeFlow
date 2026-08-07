import { RefObject } from "react";

interface CharItem {
  char: string;
  status: string;
}

interface Props {
  chars: CharItem[];
  currentIndex: number;
  currentCharRef?: RefObject<HTMLSpanElement | null>;
  onWordClick?: (word: string) => void;
}

export default function TypingText({
  chars,
  currentIndex,
  onWordClick,
}: Props) {
  const wordGroups: Array<{ items: CharItem[]; rawText: string }> = [];
  let temp: CharItem[] = [];
  let tempStr = "";

  for (const c of chars) {
    if (c.char === " " || c.char === "\n") {
      wordGroups.push({ items: temp, rawText: tempStr });
      temp = [];
      tempStr = "";
      wordGroups.push({ items: [c], rawText: c.char });
    } else {
      temp.push(c);
      tempStr += c.char;
    }
  }
  if (temp.length > 0) {
    wordGroups.push({ items: temp, rawText: tempStr });
  }

  return (
    <div
      style={{
        fontSize: 29,
        lineHeight: 1.6,
        userSelect: "text",
        overflowWrap: "break-word",
        cursor: "text",
        padding: "24px",
        background: "#f8fafc",
        fontVariantLigatures: "none",
        fontFeatureSettings: '"liga" 0',
        borderRadius: 16,
        border: "1px solid #e5e7eb",
        wordSpacing: "0px", // 重置单词间距
      }}
    >
      {wordGroups.map((group, groupIdx) => {
        if (group.rawText === "\n") {
          return <br key={groupIdx} />;
        }
        if (group.rawText === " ") {
          return <span key={groupIdx}> </span>;
        }

        return (
          <span
            key={groupIdx}
            onClick={(e) => {
              e.stopPropagation();
              if (onWordClick && group.rawText.trim()) {
                onWordClick(group.rawText.trim());
              }
            }}
            style={{
              cursor: "pointer",
              display: "inline",
            }}
          >
            {group.items.map((item, index) => {
              const realIndex = chars.findIndex((c) => c === item);
              const isCurrent = realIndex === currentIndex;
              let color = "#9ca3af";
              let background = "transparent";
              if (item.status === "correct") {
                color = "#10b981";
              }
              if (item.status === "wrong") {
                color = "#D84F2A";
                background = "#fee2e2";
              }
              if (isCurrent && item.status === "pending") {
                background = "#dcdce7";
              }
              return (
                <span
                  key={index}
                  style={{
                    color,
                    background,
                  }}
                >
                  {item.char}
                </span>
              );
            })}
          </span>
        );
      })}
    </div>
  );
}
