import { useId } from 'react';
import { Tooltip } from '../ui/index.jsx';

const ACCENT = '#3E8EDE';

/** Catmull-Rom → cubic bezier (부드러운 곡선) */
export function smoothPath(pts) {
  if (!pts.length) return '';
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0]},${p2[1]}`;
  }
  return d;
}

/**
 * 추이 라인 (DS 06): 부드러운 곡선 · 옅은 파랑 채움 · 오늘 점.
 * points are in a 300 × viewH coordinate space; `mark` is the index of the highlighted point.
 */
export function TrendLine({ points, viewH = 72, height = 72, mark = points.length - 1, markLine = true, guide, vline, children }) {
  const id = useId().replace(/:/g, '');
  const line = smoothPath(points);
  const first = points[0];
  const last = points[points.length - 1];
  const m = points[mark];
  return (
    <div style={{ position: 'relative', height }}>
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 300 ${viewH}`}
        preserveAspectRatio="none"
        style={{ display: 'block', overflow: 'visible' }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`g${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={ACCENT} stopOpacity=".16" />
            <stop offset="1" stopColor={ACCENT} stopOpacity="0" />
          </linearGradient>
        </defs>
        {guide != null && (
          <line x1="0" x2="300" y1={guide} y2={guide} stroke="#E6E6E6" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
        )}
        <path d={`${line} L${last[0]},${viewH} L${first[0]},${viewH} Z`} fill={`url(#g${id})`} />
        <path d={line} fill="none" stroke={ACCENT} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        {markLine && (
          <line x1={m[0]} x2={m[0]} y1={m[1]} y2={viewH} stroke={ACCENT} strokeDasharray="2 3" vectorEffect="non-scaling-stroke" />
        )}
        {vline != null && (
          <line x1={vline} x2={vline} y1="0" y2={viewH} stroke="#8A8A8A" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
        )}
      </svg>
      {mark != null && (
        <span
          style={{
            position: 'absolute',
            left: `${(m[0] / 300) * 100}%`,
            top: `${(m[1] / viewH) * 100}%`,
            width: 12,
            height: 12,
            margin: -6,
            borderRadius: '50%',
            background: '#fff',
            border: `2px solid ${ACCENT}`,
          }}
        />
      )}
      {children}
    </div>
  );
}

export function DayLabels({ days, todayLabel = '오늘', fontSize = 12 }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize, color: 'var(--ink-4)' }}>
      {days.map((d) => (
        <span key={d} style={{ width: 30, textAlign: 'center', color: d === todayLabel ? 'var(--ink)' : undefined }}>
          {d}
        </span>
      ))}
    </div>
  );
}

/** 막대 (DS 06): 회색 트랙 · 오늘만 세로 그라데이션 */
export function WeekBars({ values, days, tooltip }) {
  return (
    <div style={{ flex: 1, minHeight: 120, position: 'relative', display: 'flex', gap: 8 }}>
      {values.map((v, i) => {
        const today = i === values.length - 1;
        return (
          <div key={days[i]} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ flex: 1, width: '100%', position: 'relative', borderRadius: 8, background: 'var(--surface-2)' }}>
              <span
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: `${v}%`,
                  borderRadius: 8,
                  background: today ? `linear-gradient(180deg, ${ACCENT} 0%, rgba(62,142,222,.25) 100%)` : '#E2E2E2',
                }}
              />
              {today && (
                <span
                  style={{
                    position: 'absolute',
                    left: '50%',
                    bottom: `${v}%`,
                    width: 10,
                    height: 10,
                    margin: '0 0 -5px -5px',
                    borderRadius: '50%',
                    background: ACCENT,
                    border: '2px solid #fff',
                  }}
                />
              )}
            </div>
            <span style={{ fontSize: 11, color: today ? 'var(--ink)' : 'var(--ink-4)' }}>{days[i]}</span>
          </div>
        );
      })}
      {tooltip}
    </div>
  );
}

/** 분포 히트맵 + 추이 라인 + 구간 선택 (피부 분석 결과 8l) */
const HEAT_LINE = [64.7, 73.5, 84.4, 96.8, 110, 123.2, 135.6, 146.5, 155.3, 161.4, 164.6, 164.6, 161.4, 155.3, 146.5, 135.6, 123.2, 110, 96.8, 66.4, 55.5, 46.7, 40.6, 37.4, 37.4, 40.6];
const MONTHS = ['5월', '6월', '7월', '8월', '9월', '10월', '11월'];

