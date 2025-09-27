
interface CircularProgressProps {
  percent: number;
  size?: number; // диаметр в пикселях (по умолчанию 60)
}

export default function CircularProgress({ percent, size = 60 }: CircularProgressProps) {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Фон круга (неактивная часть) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e0e0e0"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Прогресс (активная часть) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#667eea"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.3s ease',
            transform: 'rotate(-90deg)',
            transformOrigin: 'center',
          }}
        />
      </svg>
      {/* Текст по центру — ГОРИЗОНТАЛЬНЫЙ, без поворота */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: '600',
          color: '#333',
          // ← НИКАКИХ transform: rotate!
        }}
      >
        {percent}%
      </div>
    </div>
  );
}