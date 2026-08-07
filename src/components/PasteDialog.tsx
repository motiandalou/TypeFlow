import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onStart: (text: string) => void;
}

export default function PasteDialog({ open, onClose, onStart }: Props) {
  const [text, setText] = useState("");

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
      }}
    >
      <div
        style={{
          width: 700,
          background: "#fff",
          borderRadius: 20,
          padding: 24,
        }}
      >
        <h2
          style={{
            marginBottom: 20,
          }}
        >
          Paste Text
        </h2>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your text here..."
          style={{
            width: "100%",
            height: 260,
            resize: "none",
            padding: 16,
            borderRadius: 12,
            border: "1px solid #d1d5db",
            fontSize: 16,
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            marginTop: 20,
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "10px 16px",
              borderRadius: 10,
            }}
          >
            Cancel
          </button>

          <button
            onClick={() => {
              if (!text.trim()) return;
              onStart(text);
              setText("");
            }}
            style={{
              background: "#111827",
              color: "white",
              padding: "10px 16px",
              borderRadius: 10,
            }}
          >
            Start Typing
          </button>
        </div>
      </div>
    </div>
  );
}
