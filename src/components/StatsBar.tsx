interface Props {
  wpm: number;
  accuracy: number;
  progress: number;
  seconds: number;
}

export default function StatsBar({ wpm, accuracy, progress, seconds }: Props) {
  return (
    <div
      style={{
        display: "flex",
        gap: 40,
        marginBottom: 40,
        fontSize: 18,
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
        <strong>Progress</strong>
        <div>{progress}%</div>
      </div>

      <div>
        <strong>Time</strong>
        <div>{seconds}s</div>
      </div>
    </div>
  );
}
