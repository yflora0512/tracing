import { useEffect, useId, useState } from 'react';
import Icon from '../components/Icon.jsx';
import FlowDemo from './FlowDemo.jsx';
import LiveScreen from './LiveScreen.jsx';
import SyncDemo from './SyncDemo.jsx';
import ZoomView from './ZoomView.jsx';
import { MirrorShot, Placeholder, Reveal, asset } from './parts.jsx';
import './show.css';
import './x.css';

/*
 * Case-study flow (BX + UI/UX):
 * Key visual → 01 Overview → 02 Problem → 03 Target → 04 Insight → 05 Brand (BX)
 * → 06 Experience Flow (UX) → 07 Key Features (UI, interactive) → 08 Mirror × Mobile
 * → 09 UI Guideline → 10 Screens → Closing · Credit
 * Layout rhythm after Plus X “UNIX”: one idea per block, generous space, full-bleed visuals between text.
 */

/* ---------------- chapters ---------------- */

const CHAPTERS = [
  ['overview', '01', 'Overview'],
  ['problem', '02', 'Problem'],
  ['target', '03', 'Target'],
  ['insight', '04', 'Insight'],
  ['brand', '05', 'Brand Concept'],
  ['flow', '06', 'Experience Flow'],
  ['features', '07', 'Key Features'],
  ['sync', '08', 'Mirror × Mobile'],
  ['guide', '09', 'UI Guideline'],
  ['screens', '10', 'Screens'],
];

/* ---------------- content (기획서 · 실제 UI 근거) ---------------- */

const META = [
  ['Project', 'Trac:ing — 탁상용 뷰티 미러 & 연동 앱'],
  ['Target', '30~40대 직장인 여성'],
  ['Scope', 'Research · BX · UX · UI · Prototype'],
  ['Platform', 'Mirror 1440×817 · Mobile 390×844'],
];

const QUESTIONS = [
  ['아침', '바쁜 출근 시간에 화장을 잘 할 수 있을까?'],
  ['저녁', '내 피부에 맞는 관리를 하고 있을까?'],
  ['내일', '매일의 관리로 바라던 피부에 가까워졌을까?'],
];

const STATS = [
  ['67.1%', '30·40대 직장인 여성의 출근 준비 시간 부족 경험', '통계청, 《생활 시간 조사》 2025.07.28'],
  ['+35.2%', '기능성 화장품 생산액 전년 대비 증가율', '식약처, 《24년 화장품 생산·수출액 사상 최대》 2025.05.27'],
];

const PERSONAS = [
  { time: '08:10', tag: 'Day · Time First', name: '한지우', meta: '34세 · 외국계 패션 디자이너', quote: '시계를 계속 보지 않아도 출근 시간 늦지 않게 화장을 잘 하고 싶어요' },
  { time: '21:40', tag: 'Night · Care First', name: '윤서진', meta: '45세 · 금융 애널리스트', quote: '퇴근 후 매일 밤 관리하고 있지만, 내 피부에 맞고 건강해지는지 궁금해요' },
];

const INSIGHTS = [
  ['출근 준비 중 화장에 일정 시간 이상이 걸리고, 시계·영상·거울을 번갈아 본다', '내 준비 시간에 맞춘 단계별 안내와 음성 알림', 'Fit Time · Follow'],
  ['어디를 몇 번 고쳤는지, 무엇을 발랐는지 남지 않는다', '보정 부위와 사용 제품을 저녁 관리로 넘기는 기록', 'Connect'],
  ['내 피부에 맞는지, 실제로 좋아지는지 알기 어렵다', '부위별 스캔과 변화 추이, 다음 날 루틴 반영', 'Check · Care · Review'],
];

const KEYWORDS = [
  ['Clear', '명료한', '한눈에 알기 쉽게'],
  ['Guided', '안내하는', '따라 하기 쉽게'],
  ['Adaptive', '맞추는', '상황과 피부에 맞게'],
  ['Layered', '중첩되는', '겹쳐 쌓이는 기록'],
];

const COLORS = [
  { hex: '#3E8EDE', name: 'Trace Blue', role: 'Primary', use: '선택 · 알림 · 오늘의 데이터', size: 'xl' },
  { hex: '#222222', name: 'Ink', role: 'Primary', use: '본문 · 큰 수치', size: 'lg' },
  { hex: '#F4F4F4', name: 'Surface', role: 'System', use: '카드 · 트랙', size: 'sm' },
  { hex: '#8A8A8A', name: 'Ink 3', role: 'System', use: '보조 라벨', size: 'sm' },
  { hex: '#E4F0FB', name: 'Accent Soft', role: 'Point', use: '선택 배경', size: 'sm' },
];

const LOOP = [
  { n: '01', en: 'Fit Time', ko: '시간 맞춤', t: 'day' },
  { n: '02', en: 'Follow', ko: '화장 안내', t: 'day' },
  { n: '03', en: 'Connect', ko: '기록 연결', t: 'day' },
  { n: '04', en: 'Check', ko: '피부 확인', t: 'night' },
  { n: '05', en: 'Care', ko: '맞춤 관리', t: 'night' },
  { n: '06', en: 'Review', ko: '변화 확인', t: 'next' },
];

