type ProgressChartProps = {
  points: ReadonlyArray<{
    label: string;
    value: number;
  }>;
};

export function ProgressChart({ points }: ProgressChartProps) {
  if (!points.length) {
    return (
      <div className="progress-chart progress-chart-empty">
        <div className="progress-chart-empty-copy">
          <strong>No trend yet</strong>
          <p>Your improvement path appears after the first saved rounds.</p>
        </div>
      </div>
    );
  }

  const width = 640;
  const height = 260;
  const padding = 20;
  const values = points.map((point) => point.value);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = Math.max(max - min, 1);

  const coordinates = points.map((point, index) => {
    const x =
      padding + (index * (width - padding * 2)) / Math.max(points.length - 1, 1);
    const y =
      height - padding - ((point.value - min) / range) * (height - padding * 2);

    return { ...point, x, y };
  });

  const linePath = coordinates
    .map((coordinate, index) => {
      const command = index === 0 ? "M" : "L";
      return `${command} ${coordinate.x} ${coordinate.y}`;
    })
    .join(" ");

  const lastCoordinate = coordinates[coordinates.length - 1];
  const firstCoordinate = coordinates[0];
  const areaPath = `${linePath} L ${lastCoordinate?.x ?? width - padding} ${
    height - padding
  } L ${firstCoordinate?.x ?? padding} ${height - padding} Z`;

  return (
    <div className="progress-chart">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Reaction time improvement trend across recent sessions"
      >
        <defs>
          <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(72, 112, 132, 0.32)" />
            <stop offset="100%" stopColor="rgba(72, 112, 132, 0)" />
          </linearGradient>
          <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#708f9f" />
            <stop offset="100%" stopColor="#31596a" />
          </linearGradient>
        </defs>

        {[0.2, 0.45, 0.7].map((ratio) => {
          const y = padding + ratio * (height - padding * 2);
          return (
            <line
              key={ratio}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              className="chart-gridline"
            />
          );
        })}

        <path d={areaPath} fill="url(#trendGradient)" />
        <path d={linePath} fill="none" stroke="url(#strokeGradient)" strokeWidth="4" />

        {coordinates.map((coordinate) => (
          <g key={coordinate.label}>
            <circle
              cx={coordinate.x}
              cy={coordinate.y}
              r="7"
              className="chart-point-outer"
            />
            <circle
              cx={coordinate.x}
              cy={coordinate.y}
              r="3.5"
              className="chart-point-inner"
            />
            <text x={coordinate.x} y={height - 2} textAnchor="middle">
              {coordinate.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