export function HeatmapTrend({ selectFrom = 19 }) {
  const cols = HEAT_LINE.length;
  const step = 800 / cols;
  const rand = (i) => {
    const x = Math.sin(i * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  };
  const pts = HEAT_LINE.map((y, i) => [+(step * i + step / 2).toFixed(1), y]);
  const toStr = (arr) => arr.map((p) => p.join(',')).join(' ');
  return (
    <svg viewBox="-36 -16 836 260" width="100%" style={{ display: 'block', overflow: 'visible' }} role="img" aria-label="최근 7개월 피부 지수 분포와 추이">
      {[
        [44, 70],
        [110, 50],
        [176, 30],
      ].map(([y, t]) => (
        <g key={t}>
          <line x1="0" x2="800" y1={y} y2={y} stroke="#E0E0E0" strokeDasharray="2 4" />
          <text x="-10" y={y + 4} fontSize="12" fill="#8A8A8A" textAnchor="end">
            {t}
          </text>
        </g>
      ))}
      <text x="-10" y="-8" fontSize="11" fill="#AAAAAA" textAnchor="end">
        지수
      </text>
      {Array.from({ length: cols }).map((_, c) =>
        [0, 1, 2, 3].map((r) => (
          <rect
            key={`${c}-${r}`}
            x={(step * c).toFixed(1)}
            y={r * 27.5}
            width="28.8"
            height="25.5"
            rx="3"
            fill={c >= selectFrom ? ACCENT : '#9E9E9E'}
            opacity={(0.06 + rand(c * 4 + r) * 0.44).toFixed(2)}
          />
        )),
      )}
      <rect x={step * selectFrom} y="0" width={800 - step * selectFrom} height="220" fill="none" stroke={ACCENT} strokeOpacity=".35" rx="4" />
      <polyline points={toStr(pts.slice(0, selectFrom))} fill="none" stroke="#9E9E9E" strokeWidth="2" />
      {pts.slice(0, selectFrom).map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="3" fill="#9E9E9E" />
      ))}
      <polyline points={toStr(pts.slice(selectFrom - 1))} fill="none" stroke="#222222" strokeWidth="2.5" />
      {pts.slice(selectFrom).map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="4" fill="#222222" />
      ))}
      {MONTHS.map((m, i) => (
        <text key={m} x={15 + i * 123.1} y="240" fontSize="12" fill="#8A8A8A">
          {m}
        </text>
      ))}
    </svg>
  );
}

/** 지표 다이얼: 회색 방사형 + 파랑 부채꼴 */
export function RadialGauge({ value, size = 72 }) {
  const id = useId().replace(/:/g, '');
  const a = (Math.min(value, 99.9) / 100) * Math.PI * 2;
  const x = 50 + 46 * Math.sin(a);
  const y = 50 - 46 * Math.cos(a);
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ flexShrink: 0 }} aria-hidden="true">
      <defs>
        <radialGradient id={`g${id}`}>
          <stop offset="0" stopColor="#9E9E9E" />
          <stop offset="1" stopColor="#F2F2F2" />
        </radialGradient>
        <radialGradient id={`h${id}`}>
          <stop offset="0" stopColor={ACCENT} />
          <stop offset="1" stopColor={ACCENT} stopOpacity=".15" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill={`url(#g${id})`} />
      {Array.from({ length: 72 }).map((_, i) => {
        const t = (i / 72) * Math.PI * 2;
        return <line key={i} x1="50" y1="50" x2={50 + 46 * Math.sin(t)} y2={50 - 46 * Math.cos(t)} stroke="#BDBDBD" strokeWidth=".3" />;
      })}
      <path d={`M50 50 L50 4 A46 46 0 ${a > Math.PI ? 1 : 0} 1 ${x.toFixed(1)} ${y.toFixed(1)} Z`} fill={`url(#h${id})`} />
    </svg>
  );
}

/** 모바일 링 게이지 (64px) */
export function Ring({ value, color = ACCENT, size = 64, label }) {
  const r = 28;
  const c = 2 * Math.PI * r;
  return (
    <span style={{ position: 'relative', width: size, height: size, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} viewBox="0 0 64 64" style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }} aria-hidden="true">
        <circle cx="32" cy="32" r={r} fill="none" stroke="#E8ECF0" strokeWidth="4" />
        <circle cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeDasharray={`${(value / 100) * c} ${c}`} />
      </svg>
      <span style={{ fontSize: 13, fontWeight: 600 }}>{label ?? value}</span>
    </span>
  );
}

/** 원형 도넛 (스캔 결과 5c) */
export function Donut({ value, accent }) {
  return (
    <span
      style={{
        width: 64,
        height: 64,
        borderRadius: '50%',
        background: `conic-gradient(${accent ? ACCENT : '#BBBBBB'} 0 ${value}%, #EEEEEE ${value}% 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span style={{ width: 50, height: 50, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>
        {value}%
      </span>
    </span>
  );
}

export { Tooltip };