const MORNING_STEPS = [
  {
    phase: '사용 전',
    title: '거울이 먼저 켜진다',
    img: 'home.png',
    desc: '08:10, 거울 앞에 서면 어제 저녁 기록으로 “볼이 계속 건조해요”를 먼저 알려 줍니다. 오른쪽 메뉴의 메이크업 탭을 눌러 보세요.',
    hotspot: { l: 91.6, t: 24.2, w: 5.8, h: 7.6, label: '메이크업 탭', tip: 'left' },
  },
  {
    phase: '조작 → 화면 변화',
    title: '지금 할 행동 한 줄',
    img: 'makeup.png',
    desc: '얼굴 위에는 “광대 위쪽에 가볍게 두드려요” 한 줄과 진행 바만 둡니다. 제품과 가이드 영상은 얼굴 밖 패널로 옮겼습니다.',
    hotspot: { l: 72.3, t: 89.2, w: 17.1, h: 6.4, label: '다음 단계', tip: 'top' },
  },
  {
    phase: '사용 결과',
    title: '보정 부위까지 기록',
    live: { path: '/mirror/makeup/done', w: 1440, h: 817 },
    desc: '18분 / 예상 20분. 블러셔 오른쪽 1곳은 “1cm 아래로” 보정을 권합니다. ‘거울 / 결과 체크’를 직접 눌러 보세요.',
  },
];

const NIGHT_STEPS = [
  {
    phase: '사용 전',
    title: '오늘 볼 것부터',
    img: 'scan-ready.png',
    desc: '21:40, 아침 기록을 이어 받아 “볼이 3일째 건조해요”를 먼저 보여 줍니다. 얼굴을 틀에 맞추면 스캔을 준비합니다.',
    hotspot: { l: 63.1, t: 88.2, w: 26.3, h: 7.4, label: '스캔 시작', tip: 'top' },
  },
  {
    phase: '화면 변화',
    title: '부위별 순서 측정',
    img: 'scan-progress.png',
    auto: 3200,
    desc: '볼 → T존 → 턱 → 얼굴 전체 순서로 측정합니다. 끝나면 자동으로 결과로 넘어갑니다.',
  },
  {
    phase: '결과 읽기',
    title: '겹친 원으로 읽기',
    img: 'scan-result.png',
    desc: '원이 클수록 범위가 넓고, 많이 겹칠수록 오래 진행된 상태입니다. 볼 영역을 눌러 보세요.',
    hotspot: { l: 16, t: 46.5, w: 13.5, h: 12, label: '볼 영역', tip: 'top' },
  },
  {
    phase: '사용 결과',
    title: '오늘의 관리 코스',
    img: 'scan-detail.png',
    desc: '오늘 목표는 수분 60(지금 42). 수분 앰플(볼에 2방울)부터 6분 관리 코스로 바로 이어집니다.',
  },
];

const ROUTINE_STEPS = [
  {
    phase: '사용 전',
    title: 'AI가 제안한다',
    img: 'routine.png',
    desc: '쌓인 기록으로 “기초에 수분 앰플 1분을 더할까요?”를 제안하고, 바뀌는 값(시작 07:50→07:49)을 미리 보여 줍니다.',
    hotspot: { l: 64.9, t: 72.8, w: 11, h: 5.4, label: '추가', tip: 'top' },
  },
  {
    phase: '조작 → 화면 변화',
    title: '내일 루틴에 반영',
    img: 'routine.png',
    overlay: (
      <div className="applied" style={{ left: '64.6%', top: '54%', width: '23.2%' }}>
        <b>✓ 추가됨</b>
        <span>내일 아침 07:49 시작 · 기초 4분</span>
      </div>
    ),
    desc: '내일 아침 루틴이 07:49 시작으로 바뀌고 보습 단계가 1분 늘어납니다. 저장하면 다음 날 첫 화면에 반영됩니다.',
    hotspot: { l: 63.1, t: 89.4, w: 26.3, h: 6.2, label: '저장', tip: 'top' },
  },
  {
    phase: '사용 결과',
    title: '다음 날 첫 화면',
    img: 'home.png',
    desc: '오늘의 결과가 다음 날 첫 화면이 됩니다. 하루가 다시 처음으로 이어집니다.',
  },
];

