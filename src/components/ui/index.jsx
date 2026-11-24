import { useState } from 'react';
import Icon from '../Icon.jsx';
import './ui.css';

export const cx = (...c) => c.filter(Boolean).join(' ');

/** Card — `glass` (흰색 42% · 블러 24 · 흰 테두리), `frost`, `solid`, `white` */
export function Card({ variant = 'glass', lg, fill, className, style, children, as: Tag = 'div' }) {
  return (
    <Tag className={cx('card', `card--${variant}`, lg && 'card--lg', fill && 'card--fill', className)} style={style}>
      {children}
    </Tag>
  );
}

export function CardLabel({ children, right, style }) {
  if (!right) return <span className="card-label" style={style}>{children}</span>;
  return (
    <div className="card-head" style={style}>
      <span className="card-label">{children}</span>
      {typeof right === 'string' ? <span className="card-meta">{right}</span> : right}
    </div>
  );
}

/** Controlled-or-uncontrolled segmented control. options: string[] | {value,label,icon}[] */
export function Segmented({ options, value, defaultValue, onChange, size, variant, className, style, label }) {
  const opts = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  const [inner, setInner] = useState(defaultValue ?? opts[0].value);
  const current = value ?? inner;
  return (
    <div
      role="group"
      aria-label={label}
      className={cx('seg', size && `seg--${size}`, variant && `seg--${variant}`, className)}
      style={style}
    >
      {opts.map((o) => (
        <button
          key={o.value}
          type="button"
          className="seg__opt"
          aria-pressed={current === o.value}
          onClick={() => {
            setInner(o.value);
            onChange?.(o.value);
          }}
        >
          {o.icon && <Icon name={o.icon} size={15} strokeWidth={1.8} />}
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Button({ variant = 'primary', size, className, style, children, ...rest }) {
  return (
    <button type="button" className={cx('btn', `btn--${variant}`, size && `btn--${size}`, className)} style={style} {...rest}>
      {children}
    </button>
  );
}

export function Chip({ selected, onClick, size, children }) {
  return (
    <button type="button" className={cx('chip', size && `chip--${size}`)} aria-pressed={!!selected} onClick={onClick}>
      {children}
    </button>
  );
}

/** Single-select chip group */
export function ChipGroup({ options, defaultValue, multiple, size, style }) {
  const [sel, setSel] = useState(() => (multiple ? new Set(defaultValue ?? []) : defaultValue));
  const isOn = (o) => (multiple ? sel.has(o) : sel === o);
  const toggle = (o) => {
    if (!multiple) return setSel(o);
    const next = new Set(sel);
    next.has(o) ? next.delete(o) : next.add(o);
    setSel(next);
  };
  return (
    <div className="chip-row" style={style}>
      {options.map((o) => (
        <Chip key={o} size={size} selected={isOn(o)} onClick={() => toggle(o)}>
          {o}
        </Chip>
      ))}
    </div>
  );
}

export function Toggle({ defaultOn = true, label }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} className="toggle" onClick={() => setOn(!on)}>
      <span className="toggle__knob" />
    </button>
  );
}

export function StepBadge({ variant, lg, children }) {
  return <span className={cx('step', variant && `step--${variant}`, lg && 'step--lg')}>{children}</span>;
}

/** 오늘의 화장 / 맞춤 관리 순서 rows */
export function StepList({ steps }) {
  return (
    <div className="steps">
      {steps.map((s, i) => (
        <div className="step-row" key={s.name}>
          <StepBadge variant={s.added ? 'accent' : undefined}>{i + 1}</StepBadge>
          <span className="step-row__name">
            {s.name}
            {s.added && <span className="step-row__tag">추가됨</span>}
          </span>
          <span className="step-row__time">{s.min}분</span>
        </div>
      ))}
    </div>
  );
}

export function Banner({ icon, title, sub, cta, onCta }) {
  return (
    <div className="banner" role="status">
      <span className="banner__main">
        <Icon name={icon} size={22} />
        <span className="banner__text">
          <span>{title}</span>
          <span className="banner__sub">{sub}</span>
        </span>
      </span>
      <button type="button" className="banner__cta" onClick={onCta}>
        {cta}
      </button>
    </div>
  );
}

export function Tooltip({ label, value, white, style, children }) {
  return (
    <div className={cx('tip', white && 'tip--white')} style={style}>
      {label && <span className="tip__label">{label}</span>}
      {value && <span className="tip__value">{value}</span>}
      {children}
    </div>
  );
}
