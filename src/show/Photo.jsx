import { useState } from 'react';
import { Reveal, asset } from './parts.jsx';

/** Every generated image carries this tag until it is replaced with a real shoot. */
export function AiTag({ dark = false }) {
  return <span className={`ai-tag ${dark ? 'ai-tag--dark' : ''}`}>AI concept image · 실촬영 교체 필요</span>;
}

/**
 * UNNI-style photo + text block: a large photo on one side, a short label / title / body / keywords on the other.
 */
export function PhotoSplit({ src, alt, label, title, body, keys = [], flip = false, tone = 'light', ratio = '4 / 5', children }) {
  return (
    <section className={`psplit psplit--${tone} ${flip ? 'is-flip' : ''}`}>
      <Reveal className="psplit__photo" style={{ aspectRatio: ratio }}>
        <img src={asset(src)} alt={alt} loading="lazy" decoding="async" />
        <AiTag dark={tone === 'light'} />
      </Reveal>
      <Reveal className="psplit__text" delay={100}>
        {label && <p className="psplit__label">{label}</p>}
        <h3 className="psplit__title">{title}</h3>
        {body && <p className="psplit__body">{body}</p>}
        {keys.length > 0 && (
          <ul className="psplit__keys">
            {keys.map((k) => (
              <li key={k}>{k}</li>
            ))}
          </ul>
        )}
        {children}
      </Reveal>
    </section>
  );
}

/** Skin change over 14 days: the same cheek at Day 1 / 7 / 14 next to the matching numbers. */
const DAYS = [
  { day: 'Day 1', moist: 32, stage: '건조 3단계', note: '각질이 일어나고 결이 거칠어요', pos: '0%' },
  { day: 'Day 7', moist: 45, stage: '건조 2단계', note: '수분 앰플 1분 추가 후 각질이 줄었어요', pos: '50%' },
  { day: 'Day 14', moist: 58, stage: '건조 1단계', note: '주간 평균(57)을 넘었어요', pos: '100%' },
];
const CURVE = [32, 34, 33, 37, 39, 42, 45, 46, 48, 50, 53, 55, 56, 58];

export function SkinChange() {
  const [i, setI] = useState(0);
  const d = DAYS[i];
  const upto = [0, 6, 13][i];
  const W = 420;
  const H = 150;
  const x = (k) => 10 + (k / 13) * (W - 20);
  const y = (v) => H - 14 - ((v - 25) / 40) * (H - 28);
  const path = CURVE.map((v, k) => `${k ? 'L' : 'M'}${x(k).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  const done = CURVE.slice(0, upto + 1).map((v, k) => `${k ? 'L' : 'M'}${x(k).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
  return (
    <div className="skin">
      <div className="skin__photos">
        {DAYS.map((x2, k) => (
          <button
            key={x2.day}
            type="button"
            className={`skin__shot ${k === i ? 'is-on' : ''}`}
            style={{ backgroundImage: `url(${asset('photo/skin.jpg')})`, backgroundPosition: `${x2.pos} 50%` }}
            onClick={() => setI(k)}
            aria-label={`${x2.day} 피부 사진 보기`}
            aria-pressed={k === i}
          >
            <span>{x2.day}</span>
          </button>
        ))}
        <AiTag />
      </div>
      <div className="skin__data" aria-live="polite">
        <p className="skin__day">{d.day}</p>
        <p className="skin__num">
          <b>{d.moist}</b>
          <span>볼 수분</span>
        </p>
        <p className="skin__stage">
          {d.stage} · {d.note}
        </p>
        <svg className="skin__graph" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`14일 볼 수분 추이, ${d.day} ${d.moist}`}>
          <line x1="10" x2={W - 10} y1={y(57)} y2={y(57)} className="skin__avg" />
          <text x={W - 10} y={y(57) - 6} textAnchor="end" className="skin__avgtxt">
            주간 평균 57
          </text>
          <path d={path} className="skin__line" />
          <path d={done} className="skin__line is-done" />
          <circle cx={x(upto)} cy={y(CURVE[upto])} r="6" className="skin__dot" />
        </svg>
        <input
          className="skin__range"
          type="range"
          min="0"
          max="2"
          step="1"
          value={i}
          onChange={(e) => setI(Number(e.target.value))}
          aria-label="기간 선택: Day 1, 7, 14"
        />
        <div className="skin__ticks" aria-hidden="true">
          <span>Day 1</span>
          <span>Day 7</span>
          <span>Day 14</span>
        </div>
        <p className="note-req">콘셉트 수치 · 실제 사용자 측정 데이터와 촬영 사진으로 교체 필요</p>
      </div>
    </div>
  );
}