const CHANGE_REGIONS = [
  { key: 'all', label: '전체', x: 0, y: 0, w: 100, h: 100, title: '쌓이면 보이는 변화', desc: '피부 지수 추이, 종합 점수, 한 줄 요약, 피부 나이를 한 화면에 모았습니다. 영역을 눌러 확대해 보세요.' },
  { key: 'trend', label: '7주 추이', x: 3, y: 15, w: 58, h: 57, title: '관리한 날부터 오르는 그래프', desc: '파란 칸은 관리를 이어 간 최근 4주(스캔 24회)입니다. 최근 4주 변화 +18%.' },
  { key: 'score', label: '점수 · 요약', x: 63, y: 14, w: 27, h: 31, title: '숫자 하나, 문장 하나', desc: '종합 피부 점수 72(▲4)와 “수분이 4주째 오르고 있어요” 한 줄 요약.' },
  { key: 'age', label: '피부 나이', x: 63, y: 46, w: 27, h: 50, title: '피부 나이 27세', desc: '3월 대비 2세 낮아졌고, 지금 추세의 12월 예상치를 함께 보여 줍니다.' },
  { key: 'parts', label: '항목별', x: 4, y: 79, w: 57, h: 15, title: '항목별 지수', desc: '수분 36% · 유분 64% · 모공 20% · 모공 40%. (원본에 ‘모공’이 두 번 표기되어 확인 필요)' },
];

const CONNECT_TILES = [
  { key: 'skin', icon: 'skin', big: '건조', label: '피부 상태', sub: '볼 · 3일째', row: 40.9, accent: true },
  { key: 'fix', icon: 'makeup', big: '볼', label: '보정 부위', sub: '블러셔 1회', row: 46.1 },
  { key: 'hold', icon: 'product', big: '13h', label: '쿠션 유지', sub: '세미 매트', row: 51.3 },
];

const PRINCIPLES = [
  ['Contrast', '가독성 · 대비', '흰 글씨 대신 #222 텍스트, 반투명 흰 카드로 거울 배경과 분리합니다.'],
  ['Hierarchy', '정보 위계', '본문 17px 이상, 대표 수치 44px. 화면마다 핵심 요소 하나에 집중합니다.'],
  ['Three Things', '핵심 정보 3개', '지금 할 행동 · 바를 부위 · 사용할 제품만 얼굴 앞에 두고, 나머지는 패널로 옮깁니다.'],
];

const TYPE = [
  ['44', '300', '대표 수치', '72'],
  ['30', '500', '카드 헤드라인', '볼이 건조해요'],
  ['22', '500', '화면 제목', '좋은 아침이에요'],
  ['17', '400', '안내 문구', '광대 위쪽에 가볍게 두드려요'],
  ['13', '400', '보조 설명', '어제 저녁 기록 기준'],
];

const MENU = [
  ['home', 'Home', '홈'],
  ['makeup', 'Make Up', '메이크업'],
  ['skin', 'Care', '관리'],
  ['trend', 'Change', '변화'],
  ['gear', 'Setting', '설정'],
];

const MIRROR_STRIP = [
  ['home.png', 'HOME'],
  ['makeup.png', 'Make Up'],
  ['scan-ready.png', 'Scan Ready'],
  ['scan-progress.png', 'Skin Scan'],
  ['scan-result.png', 'Scan Result'],
  ['scan-detail.png', 'Care Course'],
  ['change.png', 'Change'],
  ['routine.png', 'Routine'],
];

const PHONE_STRIP = [
  ['/app', '홈'],
  ['/app/skin', '피부'],
  ['/app/changes', '변화'],
  ['/app/routine', '루틴'],
  ['/app/products', '제품'],
  ['/app/mirror', '거울로 보내기'],
  ['/app/mirror/live', '진행 중 리모컨'],
  ['/app/mirror/done', '완료 기록 수신'],
];

/* ---------------- building blocks ---------------- */

function Header() {
  const [solid, setSolid] = useState(false);
  const [p, setP] = useState(0);
  const [cur, setCur] = useState(null);
  useEffect(() => {
    const on = () => {
      const h = document.documentElement;
      setSolid(h.scrollTop > window.innerHeight * 0.85);
      setP(h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight));
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setCur(e.target.dataset.chapter)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    document.querySelectorAll('[data-chapter]').forEach((el) => io.observe(el));
    return () => {
      window.removeEventListener('scroll', on);
      io.disconnect();
    };
  }, []);
  return (
    <header className={`x-head ${solid ? 'is-solid' : ''}`}>
      <a href="#top" className="x-head__logo" aria-label="Trac:ing 처음으로">
        Trac<span>:</span>ing
      </a>
      <span className="x-head__cur" aria-live="polite">
        {solid && cur}
      </span>
      <nav className="x-head__nav" aria-label="바로가기">
        <a href="#index">Index</a>
        <a className="x-head__cta" href="#/screens">
          Prototype <Icon name="arrowUpRight" size={14} />
        </a>
      </nav>
      <span className="x-head__bar" style={{ transform: `scaleX(${p})` }} aria-hidden="true" />
    </header>
  );
}

/** Chapter wrapper: thin rule, number + english name on the left, korean title + lead on the right. */
function Chapter({ id, title, lead, tone = '', children }) {
  const [, n, en] = CHAPTERS.find((c) => c[0] === id);
  return (
    <section className={`x-ch ${tone ? `x-ch--${tone}` : ''}`} id={id} data-chapter={`${n}  ${en}`}>
      <Reveal className="x-ch__head">
        <p className="x-ch__no">
          <span>{n}</span>
          {en}
        </p>
        <div className="x-ch__main">
          <h2 className="x-ch__title">{title}</h2>
          {lead && <p className="x-ch__lead">{lead}</p>}
        </div>
      </Reveal>
      {children}
    </section>
  );
}

