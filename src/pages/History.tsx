import { useTypingStore } from "../store/typingStore";

export default function History() {
  const history = useTypingStore((state) => state.history);

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "60px auto",
      }}
    >
      <h1>History</h1>

      {history.map((item, index) => (
        <div
          key={index}
          style={{
            marginTop: 12,
          }}
        >
          {item.date}
          {" | "}
          WPM {item.wpm}
          {" | "}
          Accuracy {item.accuracy}%
        </div>
      ))}
    </div>
  );
}
