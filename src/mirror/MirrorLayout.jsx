import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import { Segmented, cx } from '../components/ui/index.jsx';
import { MODE_INFO, useAppState } from '../app/AppState.jsx';
import './mirror.css';

const NAV = [
  { key: 'home', icon: 'home', to: '/mirror', label: '홈' },
  { key: 'makeup', icon: 'makeup', to: '/mirror/makeup', label: '메이크업' },
  { key: 'skin', icon: 'skin', to: '/mirror/skin', label: '피부' },
  { key: 'changes', icon: 'trend', to: '/mirror/changes', label: '변화' },
  { key: 'routine', icon: 'routine', to: '/mirror/routine', label: '루틴' },
  { key: 'settings', icon: 'gear', to: '/mirror/products/new', label: '설정', bottom: true },
];

export function NavRail({ active }) {
  return (
    <nav className="m-nav" aria-label="거울 메뉴">
      {NAV.map((n) => (
        <Link
          key={n.key}
          to={n.to}
          className={cx('m-nav__item', n.bottom && 'm-nav__item--bottom')}
          aria-current={active === n.key ? 'page' : undefined}
          aria-label={n.label}
        >
          <Icon name={n.icon} />
        </Link>
      ))}
    </nav>
  );
}

/**
 * Mirror screen shell: header (로고 · 인사말 · Day/Night · 시계 · 조명 · 알림) + 3-column body.
 * `title` overrides the greeting; `modeSwitch` shows the Day/Night segmented control.
 */
export default function MirrorLayout({ title, greeting = true, modeSwitch, nightClock, nav, mirror, children }) {
  const { mode, setMode } = useAppState();
  const info = MODE_INFO[modeSwitch || nightClock ? (nightClock ? 'night' : mode) : 'day'];
  return (
    <div className="mirror">
      <header className="m-header">
        <div className="m-header__left">
          <img className="m-header__logo" src={`${import.meta.env.BASE_URL}logo-tracing.png`} alt="Trac:ing" width="92" height="25" />
          {greeting && <span className="m-header__greeting">{title ?? info.greeting}</span>}
          {modeSwitch && (
            <div className="m-header__mode">
              <Segmented
                size="xs"
                label="화면 모드"
                value={mode}
                onChange={setMode}
                options={[
                  { value: 'day', label: 'Day', icon: 'sun' },
                  { value: 'night', label: 'Night', icon: 'moon' },
                ]}
              />
              <span className="m-header__auto">자동</span>
            </div>
          )}
        </div>
        <div className="m-header__right">
          <div className="m-clock">
            <span className="m-clock__date">{info.date}</span>
            <span className="m-clock__time">{info.time}</span>
          </div>
          <button type="button" className="m-round" aria-label="조명">
            <Icon name="sun" size={20} />
          </button>
          <button type="button" className="m-round" aria-label="알림 2개">
            <Icon name="bell" size={20} />
            <span className="m-round__badge">2</span>
          </button>
        </div>
      </header>
      <div className="m-body">
        {mirror}
        <div className="m-panel">{children}</div>
        <NavRail active={nav} />
      </div>
    </div>
  );
}

/* ---------- Mirror pane pieces ---------- */

export function MirrorPane({ faceTop = 200, reflection, glass, className, style, children }) {
  if (glass)
    return (
      <div className={cx('m-pane m-pane--glass', className)} style={style}>
        {children}
      </div>
    );
  return (
    <div className={cx('m-pane', className)} style={style}>
      {faceTop != null && (
        <div className="m-silhouette" style={{ top: faceTop }} aria-hidden="true">
          <span className="m-silhouette__head" />
          <span className="m-silhouette__body" />
        </div>
      )}
      {reflection && <span className="m-reflection">실사용자 거울 반사</span>}
      {children}
    </div>
  );
}

export function FaceTag({ left, top, title, sub, accent, style }) {
  return (
    <button type="button" className={cx('m-tag', accent && 'm-tag--accent')} style={{ left, top, ...style }}>
      <b>{title}</b>
      {sub && <span className="m-tag__sub">{sub}</span>}
    </button>
  );
}

export function VoiceButton({ dark }) {
  return (
    <button type="button" className="m-voice" aria-label="음성 AI" style={dark ? { background: 'var(--ink)' } : undefined}>
      <Icon name="mic" size={22} />
    </button>
  );
}

export function ZoomControl() {
  const [zoom, setZoom] = useState(1);
  const step = (d) => setZoom((z) => Math.min(2, Math.max(1, +(z + d).toFixed(1))));
  return (
    <div className="m-zoom">
      <button type="button" className="m-zoom__btn" aria-label="확대" onClick={() => step(0.1)}>
        <Icon name="plus" size={22} />
      </button>
      <span className="m-zoom__val">{zoom.toFixed(1)}x</span>
      <button type="button" className="m-zoom__btn" aria-label="축소" onClick={() => step(-0.1)}>
        <Icon name="minus" size={22} />
      </button>
    </div>
  );
}

export function Corner({ at = 'tl', children, style }) {
  return (
    <div className={`m-corner m-corner--${at}`} style={style}>
      {children}
    </div>
  );
}

export function Pill({ bottom, children, style }) {
  return (
    <div className={cx('m-pill', bottom && 'm-pill--bottom')} style={style}>
      {children}
    </div>
  );
}