/** Sub-heading inside a chapter: small label + short body, aligned to the chapter's content column. */
function Sub({ label, children }) {
  return (
    <Reveal className="x-sub">
      <h3 className="x-sub__label">{label}</h3>
      {children && <p className="x-sub__body">{children}</p>}
    </Reveal>
  );
}

/** Full-bleed scene cover inside Key Features. */
function Cover({ id, n, en, title, ko, tone, art }) {
  return (
    <div className={`x-cover x-cover--${tone}`} id={id}>
      <div className="x-cover__art" aria-hidden="true">
        {art}
      </div>
      <div className="x-cover__in">
        <span className="x-cover__n">
          Scene {n} — {en}
        </span>
        <h3 className="x-cover__title">{title}</h3>
        <p className="x-cover__ko">{ko}</p>
      </div>
    </div>
  );
}

/** Dotted tracing outline of a face, drawn on with a mask — the brand motif. */
function TraceFace({ spots = true, className = '' }) {
  const face = 'M200 70 C268 70 312 124 312 196 C312 270 266 330 200 330 C134 330 88 270 88 196 C88 124 132 70 200 70 Z';
  const body = 'M40 470 C52 398 112 362 200 362 C288 362 348 398 360 470';
  const mid = `trace-${useId().replace(/:/g, '')}`;
  return (
    <svg className={`trace ${className}`} viewBox="0 0 400 480" fill="none">
      <defs>
        <mask id={mid}>
          <path d={face} pathLength="1" className="trace__draw" />
          <path d={body} pathLength="1" className="trace__draw trace__draw--2" />
        </mask>
      </defs>
      <g mask={`url(#${mid})`}>
        <path d={face} className="trace__dot" />
        <path d={body} className="trace__dot" />
      </g>
      {spots && (
        <g className="trace__spots">
          <circle cx="138" cy="226" r="22" />
          <circle cx="262" cy="226" r="22" />
          <circle cx="200" cy="146" r="14" className="is-warm" />
        </g>
      )}
    </svg>
  );
}

function DeskMirror({ src, alt }) {
  return (
    <div className="desk">
      <div className="desk__mirror">
        <div className="desk__screen">
          <img src={asset(src)} alt={alt} loading="lazy" decoding="async" />
        </div>
      </div>
      <span className="desk__neck" aria-hidden="true" />
      <span className="desk__base" aria-hidden="true" />
    </div>
  );
}

function ConnectDemo() {
  const [sel, setSel] = useState('skin');
  const t = CONNECT_TILES.find((x) => x.key === sel);
  return (
    <div className="connect">
      <div className="connect__card">
        <div className="connect__card-head">
          <span>아침 기록에서 이어서</span>
          <span className="accent">03 Connect</span>
        </div>
        <div className="connect__tiles" role="tablist" aria-label="아침 기록">
          {CONNECT_TILES.map((x) => (
            <button key={x.key} type="button" role="tab" aria-selected={sel === x.key} className={`connect__tile ${sel === x.key ? 'is-on' : ''}`} onClick={() => setSel(x.key)}>
              <span className="connect__icon">
                <Icon name={x.icon} size={20} />
              </span>
              <b className={x.accent ? 'accent' : ''}>{x.big}</b>
              <span className="connect__label">{x.label}</span>
              <span className="connect__sub">{x.sub}</span>
            </button>
          ))}
        </div>
        <div className="connect__bars">
          <div className="connect__bars-head">
            <span>볼 수분 변화</span>
            <span className="chip-accent">▼ 8</span>
          </div>
          <div className="connect__bar">
            <span>어제 저녁</span>
            <i>
              <em style={{ width: '50%' }} />
            </i>
            <b>50</b>
          </div>
          <div className="connect__bar">
            <span>오늘 아침</span>
            <i>
              <em className="is-accent" style={{ width: '42%' }} />
            </i>
            <b className="accent">42</b>
          </div>
          <span className="connect__ref">| 적정 60</span>
        </div>
        <p className="connect__hint">기록을 눌러 저녁 화면의 어느 줄로 넘어가는지 확인해 보세요 →</p>
      </div>
      <div className="connect__screen">
        <div className="connect__frame">
          <MirrorShot src="scan-ready.png" alt="저녁 스캔 준비 화면 · 중요 피부 기록" />
          <span className="connect__hl" style={{ top: `${t.row - 2.6}%` }} aria-hidden="true" />
        </div>
        <p className="caption">21:40 · Scan Ready — 아침 기록이 ‘중요 피부 기록’ 목록으로 넘어옵니다.</p>
      </div>
    </div>
  );
}

/* ---------------- page ---------------- */

