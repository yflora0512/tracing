import { useEffect, useRef, useState } from 'react';

export const asset = (name) => `${import.meta.env.BASE_URL}show/${name}`;

/** Fades children up once they scroll into view (skipped when reduced motion is preferred). */
export function Reveal({ as: Tag = 'div', className = '', delay = 0, children, ...rest }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!('IntersectionObserver' in window)) return setShown(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`reveal ${shown ? 'is-in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  );
}

/** Section heading block: number + english label, big title, lead copy. */
export function SectionHead({ num, label, title, lead, align = 'split' }) {
  return (
    <Reveal className={`s-head s-head--${align}`}>
      <div className="s-head__title">
        <p className="kicker">
          <span className="kicker__num">{num}</span>
          {label}
        </p>
        <h2 className="h-section">{title}</h2>
      </div>
      {lead && <p className="lead">{lead}</p>}
    </Reveal>
  );
}

/** Replaceable image slot — states what image belongs here, its ratio and purpose. */
export function Placeholder({ ratio = '16 / 9', title, spec, className = '' }) {
  return (
    <figure className={`ph ${className}`} style={{ aspectRatio: ratio }}>
      <figcaption>
        <span className="ph__tag">교체용 이미지</span>
        <strong>{title}</strong>
        <span>{spec}</span>
      </figcaption>
    </figure>
  );
}

/** Mirror screenshot exported from the Figma final frames. */
export function MirrorShot({ src, alt, className = '', eager }) {
  return <img className={`shot ${className}`} src={asset(src)} alt={alt} width="2390" height="1356" loading={eager ? 'eager' : 'lazy'} decoding="async" />;
}
