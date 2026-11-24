// Line icons · 1.6px stroke · 24 grid (DS 04: 라인 아이콘, 한글 라벨 없음)
const paths = {
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5" />
    </>
  ),
  moon: <path d="M20 14.5A8 8 0 119.5 4a6.5 6.5 0 0010.5 10.5z" />,
  bell: (
    <>
      <path d="M6 16V11a6 6 0 0112 0v5l1.5 2h-15z" />
      <path d="M10 20a2 2 0 004 0" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M6 11a6 6 0 0012 0M12 17v4" />
    </>
  ),
  plus: <path d="M12 6v12M6 12h12" />,
  minus: <path d="M6 12h12" />,
  home: (
    <>
      <path d="M4 11l8-7 8 7" />
      <path d="M6 10v10h12V10" />
    </>
  ),
  makeup: (
    <>
      <rect x="8" y="14" width="8" height="7" rx="1" />
      <path d="M9 14V9l6-3v8" />
      <path d="M8 17.5h8" />
    </>
  ),
  skin: (
    <>
      <circle cx="12" cy="12" r="9" />
      <rect x="7.6" y="9" width="3" height="2" rx="1" />
      <rect x="13.4" y="9" width="3" height="2" rx="1" />
      <path d="M9.5 14.5c1.4 1.6 3.6 1.6 5 0" />
      <path d="M5.6 5.6l1.6 1.6M18.4 5.6l-1.6 1.6M5.6 18.4l1.6-1.6M18.4 18.4l-1.6-1.6" />
    </>
  ),
  trend: (
    <>
      <path d="M4 19l5-6 4 3 7-9" />
      <path d="M15 7h5v5" />
    </>
  ),
  trendSmall: <path d="M4 16l5-5 4 4 7-7M15 8h5v5" />,
  routine: (
    <>
      <path d="M5 6h14M5 12h14M5 18h9" />
      <circle cx="18" cy="18" r="1.5" />
    </>
  ),
  gear: (
    <>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" />
    </>
  ),
  arrowUpRight: <path d="M7 17L17 7M9 7h8v8" />,
  drop: <path d="M12 3.5c-3.2 4-5.5 7.2-5.5 10.2a5.5 5.5 0 0 0 11 0c0-3-2.3-6.2-5.5-10.2z" />,
  mirror: (
    <>
      <rect x="6" y="3" width="12" height="15" rx="6" />
      <path d="M12 18v3M8 21h8" />
    </>
  ),
  product: (
    <>
      <path d="M9 3h6v3H9z" />
      <rect x="7" y="6" width="10" height="15" rx="2.5" />
      <path d="M7 12h10" />
    </>
  ),
  back: <path d="M15 5l-7 7 7 7" />,
  chevronRight: <path d="M9 5l7 7-7 7" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  prev: (
    <>
      <path d="M17 6l-8 6 8 6z" />
      <path d="M7 6v12" />
    </>
  ),
  next: (
    <>
      <path d="M7 6l8 6-8 6z" />
      <path d="M17 6v12" />
    </>
  ),
  pause: <path d="M9 6v12M15 6v12" />,
  play: <path d="M8 5l11 7-11 7z" />,
  check: <path d="M5 12l5 5 9-10" />,
  clock: (
    <>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2.5 2M9 2h6" />
    </>
  ),
  pencil: <path d="M4 20h4L19 9l-4-4L4 16z" />,
  grip: (
    <>
      <circle cx="9" cy="6" r="1" />
      <circle cx="15" cy="6" r="1" />
      <circle cx="9" cy="12" r="1" />
      <circle cx="15" cy="12" r="1" />
      <circle cx="9" cy="18" r="1" />
      <circle cx="15" cy="18" r="1" />
    </>
  ),
};

export default function Icon({ name, size = 24, strokeWidth = 1.6, label, style, className }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: 'block', flexShrink: 0, ...style }}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {paths[name]}
    </svg>
  );
}
