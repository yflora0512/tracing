import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { MemoryRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AppStateProvider } from '../app/AppState.jsx';
import { SCREENS } from '../app/routes.jsx';

function Watch({ onPath }) {
  const { pathname } = useLocation();
  useEffect(() => {
    onPath?.(pathname);
  }, [pathname, onPath]);
  return null;
}

/**
 * A real, clickable prototype screen (mirror 1440×817 or phone 390×844) scaled to the width of its box.
 * Each instance has its own router and Day/Night state, so screens on the page never affect each other.
 */
export default function LiveScreen({ path, w, h, onPath, className, label }) {
  const ref = useRef(null);
  const [scale, setScale] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    const fit = () => setScale(el.clientWidth / w);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [w]);

  return (
    <div ref={ref} className={className} style={{ position: 'relative', aspectRatio: `${w} / ${h}`, overflow: 'hidden' }} aria-label={label}>
      <div style={{ width: w, height: h, transform: `scale(${scale})`, transformOrigin: '0 0', visibility: scale ? 'visible' : 'hidden' }}>
        <AppStateProvider>
          <MemoryRouter initialEntries={[path]}>
            <Watch onPath={onPath} />
            <Routes>
              {SCREENS.map((s) => (
                <Route key={s.path} path={s.path} element={s.element} />
              ))}
              <Route path="*" element={<Navigate to={path} replace />} />
            </Routes>
          </MemoryRouter>
        </AppStateProvider>
      </div>
    </div>
  );
}
