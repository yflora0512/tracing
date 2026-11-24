import { useState } from 'react';
import { asset } from './parts.jsx';
import { AiTag } from './Photo.jsx';

/**
 * Screen anatomy: numbered pins on a real screen. Hover or click a pin (or a list item) to highlight its area.
 * pin = { l, t, w, h, k: keyword, title, d: description }  (percentages of the screenshot)
 */
export default function Annotated({ src, alt, label, pins, ratio = '2390 / 1356', aiTag = false }) {
  const [on, setOn] = useState(0);
  const p = pins[on];
  return (
    <div className="ann" role="group" aria-label={label}>
      <div className="ann__frame" style={{ aspectRatio: ratio }}>
        <img src={asset(src)} alt={alt} loading="lazy" decoding="async" />
        <span className="ann__shade" aria-hidden="true" style={{ '--l': `${p.l}%`, '--t': `${p.t}%`, '--w': `${p.w}%`, '--h': `${p.h}%` }} />
        <span className="ann__box" aria-hidden="true" style={{ left: `${p.l}%`, top: `${p.t}%`, width: `${p.w}%`, height: `${p.h}%` }} />
        {aiTag && <AiTag dark />}
        {pins.map((x, k) => (
          <button
            key={x.k}
            type="button"
            className={`ann__pin ${k === on ? 'is-on' : ''}`}
            style={{ left: `${x.l}%`, top: `${x.t}%` }}
            onMouseEnter={() => setOn(k)}
            onFocus={() => setOn(k)}
            onClick={() => setOn(k)}
            aria-label={`${k + 1}. ${x.k} — ${x.title}`}
          >
            {k + 1}
          </button>
        ))}
      </div>
      <ol className="ann__list">
        {pins.map((x, k) => (
          <li key={x.k}>
            <button type="button" className={`ann__item ${k === on ? 'is-on' : ''}`} onMouseEnter={() => setOn(k)} onClick={() => setOn(k)} aria-current={k === on ? 'true' : undefined}>
              <span className="ann__n">{String(k + 1).padStart(2, '0')}</span>
              <span className="ann__k">{x.k}</span>
              <b className="ann__title">{x.title}</b>
              <span className="ann__d">{x.d}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
