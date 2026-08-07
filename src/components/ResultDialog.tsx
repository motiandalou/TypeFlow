interface Props {
  open: boolean;
  wpm: number;
  accuracy: number;
  seconds: number;
  onRetry: () => void;
  onHome: () => void;
}

export default function ResultDialog({
  open,
  wpm,
  accuracy,
  seconds,
  onRetry,
  onHome,
}: Props) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 500,
          background: "#fff",
          borderRadius: 20,
          padding: 32,
        }}
      >
        <h1
          style={{
            marginBottom: 30,
          }}
        >
          Practice Complete
        </h1>

        <div
          style={{
            display: "grid",
            gap: 20,
          }}
        >
          <div>
            <strong>WPM</strong>
            <div>{wpm}</div>
          </div>
          <div>
            <strong>Accuracy</strong>
            <div>{accuracy}%</div>
          </div>
          <div>
            <strong>Time</strong>
            <div>{seconds}s</div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 32,
          }}
        >
          <button
            onClick={onRetry}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 12,
            }}
          >
            Try Again
          </button>

          <button
            onClick={onHome}
            style={{
              flex: 1,
              background: "#111827",
              color: "#fff",
              padding: 12,
              borderRadius: 12,
            }}
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
}
