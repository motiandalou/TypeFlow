import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { textCollections } from "../data/texts";
import { useTypingStore } from "../store/typingStore";

import PasteDialog from "../components/PasteDialog";

export default function Home() {
  const navigate = useNavigate();
  const setText = useTypingStore((state) => state.setText);
  const [open, setOpen] = useState(false);
  // 控制当前展开的合集，null=全部收起
  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(
    null,
  );

  const startTyping = (content: string) => {
    setText(content);
    navigate("/practice");
  };

  // 切换展开/收起合集
  const toggleCollection = (cid: string) => {
    setActiveCollectionId(activeCollectionId === cid ? null : cid);
  };

  return (
    <>
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "80px 24px",
        }}
      >
        {/* Hero */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 80,
          }}
        >
          <h1
            style={{
              fontSize: 72,
              fontWeight: 800,
              letterSpacing: "-2px",
              color: "#111827",
            }}
          >
            TypeFlow✌️
          </h1>

          <p
            style={{
              marginTop: 16,
              fontSize: 20,
              color: "#6b7280",
            }}
          >
            A way to learn English. <br />
            If you really have no other choice!
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 16,
              marginTop: 40,
            }}
          >
            <button
              onClick={() => setOpen(true)}
              style={{
                padding: "14px 22px",
                borderRadius: 14,
                background: "#111827",
                color: "#fff",
                fontSize: 16,
              }}
            >
              Paste Text
            </button>

            <button
              style={{
                padding: "14px 22px",
                borderRadius: 14,
                background: "#f3f4f6",
                color: "#111827",
                fontSize: 16,
              }}
            >
              Library
            </button>
          </div>
        </div>

        {/* Library 合集列表 */}
        <div>
          <h2
            style={{
              fontSize: 28,
              marginBottom: 24,
            }}
          >
            Library 😭
          </h2>

          <div style={{ display: "grid", gap: 24 }}>
            {textCollections.map((collection) => {
              const isExpanded = activeCollectionId === collection.collectionId;
              return (
                <div
                  key={collection.collectionId}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: 18,
                    padding: 24,
                    transition: "all .2s",
                  }}
                >
                  {/* 合集头部卡片，点击展开 */}
                  <div
                    onClick={() => toggleCollection(collection.collectionId)}
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <h3 style={{ fontSize: 22, marginBottom: 6 }}>
                        {collection.collectionName}
                      </h3>
                      <p style={{ color: "#6b7280", fontSize: 14 }}>
                        {collection.description} · 共{collection.items.length}篇
                      </p>
                    </div>
                    <span style={{ fontSize: 24 }}>
                      {isExpanded ? "−" : "+"}
                    </span>
                  </div>

                  {/* 展开时显示内部条目 */}
                  {isExpanded && (
                    <div
                      style={{
                        marginTop: 24,
                        display: "grid",
                        gap: 16,
                        paddingTop: 24,
                        borderTop: "1px solid #eee",
                      }}
                    >
                      {collection.items.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            border: "1px solid #e5e7eb",
                            borderRadius: 14,
                            padding: 18,
                          }}
                        >
                          <div>
                            <h4 style={{ fontSize: 18, marginBottom: 4 }}>
                              {item.title}
                            </h4>
                            <p style={{ color: "#6b7280", fontSize: 13 }}>
                              {item.content.split(/\s+/).filter(Boolean).length}{" "}
                              words
                            </p>
                          </div>
                          <button
                            onClick={() => startTyping(item.content)}
                            style={{
                              background: "#111827",
                              color: "#fff",
                              padding: "10px 26px",
                              borderRadius: 8,
                            }}
                          >
                            Start
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <PasteDialog
        open={open}
        onClose={() => setOpen(false)}
        onStart={(text) => {
          startTyping(text);
        }}
      />
    </>
  );
}
