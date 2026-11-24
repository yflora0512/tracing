import { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import { SCREENS } from './routes.jsx';
import './app.css';

/** Presents one fixed-size screen centered and scaled to fit the window. */
export default function Stage({ screen }) {
  const ref = useRef(null);
  const [scale, setScale] = useState(1);
  const { w, h } = screen.size;

  useLayoutEffect(() => {
    const el = ref.current;
    const fit = () => {
      const pad = 32;
      const s = Math.min(1, (el.clientWidth - pad * 2) / w, (el.clientHeight - pad * 2) / h);
      setScale(Math.max(0.2, s));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [w, h]);

  const i = SCREENS.indexOf(screen);
  const prev = SCREENS[i - 1];
  const next = SCREENS[i + 1];

  return (
    <div className="stage">
      <header className="stage__bar">
        <Link to="/screens" className="stage__home" aria-label="화면 목록">
          <img src={`${import.meta.env.BASE_URL}logo-tracing.png`} alt="Trac:ing" width="92" height="25" />
        </Link>
        <span className="stage__title">
          <span className="stage__group">{screen.group}</span>
          {screen.title}
          <span className="stage__ref">{screen.ref}</span>
        </span>
        <span className="stage__nav">
          {prev ? (
            <Link to={prev.path} className="stage__btn" aria-label={`이전: ${prev.title}`}>
              <Icon name="back" size={18} />
            </Link>
          ) : (
            <span className="stage__btn" aria-hidden="true" />
          )}
          {next ? (
            <Link to={next.path} className="stage__btn" aria-label={`다음: ${next.title}`}>
              <Icon name="chevronRight" size={18} />
            </Link>
          ) : (
            <span className="stage__btn" aria-hidden="true" />
          )}
        </span>
      </header>
      <main className="stage__canvas" ref={ref}>
        <div style={{ width: w * scale, height: h * scale }}>
          <div style={{ width: w, height: h, transform: `scale(${scale})`, transformOrigin: '0 0' }}>{screen.element}</div>
        </div>
      </main>
    </div>
  );
}
