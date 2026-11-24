import { useEffect, useState } from 'react';
import LiveScreen from './LiveScreen.jsx';
import { asset } from './parts.jsx';

/**
 * 사용 전 → 조작 → 화면 변화 → 결과.
 * Each step shows a real screen; the hotspot sits on the actual button in that screen and advances the flow.
 *
 * step = { phase, title, desc, img | live: { path, w, h }, hotspot?: { l, t, w, h, label }, auto?: ms, overlay?: node }
 */
export default function FlowDemo({ steps, ratio = '2390 / 1356', label, variant = '' }) {
  const [i, setI] = useState(0);
  const s = steps[i];
  const last = i === steps.length - 1;
  const go = (n) => setI(Math.max(0, Math.min(steps.length - 1, n)));

  useEffect(() => {
    if (!s.auto) return undefined;
    const t = setTimeout(() => go(i + 1), s.auto);
    return () => clearTimeout(t);
  }, [i]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`flow ${variant ? `flow--${variant}` : ''}`} role="group" aria-label={label}>
      <div className="flow__stage">
        <div className="flow__frame" style={{ aspectRatio: ratio }}>
          {steps.map((st, k) => (
            <div key={k} className={`flow__view ${k === i ? 'is-on' : ''}`} aria-hidden={k !== i}>
              {st.img && <img src={asset(st.img)} alt={k === i ? st.title : ''} loading="lazy" decoding="async" />}
              {st.live && k === i && <LiveScreen {...st.live} className="flow__live" />}
            </div>
          ))}
          {s.overlay && <div className="flow__overlay">{s.overlay}</div>}
          {s.hotspot && (
            <button
              type="button"
              className="hotspot"
              style={{ left: `${s.hotspot.l}%`, top: `${s.hotspot.t}%`, width: `${s.hotspot.w}%`, height: `${s.hotspot.h}%` }}
              onClick={() => go(i + 1)}
              aria-label={`${s.hotspot.label} — 다음 화면으로`}
            >
              <span className="hotspot__ring" aria-hidden="true" />
              <span className={`hotspot__tip hotspot__tip--${s.hotspot.tip || 'top'}`}>
                <b>TAP</b> {s.hotspot.label}
              </span>
            </button>
          )}
          {s.auto && <span key={i} className="flow__timer" style={{ animationDuration: `${s.auto}ms` }} aria-hidden="true" />}
        </div>
      </div>

      <div className="flow__side">
        <ol className="flow__steps">
          {steps.map((st, k) => (
            <li key={k}>
              <button type="button" className={`flow__step ${k === i ? 'is-on' : ''} ${k < i ? 'is-done' : ''}`} onClick={() => go(k)} aria-current={k === i ? 'step' : undefined}>
                <span className="flow__phase">
                  {String(k + 1).padStart(2, '0')} · {st.phase}
                </span>
                <span className="flow__title">{st.title}</span>
              </button>
            </li>
          ))}
        </ol>
        <p className="flow__desc" aria-live="polite">
          {s.desc}
        </p>
        <div className="flow__ctrl">
          <button type="button" className="btn-ghost" onClick={() => go(i - 1)} disabled={i === 0}>
            이전
          </button>
          {last ? (
            <button type="button" className="btn-solid" onClick={() => go(0)}>
              처음부터 다시
            </button>
          ) : (
            <button type="button" className="btn-solid" onClick={() => go(i + 1)}>
              {s.hotspot ? s.hotspot.label : '다음'} →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
