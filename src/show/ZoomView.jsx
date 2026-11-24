import { useState } from 'react';
import { asset } from './parts.jsx';

/**
 * One screen, several close-ups. Choosing a region zooms the real screenshot into it
 * so small numbers (스캔 횟수, 피부 나이) stay readable at showing size.
 * region = { key, label, x, y, w, h (percent of the screen), title, desc }
 */
export default function ZoomView({ src, alt, regions }) {
  const [sel, setSel] = useState(regions[0].key);
  const r = regions.find((g) => g.key === sel);
  const k = Math.min(100 / r.w, 100 / r.h);
  const cx = r.x + r.w / 2;
  const cy = r.y + r.h / 2;
  // clamp so the zoomed image never reveals empty space
  const tx = Math.min(0, Math.max(100 - 100 * k, 50 - cx * k));
  const ty = Math.min(0, Math.max(100 - 100 * k, 50 - cy * k));

  return (
    <div className="zoom">
      <div className="zoom__frame">
        <img
          src={asset(src)}
          alt={alt}
          loading="lazy"
          decoding="async"
          style={{ transform: `translate(${tx}%, ${ty}%) scale(${k})` }}
        />
      </div>
      <div className="zoom__side">
        <div className="zoom__tabs" role="tablist" aria-label="확대할 영역">
          {regions.map((g) => (
            <button key={g.key} type="button" role="tab" aria-selected={g.key === sel} className={g.key === sel ? 'is-on' : ''} onClick={() => setSel(g.key)}>
              {g.label}
            </button>
          ))}
        </div>
        <div className="zoom__mini" aria-hidden="true">
          <img src={asset(src)} alt="" loading="lazy" />
          <span style={{ left: `${r.x}%`, top: `${r.y}%`, width: `${r.w}%`, height: `${r.h}%` }} />
        </div>
        <h4 className="zoom__title">{r.title}</h4>
        <p className="zoom__desc" aria-live="polite">
          {r.desc}
        </p>
      </div>
    </div>
  );
}
