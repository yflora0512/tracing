import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import { cx } from '../components/ui/index.jsx';
import './mobile.css';

const TABS = [
  { key: 'home', icon: 'home', to: '/app', label: '홈' },
  { key: 'skin', icon: 'skin', to: '/app/skin', label: '피부' },
  { key: 'changes', icon: 'trend', to: '/app/changes', label: '변화' },
  { key: 'routine', icon: 'routine', to: '/app/routine', label: '루틴' },
  { key: 'products', icon: 'product', to: '/app/products', label: '제품' },
];

/** A7 phone screen with optional floating tab bar */
export function Phone({ tab, children }) {
  return (
    <div className="phone">
      <div className="phone__scroll">{children}</div>
      {tab && (
        <nav className="m-tabbar" aria-label="앱 메뉴">
          {TABS.map((t) => (
            <Link key={t.key} to={t.to} className="m-tab" aria-current={tab === t.key ? 'page' : undefined} aria-label={t.label}>
              <Icon name={t.icon} size={22} />
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}

export function IconButton({ icon, label, to, onClick, bare }) {
  const navigate = useNavigate();
  return (
    <button type="button" className={cx('m-icon-btn', bare && 'm-icon-btn--bare')} aria-label={label} onClick={onClick ?? (to ? () => navigate(to) : undefined)}>
      <Icon name={icon} size={22} />
    </button>
  );
}

/** Tab-level header: big title left, actions right */
export function TopBar({ title, left, actions }) {
  return (
    <div className="m-top">
      {left ?? <span className="m-top__title">{title}</span>}
      <div className="m-top__actions">{actions}</div>
    </div>
  );
}

/** Sub-page header: back · centered title · optional action */
export function SubBar({ title, action, back = -1 }) {
  const navigate = useNavigate();
  return (
    <div className="m-top m-top--tall">
      <IconButton icon="back" label="뒤로" onClick={() => navigate(back)} />
      <span className="m-top__center">{title}</span>
      {action ?? <span style={{ width: 44 }} />}
    </div>
  );
}

export function Filters({ options, defaultValue, onChange }) {
  const [v, setV] = useState(defaultValue ?? options[0]);
  return (
    <div className="m-filters" role="group">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          className="m-filter"
          aria-pressed={v === o}
          onClick={() => {
            setV(o);
            onChange?.(o);
          }}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export function MCard({ variant, className, style, children }) {
  return (
    <div className={cx('m-card', variant && `m-card--${variant}`, className)} style={style}>
      {children}
    </div>
  );
}

export function Section({ title, meta }) {
  return (
    <div className="m-section">
      <span>{title}</span>
      {meta && <span className="m-section__meta">{meta}</span>}
    </div>
  );
}

export function Row({ title, sub, value, valueTone, right }) {
  const color = { accent: 'var(--accent)', muted: 'var(--ink-3)' }[valueTone] ?? 'var(--ink)';
  return (
    <div className="m-row">
      <span className="m-row__text">
        <span className="m-row__title">{title}</span>
        {sub && <span className="m-row__sub">{sub}</span>}
      </span>
      {right ?? (
        <span className="m-row__value" style={{ color }}>
          {value}
        </span>
      )}
    </div>
  );
}

export function Tile({ accent, label, value, foot, to }) {
  const navigate = useNavigate();
  return (
    <button type="button" className={cx('m-tile', accent ? 'm-tile--accent' : 'm-glass')} onClick={to ? () => navigate(to) : undefined}>
      <span className="m-tile__head" style={accent ? undefined : { color: 'var(--ink-2)' }}>
        <span>{label}</span>
        <Icon name="arrowUpRight" size={22} />
      </span>
      <span className="m-tile__value">{value}</span>
      <span className="m-tile__foot">{foot}</span>
    </button>
  );
}

export function MirrorLinkPill({ title, sub, to = '/app/mirror' }) {
  return (
    <Link to={to} className="m-card m-card--pill">
      <span style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="mirror" size={18} />
      </span>
      <span style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: 14, fontWeight: 600 }}>{title}</span>
        <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>{sub}</span>
      </span>
      <span style={{ color: 'var(--ink-4)' }}>›</span>
    </Link>
  );
}

export function Radio({ state, small }) {
  return (
    <span className={cx('m-radio', small && 'm-radio--sm', state === 'on' && 'm-radio--on', state === 'current' && 'm-radio--current')}>
      {state === 'on' && <Icon name="check" size={12} strokeWidth={3} />}
    </span>
  );
}

/** Device-framed sub page (설정 · 제품 등록) */
export function Device({ title, children }) {
  const navigate = useNavigate();
  return (
    <div className="device">
      <div className="device__status">
        <span>09:41</span>
        <span aria-hidden="true">▮▮▮</span>
      </div>
      <div className="device__title">
        <button type="button" className="device__back" aria-label="뒤로" onClick={() => navigate(-1)}>
          <Icon name="back" size={18} />
        </button>
        <span>{title}</span>
      </div>
      {children}
    </div>
  );
}