export default function Showing() {
  useEffect(() => {
    document.title = 'Trac:ing — 하루를 이어서 기억하는 거울';
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id && !id.startsWith('/')) {
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'instant', block: 'start' }));
    }
  }, []);

  return (
    <div className="show x" id="top">
      <Header />

      {/* KEY VISUAL ------------------------------------------------ */}
      <section className="x-hero">
        <div className="x-hero__sky" aria-hidden="true" />
        <TraceFace spots={false} className="trace--hero" />
        <div className="x-hero__in">
          <h1 className="x-hero__title">
            The Mirror That
            <br />
            Remembers Your Day
          </h1>
          <p className="x-hero__ko">하루를 이어서 기억하는 거울, Trac:ing</p>
        </div>
        <p className="x-hero__foot">
          <span>Trac:ing — Desk Beauty Mirror &amp; App</span>
          <span>Interaction Design 2026 · 22565053 조윤정 · 김승언 교수님</span>
        </p>
      </section>

      {/* INDEX ------------------------------------------------------- */}
      <section className="x-index" id="index">
        <Reveal className="x-index__in">
          <p className="x-index__logo">
            Trac<span>:</span>ing
          </p>
          <ol className="x-index__list">
            {CHAPTERS.map(([id, n, en]) => (
              <li key={id}>
                <a href={`#${id}`}>
                  <span>{n}</span>
                  {en}
                </a>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      {/* 01 OVERVIEW ------------------------------------------------- */}
      <Chapter
        id="overview"
        title="아침의 기록이 저녁의 관리로, 저녁의 결과가 내일 아침으로"
        lead="Trac:ing은 아침 출근부터 밤 관리까지 함께하는 탁상용 뷰티 미러입니다. 출근 시간에 맞춰 메이크업을 안내하고, 그 기록을 저녁 피부 확인으로 넘기며, 저녁의 결과를 다음 날 루틴에 반영합니다."
      >
        <Reveal as="dl" className="x-meta">
          {META.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </Reveal>
      </Chapter>

      <section className="x-product">
        <Reveal className="x-product__in">
          <DeskMirror src="home.png" alt="Trac:ing 미러 홈 화면 · 08:10 볼이 계속 건조해요" />
        </Reveal>
        <p className="x-product__cap">
          <b>08:10</b> 거울 앞에 서면, 어제의 기록이 오늘의 피부를 먼저 알려 줍니다.
        </p>
      </section>

      {/* 02 PROBLEM -------------------------------------------------- */}
      <Chapter id="problem" title="시간이 없는 아침, 기억나지 않는 저녁" lead="화장은 화장대로, 관리는 관리대로 따로 놉니다. 그래서 하루에 세 번, 같은 질문이 생깁니다.">
        <ol className="x-q">
          {QUESTIONS.map(([t, q], k) => (
            <Reveal as="li" key={q} delay={k * 80}>
              <span className="x-q__n">Q{k + 1}</span>
              <span className="x-q__t">{t}</span>
              <span className="x-q__q">{q}</span>
            </Reveal>
          ))}
        </ol>
      </Chapter>

      <section className="x-stats">
        {STATS.map(([v, l, src], k) => (
          <Reveal className="x-stat" key={v} delay={k * 120}>
            <b className="x-stat__v">{v}</b>
            <span className="x-stat__l">{l}</span>
            <span className="x-stat__src">{src}</span>
          </Reveal>
        ))}
      </section>

      {/* 03 TARGET --------------------------------------------------- */}
      <Chapter
        id="target"
        title="아침의 지우, 밤의 서진"
        lead="바쁜 출근 전에는 시간에 맞춰 화장하고, 퇴근 후에는 피부 변화를 확인하며 내게 맞는 관리를 이어가고 싶은 30~40대 직장인 여성. 하루의 두 순간을 대표하는 두 사람을 설정했습니다."
      />
      <section className="x-persona">
        {PERSONAS.map((p, k) => (
          <Reveal className={`x-persona__half x-persona__half--${k ? 'night' : 'day'}`} key={p.name} delay={k * 120}>
            <span className="x-persona__time">{p.time}</span>
            <div>
              <span className="x-persona__tag">{p.tag}</span>
              <h3 className="x-persona__name">
                {p.name} <small>{p.meta}</small>
              </h3>
              <p className="x-persona__quote">“{p.quote}”</p>
            </div>
          </Reveal>
        ))}
      </section>

      {/* 04 INSIGHT -------------------------------------------------- */}
      <Chapter id="insight" title="세 가지 인사이트, 하나로 이어지는 해결" lead="리서치와 페르소나에서 얻은 인사이트를 각각 기능으로 연결했습니다. 세 기능은 따로 있지 않고, 하루의 순서대로 이어집니다.">
        <ol className="x-ins">
          {INSIGHTS.map(([i, s, f], k) => (
            <Reveal as="li" key={f} delay={k * 80}>
              <span className="x-ins__n">0{k + 1}</span>
              <div className="x-ins__col">
                <span className="x-ins__k">Insight</span>
                <p>{i}</p>
              </div>
              <div className="x-ins__col">
                <span className="x-ins__k">Solution</span>
                <p className="x-ins__s">{s}</p>
                <span className="x-ins__f">{f}</span>
              </div>
            </Reveal>
          ))}
        </ol>
      </Chapter>

      <section className="x-split">
        <Reveal className="x-split__card x-split__card--before">
          <span className="x-split__k">Before</span>
          <p className="x-split__en">
            Makeup and care,
            <br />
            living apart
          </p>
          <p className="x-split__ko">화장과 관리가 따로 노는 하루</p>
        </Reveal>
        <Reveal className="x-split__card x-split__card--after" delay={120}>
          <span className="x-split__k">With Trac:ing</span>
          <p className="x-split__en">
            One day,
            <br />
            traced as one
          </p>
          <p className="x-split__ko">하나로 이어서 기억되는 하루</p>
        </Reveal>
      </section>

      {/* 05 BRAND (BX) ---------------------------------------------- */}
      <Chapter
        id="brand"
        tone="grey"
        title="필요한 곳을 짚어 주고, 하루를 겹쳐 쌓는다"
        lead="브랜드 컨셉은 트레이싱지(Tracing Paper)에서 출발했습니다. 투명한 종이를 대고 따라 그리듯 필요한 위치와 방법을 그 자리에 짚어 주고, 기록을 한 장씩 겹쳐 쌓아 변화를 보여 줍니다."
      >
        <Reveal className="x-statement">
          <span>Brand Statement</span>
          <p>Trace what matters, layer every day.</p>
        </Reveal>

        <Sub label="Keywords">네 가지 키워드는 모든 화면과 그래픽의 판단 기준이 됩니다.</Sub>
        <ul className="x-keys">
          {KEYWORDS.map(([en, ko, d], k) => (
            <Reveal as="li" key={en} delay={k * 60}>
              <b>{en}</b>
              <span>{ko}</span>
              <i>{d}</i>
            </Reveal>
          ))}
        </ul>

        <Sub label="Visual Identity">워드마크와 두 가지 그래픽 모티프. 점선은 ‘짚어 주는 안내’를, 겹친 원은 ‘쌓이는 기록’을 뜻하며 실제 UI에서도 같은 의미로 쓰입니다.</Sub>
        <div className="x-id">
          <Reveal className="x-id__mark">
            <p>
              Trac<span>:</span>ing
            </p>
            <i>Wordmark</i>
          </Reveal>
          <Reveal className="x-id__motif" delay={80}>
            <TraceFace className="trace--motif" />
            <i>Motif 01 · Dotted Trace — 위치 안내</i>
          </Reveal>
          <Reveal className="x-id__motif x-id__motif--rings" delay={160}>
            <span className="x-rings x-rings--small">
              <i />
              <i />
              <i />
            </span>
            <i>Motif 02 · Layered Circles — 범위와 진행</i>
          </Reveal>
        </div>

        <Sub label="Color">강조는 한 색만 씁니다. Trace Blue는 선택·알림·오늘의 데이터에만, 나머지 정보는 Ink의 명도 차이로 위계를 만듭니다.</Sub>
        <div className="x-colors">
          {COLORS.map((c) => (
            <Reveal className={`x-color x-color--${c.size}`} key={c.hex}>
              <span className="x-color__chip" style={{ background: c.hex }} />
              <span className="x-color__role">{c.role}</span>
              <b>{c.name}</b>
              <code>{c.hex}</code>
              <span className="x-color__use">{c.use}</span>
            </Reveal>
          ))}
        </div>

        <Sub label="Typography">영문 디스플레이는 지오메트릭 산세리프, 화면 UI는 Noto Sans KR. 거울에서 1m 떨어져서도 읽히는 크기를 기준으로 했습니다.</Sub>
        <Reveal className="x-spec">
          <div>
            <i>UI · Noto Sans KR</i>
            <b className="x-spec__ko">가나다 72</b>
          </div>
          <div>
            <i>Display · Outfit</i>
            <b className="x-spec__en">Aa Trace</b>
          </div>
        </Reveal>
      </Chapter>

      {/* 06 EXPERIENCE FLOW (UX) ----------------------------------- */}
      <Chapter id="flow" title="하루가 여섯 단계로 한 바퀴 돈다" lead="아침(Day)에 시작한 기록이 저녁(Night)의 확인과 관리로, 그 결과가 다음 날(Next) 루틴으로 돌아옵니다. 다음 장에서 각 단계를 실제 화면으로 눌러 볼 수 있습니다.">
        <Reveal className="x-loop">
          <div className="x-loop__phases" aria-hidden="true">
            <span style={{ gridColumn: '1 / span 3' }}>Day</span>
            <span style={{ gridColumn: '4 / span 2' }}>Night</span>
            <span style={{ gridColumn: '6 / span 1' }}>Next</span>
          </div>
          <ol>
            {LOOP.map((l) => (
              <li key={l.n} className={`is-${l.t}`}>
                <span>{l.n}</span>
                <b>{l.en}</b>
                <i>{l.ko}</i>
              </li>
            ))}
          </ol>
          <p className="x-loop__back">↺ 다음 날 01로</p>
        </Reveal>
      </Chapter>

      {/* 07 KEY FEATURES (UI) -------------------------------------- */}
      <Chapter id="features" title="네 장면으로 보는 하루" lead="각 장면은 사용 전 → 조작 → 화면 변화 → 결과 순서로 구성했습니다. 화면 위 파란 테두리(TAP)를 누르면 실제 버튼처럼 다음 화면으로 넘어갑니다." />

      <Cover id="morning" n="1" en="Morning" tone="morning" title="Fit Time & Follow" ko="출근 시간에 맞춰, 거울이 먼저 켜진다" art={<span className="x-sun" />} />
      <Sub label="08:10 · 시계를 보지 않아도 되는 아침">거울이 시간과 순서를 챙기고, 사용자는 따라 하기만 합니다. 어디를 몇 번 보정했는지도 함께 기록됩니다.</Sub>
      <section className="x-band x-band--morning">
        <FlowDemo steps={MORNING_STEPS} label="아침 메이크업 흐름" variant="cinema" />
      </section>
      <ul className="x-details">
        <Reveal as="li">
          <b>Timer</b>
          <p>출근 시각을 기준으로 단계별 남은 시간을 보여 줍니다.</p>
        </Reveal>
        <Reveal as="li" delay={80}>
          <b>Voice</b>
          <p>화장 종료 5분·10분 전 음성으로 알리고, 음성 명령도 받습니다.</p>
        </Reveal>
        <Reveal as="li" delay={160}>
          <b>Dotted Guide</b>
          <p>점선과 원형 스팟으로 바를 위치와 양을 얼굴 위에 안내합니다.</p>
        </Reveal>
      </ul>

      <Cover id="connect" n="2" en="Connect" tone="connect" title="Morning to Night" ko="아침의 기록이 저녁으로 넘어간다" art={<span className="x-arc" />} />
      <Sub label="13시간 뒤 · 기록이 출발점이 되는 저녁">아침에 쓴 제품, 보정한 부위, 쿠션 유지 시간이 저녁 피부 확인의 출발점이 됩니다. 기록을 눌러 저녁 화면에 어떻게 반영되는지 확인해 보세요.</Sub>
      <section className="x-band x-band--connect">
        <ConnectDemo />
      </section>

      <Cover
        id="night"
        n="3"
        en="Night"
        tone="night"
        title="Check & Care"
        ko="부위별로 재고, 겹친 원으로 읽는다"
        art={
          <span className="x-rings">
            <i />
            <i />
            <i />
          </span>
        }
      />
      <Sub label="21:40 · 숫자보다 먼저 읽히는 피부">원의 크기는 범위를, 겹침은 진행 정도를, 색은 고민의 종류를 뜻합니다. 고민 부위를 누르면 오늘의 목표와 관리 코스로 이어집니다.</Sub>
      <section className="x-band x-band--night">
        <FlowDemo steps={NIGHT_STEPS} label="저녁 피부 스캔 흐름" variant="cinema" />
        <ul className="x-legend">
          <li>
            <span className="x-legend__dots" aria-hidden="true">
              <i />
              <i className="lg" />
            </span>
            <b>Size = Range</b>
            <span>넓을수록 커지는 원</span>
          </li>
          <li>
            <span className="x-legend__dots is-overlap" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <b>Overlap = Duration</b>
            <span>오래될수록 겹쳐 진해짐</span>
          </li>
          <li>
            <span className="x-legend__dots is-warm" aria-hidden="true">
              <i />
              <i className="blue" />
            </span>
            <b>Color = Concern</b>
            <span>파랑은 수분, 주황은 유분</span>
          </li>
        </ul>
      </section>

      <Cover
        id="tomorrow"
        n="4"
        en="Tomorrow"
        tone="tomorrow"
        title="Review & Routine"
        ko="쌓인 기록이 내일 아침을 바꾼다"
        art={
          <span className="x-bars">
            {[38, 46, 41, 55, 62, 70, 78].map((h, k) => (
              <i key={k} style={{ height: `${h}%` }} />
            ))}
          </span>
        }
      />
      <Sub label="Review · 쌓이면 보이는 변화">기록이 쌓이면 피부가 실제로 어떻게 바뀌었는지 숫자로 보입니다. 영역을 눌러 확대해 보세요.</Sub>
      <section className="x-band x-band--tomorrow">
        <ZoomView src="change.png" alt="변화 화면 · 피부 지수 7주 추이와 피부 나이" regions={CHANGE_REGIONS} />
      </section>
      <Sub label="Routine · 결과가 내일의 루틴으로">변화 결과는 AI 제안이 되어 내일 아침 루틴에 반영됩니다. ‘추가’와 ‘저장’을 차례로 눌러 보세요.</Sub>
      <section className="x-band x-band--tomorrow">
        <FlowDemo steps={ROUTINE_STEPS} label="루틴 조정 흐름" variant="cinema" />
      </section>

      {/* 08 MIRROR × MOBILE ---------------------------------------- */}
      <Chapter id="sync" title="거울은 안내하고, 폰은 이어 받는다" lead="화장품을 든 손으로는 거울을 만지기 어렵습니다. 거울은 얼굴 앞에서 안내와 측정을, 폰은 루틴 선택·리모컨·기록 수신을 맡습니다. 오른쪽 폰 화면을 직접 눌러 보세요.">
        <div className="x-sync">
          <SyncDemo />
          <p className="note-req">추가 자료 필요 · 거울과 앱의 첫 연결(페어링), 연결이 끊겼을 때의 화면은 기획서·UI에 없어 다루지 않았습니다.</p>
        </div>
      </Chapter>

      {/* 09 UI GUIDELINE ------------------------------------------- */}
      <Chapter
        id="guide"
        tone="grey"
        title="얼굴을 가리지 않는 정보"
        lead="세 가지 주요 피드백을 반영해 미러 디스플레이의 원칙을 세웠습니다. 거울 위에는 꼭 필요한 한 줄만 남기고, 나머지는 얼굴 밖 패널로 옮겼습니다."
      >
        <ul className="x-principles">
          {PRINCIPLES.map(([en, ko, d], k) => (
            <Reveal as="li" key={en} delay={k * 80}>
              <span>0{k + 1}</span>
              <b>{en}</b>
              <i>{ko}</i>
              <p>{d}</p>
            </Reveal>
          ))}
        </ul>

        <Sub label="Type Scale & Navigation">다섯 단계의 글자 크기와, 오른쪽 세로 레일에 고정한 다섯 개의 메뉴.</Sub>
        <div className="x-type">
          <ul className="x-type__scale">
            {TYPE.map(([size, w, use, sample]) => (
              <Reveal as="li" key={size}>
                <span className="x-type__meta">
                  {size}px / {w}
                  <i>{use}</i>
                </span>
                <span className="x-type__sample" style={{ fontSize: `clamp(${Math.max(14, size * 0.6)}px, ${size / 13}vw, ${size * 1.3}px)`, fontWeight: +w }}>
                  {sample}
                </span>
              </Reveal>
            ))}
          </ul>
          <ul className="x-menu">
            {MENU.map(([icon, en, ko]) => (
              <li key={en}>
                <span className="x-menu__icon">
                  <Icon name={icon} size={22} />
                </span>
                <b>{en}</b>
                <span>{ko}</span>
              </li>
            ))}
          </ul>
        </div>
      </Chapter>

      {/* 10 SCREENS ------------------------------------------------- */}
      <section className="x-screens" id="screens" data-chapter="10  Screens">
        <Reveal className="x-screens__head">
          <p className="x-ch__no">
            <span>10</span>Screens
          </p>
          <p className="x-screens__title">Mirror 8 · App 8</p>
          <p className="x-screens__ko">하루의 순서대로. 앱 화면은 실제로 눌러 볼 수 있습니다.</p>
        </Reveal>
        <div className="strip" tabIndex={0} aria-label="미러 화면 목록 · 가로 스크롤">
          {MIRROR_STRIP.map(([src, label]) => (
            <figure key={src} className="strip__item">
              <MirrorShot src={src} alt={label} />
              <figcaption>{label}</figcaption>
            </figure>
          ))}
        </div>
        <div className="strip strip--phones" tabIndex={0} aria-label="앱 화면 목록 · 가로 스크롤">
          {PHONE_STRIP.map(([path, label]) => (
            <figure key={path} className="strip__phone">
              <LiveScreen path={path} w={390} h={844} className="strip__phone-live" label={label} />
              <figcaption>{label}</figcaption>
            </figure>
          ))}
        </div>
        <a className="x-screens__cta" href="#/screens">
          Full Prototype · 22 screens <Icon name="arrowUpRight" size={18} />
        </a>
      </section>

      {/* CLOSING ---------------------------------------------------- */}
      <section className="x-end">
        <div className="x-hero__sky x-hero__sky--dusk" aria-hidden="true" />
        <Reveal className="x-end__in">
          <p className="x-end__title">See You Tomorrow Morning.</p>
          <p className="x-hero__ko">매일 이어지는 거울, Trac:ing</p>
        </Reveal>
      </section>

      <section className="x-film">
        <Placeholder ratio="21 / 9" title="Usage Film · 실제 사용 장면" spec="21:9 · 출근 전 탁상 미러 앞 화장 → 밤 피부 확인 (10~15초 영상 또는 사진)" />
      </section>

      <footer className="x-credit">
        <p className="x-credit__logo">
          Trac<span>:</span>ing
        </p>
        <dl className="x-credit__grid">
          <div>
            <dt>Project</dt>
            <dd>Trac:ing — Desk Beauty Mirror &amp; App</dd>
          </div>
          <div>
            <dt>Course</dt>
            <dd>Interaction Design, 2026</dd>
          </div>
          <div>
            <dt>Designer</dt>
            <dd>22565053 조윤정</dd>
          </div>
          <div>
            <dt>Professor</dt>
            <dd>김승언 교수님</dd>
          </div>
          <div>
            <dt>Scope</dt>
            <dd>Research · BX · UX · UI · Prototype</dd>
          </div>
          <div>
            <dt>Date</dt>
            <dd>2026.11.17</dd>
          </div>
        </dl>
        <a className="x-credit__top" href="#top">
          Back to top ↑
        </a>
      </footer>
    </div>
  );
}
