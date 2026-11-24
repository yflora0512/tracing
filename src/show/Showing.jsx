import { useEffect, useId, useState } from 'react';
import Icon from '../components/Icon.jsx';
import Annotated from './Annotated.jsx';
import FlowDemo from './FlowDemo.jsx';
import VideoSlot from './VideoSlot.jsx';
import LiveScreen from './LiveScreen.jsx';
import SyncDemo from './SyncDemo.jsx';
import ZoomView from './ZoomView.jsx';
import { MirrorShot, Reveal, asset } from './parts.jsx';
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
  { hex: '#3E8EDE', name: 'Trace Blue', role: '01 Primary', use: '선택 · 알림 · 오늘의 데이터', size: 'xl' },
  { hex: '#222222', name: 'Ink', role: '02 Primary', use: '본문 · 큰 수치', size: 'lg' },
  { hex: '#F4F4F4', name: 'Surface', role: '03 System', use: '카드 · 트랙', size: 'sm' },
  { hex: '#8A8A8A', name: 'Ink 3', role: '04 System', use: '보조 라벨', size: 'sm' },
  { hex: '#E4F0FB', name: 'Accent Soft', role: '05 Point', use: '선택 배경', size: 'sm' },
];

const LOOP = [
  { n: '01', en: 'Fit Time', ko: '시간 맞춤', t: 'day' },
  { n: '02', en: 'Follow', ko: '화장 안내', t: 'day' },
  { n: '03', en: 'Connect', ko: '기록 연결', t: 'day' },
  { n: '04', en: 'Check', ko: '피부 확인', t: 'night' },
  { n: '05', en: 'Care', ko: '맞춤 관리', t: 'night' },
  { n: '06', en: 'Review', ko: '변화 확인', t: 'next' },
];

/* screen anatomy pins — positions measured on the exported final frames (percent of image) */
const HOME_PINS = [
  { l: 79, t: 3, w: 10.5, h: 9, k: 'Status', title: '날짜 · 날씨 · 시각', d: '11월 5일(목) 12°C · 08:10. 시계를 따로 보지 않도록 거울 오른쪽 위에 고정합니다.' },
  { l: 63, t: 13.8, w: 26.5, h: 6.6, k: 'Alert', title: '한 줄 알림', d: '“3일째 볼 수분이 줄고 있어요.” 어제까지의 기록에서 이어진 변화를 한 줄로 먼저 알려 줍니다.' },
  { l: 63, t: 22.2, w: 26.5, h: 28, k: 'Focus', title: '오늘의 포커스', d: '“볼이 계속 건조해요”와 7일 수분 그래프(오늘 42). 오늘 가장 신경 쓸 한 가지만 크게 보여 줍니다.' },
  { l: 15, t: 35, w: 32, h: 22, k: 'Mirror Map', title: '얼굴 위 부위 라벨', d: '거울에 비친 얼굴 옆에 볼 · 건조(3일 연속), T존 · 보통, 트러블 · 없음을 표시합니다. 부위를 누르면 상세로 이동합니다.' },
  { l: 63, t: 52.5, w: 26.5, h: 43, k: 'Metric', title: '관심 지표', d: '수분 · 유분 · 트러블 탭. “낮음 ▼ 3일 연속”, 오늘 수분 32 / 주간 평균 57을 막대로 비교합니다.' },
  { l: 91, t: 14, w: 6.6, h: 82, k: 'Navigation', title: '세로 메뉴 레일', d: '홈 · 메이크업 · 관리 · 변화 · 루틴과 설정. 오른쪽 끝에 세로로 고정해 얼굴을 가리지 않습니다.' },
];

const MAKEUP_PINS = [
  { l: 17.2, t: 20.8, w: 32.5, h: 6.6, k: 'Action', title: '지금 할 행동 한 줄', d: '“광대 위쪽에 가볍게 두드려요.” 얼굴 위에는 이 한 줄만 두고, 강조어(가볍게)만 파란색으로 표시합니다.' },
  { l: 17.2, t: 27.6, w: 32.5, h: 3.8, k: 'Progress', title: '단계 진행 · 남은 시간', d: '블러셔 3/4 · 4분 남음. 출근 시각 기준 타이머로, 단계별 남은 시간을 바 하나로 보여 줍니다.' },
  { l: 63, t: 14, w: 26.5, h: 14.5, k: 'Product', title: '지금 쓸 제품', d: '에스쁘아 블러 웨어 블러셔 · 크림 · 촉촉한 마무리 · 건조 피부 OK. 피부 기록과 맞는지까지 함께 알려 줍니다.' },
  { l: 63, t: 30.5, w: 26.5, h: 57, k: 'Guide Video', title: '가이드 영상 패널', d: '단계별 시범 영상은 얼굴 밖 패널에서 재생합니다. (영상 자리 — 아래 Video 02 참고)' },
  { l: 55.4, t: 85.2, w: 4.4, h: 7.8, k: 'Voice', title: '음성 안내 · 명령', d: '화장 종료 5분·10분 전 음성으로 알리고, 손이 바쁠 때는 음성으로 다음 단계로 넘깁니다.' },
  { l: 63, t: 89, w: 26.5, h: 6.8, k: 'Control', title: '이전 / 다음', d: '단계 이동 버튼. 같은 조작을 폰 리모컨(08 Mirror × Mobile)에서도 할 수 있습니다.' },
];

const SCAN_PINS = [
  { l: 22, t: 36, w: 22, h: 31, k: 'Layered Circles', title: '겹친 원 · 부위별 상태', d: '볼 · 건조 3단계(양쪽 볼 · 넓음), T존 · 보통, 턱 · 양호. 원이 클수록 범위가 넓고, 많이 겹칠수록 오래 진행된 상태입니다.' },
  { l: 4.5, t: 88, w: 18, h: 5.4, k: 'Legend', title: '화면 안 범례', d: '“원 크기 = 범위 · 겹칠수록 진행”을 화면 안에 항상 표시해 설명 없이 읽을 수 있게 했습니다.' },
  { l: 63, t: 14, w: 26.5, h: 22.5, k: 'Summary', title: '오늘 피부 요약', d: '21:52 스캔 · 종합 72 ▲4. “볼이 건조해요”와 수분 42(어제보다 ▼8) · 유분 58 · 피부결 71.' },
  { l: 63, t: 39.6, w: 26.5, h: 11, k: 'Connect', title: '아침 기록과 연결', d: '“세미 매트 쿠션 13시간 유지.” 아침 기록을 건조의 원인 후보로 연결해 보여 줍니다.' },
  { l: 63, t: 52.2, w: 26.5, h: 36, k: 'Care', title: '추천 관리 순서', d: '화장품 / 디바이스 함께 중 선택. 클렌징 → 토너 → 수분 앰플 → 수분 크림, 4단계 6분.' },
  { l: 63, t: 89, w: 26.5, h: 6.8, k: 'Action', title: '기록만 저장 / 관리 시작', d: '바로 관리를 시작하거나, 기록만 남기고 다음 날 변화 확인으로 넘길 수 있습니다.' },
];

const MORNING_STEPS = [
  {
    phase: '사용 전',
    title: '거울이 먼저 켜진다',
    keys: ['#어제 기록', '#오늘의 포커스'],
    img: 'home.png',
    desc: '08:10, 거울 앞에 서면 어제 저녁 기록으로 “볼이 계속 건조해요”를 먼저 알려 줍니다. 오른쪽 메뉴의 메이크업 탭을 눌러 보세요.',
    hotspot: { l: 91.6, t: 24.2, w: 5.8, h: 7.6, label: '메이크업 탭', tip: 'left' },
  },
  {
    phase: '조작 → 화면 변화',
    title: '지금 할 행동 한 줄',
    keys: ['#행동 한 줄','#진행 바','#얼굴 밖 패널'],
    img: 'makeup.png',
    desc: '얼굴 위에는 “광대 위쪽에 가볍게 두드려요” 한 줄과 진행 바만 둡니다. 제품과 가이드 영상은 얼굴 밖 패널로 옮겼습니다.',
    hotspot: { l: 72.3, t: 89.2, w: 17.1, h: 6.4, label: '다음 단계', tip: 'top' },
  },
  {
    phase: '사용 결과',
    title: '보정 부위까지 기록',
    keys: ['#결과 체크','#보정 부위','#자동 기록'],
    live: { path: '/mirror/makeup/done', w: 1440, h: 817 },
    desc: '18분 / 예상 20분. 블러셔 오른쪽 1곳은 “1cm 아래로” 보정을 권합니다. ‘거울 / 결과 체크’를 직접 눌러 보세요.',
  },
];

const NIGHT_STEPS = [
  {
    phase: '사용 전',
    title: '오늘 볼 것부터',
    keys: ['#아침 기록 연결','#스캔 준비'],
    img: 'scan-ready.png',
    desc: '21:40, 아침 기록을 이어 받아 “볼이 3일째 건조해요”를 먼저 보여 줍니다. 얼굴을 틀에 맞추면 스캔을 준비합니다.',
    hotspot: { l: 63.1, t: 88.2, w: 26.3, h: 7.4, label: '스캔 시작', tip: 'top' },
  },
  {
    phase: '화면 변화',
    title: '부위별 순서 측정',
    keys: ['#부위별 측정','#자동 진행'],
    img: 'scan-progress.png',
    auto: 3200,
    desc: '볼 → T존 → 턱 → 얼굴 전체 순서로 측정합니다. 끝나면 자동으로 결과로 넘어갑니다.',
  },
  {
    phase: '결과 읽기',
    title: '겹친 원으로 읽기',
    keys: ['#겹친 원','#범위 · 진행'],
    img: 'scan-result.png',
    desc: '원이 클수록 범위가 넓고, 많이 겹칠수록 오래 진행된 상태입니다. 볼 영역을 눌러 보세요.',
    hotspot: { l: 16, t: 46.5, w: 13.5, h: 12, label: '볼 영역', tip: 'top' },
  },
  {
    phase: '사용 결과',
    title: '오늘의 관리 코스',
    keys: ['#목표 수치','#6분 관리 코스'],
    img: 'scan-detail.png',
    desc: '오늘 목표는 수분 60(지금 42). 수분 앰플(볼에 2방울)부터 6분 관리 코스로 바로 이어집니다.',
  },
];

const ROUTINE_STEPS = [
  {
    phase: '사용 전',
    title: 'AI가 제안한다',
    keys: ['#AI 제안','#변경값 미리 보기'],
    img: 'routine.png',
    desc: '쌓인 기록으로 “기초에 수분 앰플 1분을 더할까요?”를 제안하고, 바뀌는 값(시작 07:50→07:49)을 미리 보여 줍니다.',
    hotspot: { l: 64.9, t: 72.8, w: 11, h: 5.4, label: '추가', tip: 'top' },
  },
  {
    phase: '조작 → 화면 변화',
    title: '내일 루틴에 반영',
    keys: ['#루틴 반영','#자동 조정'],
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
    keys: ['#하루의 순환'],
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

/** Cover: wordmark + the product itself. The mirror switches Morning ↔ Night (auto, or by tapping), and the whole cover follows. */
const HERO_MODES = [
  { key: 'day', time: '08:10', en: 'Morning', ko: '출근 전 · 메이크업 안내', img: 'home.png', alt: '아침 08:10 홈 화면 · 볼이 계속 건조해요' },
  { key: 'night', time: '21:40', en: 'Night', ko: '퇴근 후 · 피부 스캔', img: 'scan-ready.png', alt: '저녁 21:40 스캔 준비 화면 · 볼이 3일째 건조해요' },
];

function HeroCover() {
  const [m, setM] = useState(0);
  const mode = HERO_MODES[m];
  return (
    <section className={`x-hero is-${mode.key}`}>
      <div className="x-hero__sky" aria-hidden="true" />
      <div className="x-hero__sky x-hero__sky--night" aria-hidden="true" />
      <TraceFace spots={false} className="trace--hero" />
      <div className="x-hero__in">
        <p className="x-hero__kicker">Trac:ing — Desk Beauty Mirror &amp; App</p>
        <h1 className="x-hero__title">
          The Mirror That
          <br />
          Remembers Your Day
        </h1>
        <p className="x-hero__ko">하루를 이어서 기억하는 거울</p>
        <div className="x-hero__modes" role="tablist" aria-label="아침 / 저녁">
          {HERO_MODES.map((x, k) => (
            <button key={x.key} type="button" role="tab" aria-selected={k === m} className={k === m ? 'is-on' : ''} onClick={() => setM(k)}>
              <b>{x.time}</b> {x.en}
            </button>
          ))}
        </div>
      </div>
      <p className="x-hero__foot">
        <span>We trace your morning, care for your night, and carry it into tomorrow.</span>
        <span>Interaction Design 2026 · 22565053 조윤정 · 김승언 교수님</span>
      </p>
    </section>
  );
}

/** Full-bleed product shot (UNIX “video-wrap” slot): the mirror on a desk, Morning ↔ Night by tapping. */
function ProductShot() {
  const [m, setM] = useState(0);
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!auto || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const t = setInterval(() => setM((x) => 1 - x), 4200);
    return () => clearInterval(t);
  }, [auto]);
  const mode = HERO_MODES[m];
  return (
    <section className={`x-shot is-${mode.key}`}>
      <Reveal className="x-shot__in">
        <div className="desk">
          <div className="desk__mirror">
            <div className="desk__screen">
              {HERO_MODES.map((x, k) => (
                <img key={x.key} src={asset(x.img)} alt={k === m ? x.alt : ''} className={k === m ? 'is-on' : ''} loading="lazy" decoding="async" />
              ))}
            </div>
          </div>
          <span className="desk__neck" aria-hidden="true" />
          <span className="desk__base" aria-hidden="true" />
        </div>
      </Reveal>
      <div className="x-shot__modes" role="tablist" aria-label="아침 / 저녁 화면 전환">
        {HERO_MODES.map((x, k) => (
          <button
            key={x.key}
            type="button"
            role="tab"
            aria-selected={k === m}
            className={k === m ? 'is-on' : ''}
            onClick={() => {
              setAuto(false);
              setM(k);
            }}
          >
            <b>{x.time}</b>
            <span>
              {x.en} · {x.ko}
            </span>
            {k === m && auto && <i className="x-cov__timer" aria-hidden="true" />}
          </button>
        ))}
      </div>
    </section>
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

      {/* COVER -------------------------------------------------- */}
      <HeroCover />

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

      <ProductShot />

      <Sub label="Screen Anatomy · HOME">아침 08:10의 홈 화면입니다. 번호를 누르거나 목록 위에 올리면 해당 영역이 강조됩니다.</Sub>
      <section className="x-band x-band--plain">
        <Annotated src="home.png" alt="미러 홈 화면" label="홈 화면 구성" pins={HOME_PINS} />
      </section>
      <Sub label="Concept Film">서비스 전체를 30초 안에 보여 주는 영상이 들어갈 자리입니다.</Sub>
      <div className="x-wrap">
        <VideoSlot
          no="01"
          title="Concept Film — 하루를 이어서 기억하는 거울"
          len="30초"
          purpose="쇼잉 도입부에서 ‘아침 기록 → 저녁 관리 → 다음 날 루틴’의 순환을 한 번에 보여 줍니다."
          shots={['08:10 거울 앞에 서면 홈 화면이 켜짐', '행동 한 줄을 따라 메이크업, 5분 전 음성 알림', '21:40 세안 후 스캔, 겹친 원 결과', '다음 날 아침 바뀐 루틴(07:49 시작)으로 시작']}
        />
      </div>

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
            <span className="x-num">01</span>
            <p>
              Trac<span>:</span>ing
            </p>
            <i>Wordmark</i>
          </Reveal>
          <Reveal className="x-id__motif" delay={80}>
            <span className="x-num">02</span>
            <TraceFace className="trace--motif" />
            <i>Motif 01 · Dotted Trace — 위치 안내</i>
          </Reveal>
          <Reveal className="x-id__motif x-id__motif--rings" delay={160}>
            <span className="x-num">03</span>
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
              <span className="x-color__role">{c.role}</span>
              <span className="x-color__chip" style={{ background: c.hex }} />
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
      <Sub label="Screen Anatomy · Make Up">메이크업 진행 화면은 핵심 정보 3가지(행동 · 위치 · 제품)만 얼굴 가까이에 둡니다.</Sub>
      <section className="x-band x-band--plain">
        <Annotated src="makeup.png" alt="메이크업 진행 화면" label="메이크업 화면 구성" pins={MAKEUP_PINS} />
      </section>
      <div className="x-wrap x-wrap--gap">
        <VideoSlot
          no="02"
          title="Morning — 시간에 맞춘 메이크업 안내"
          len="15초"
          purpose="실제 사용자가 거울의 안내를 따라 화장하는 장면으로 Fit Time · Follow를 보여 줍니다."
          note="UI 안의 ‘가이드 영상’ 패널에 들어갈 단계별 시범 클립(세로형 약 4:5)도 함께 필요합니다."
          shots={['출근 준비 중 거울 앞에 앉음 · 08:10 홈 화면', '“광대 위쪽에 가볍게 두드려요” 한 줄을 보며 블러셔', '“화장 종료 5분 전이에요” 음성 알림', '결과 체크 화면 · 보정 부위 1곳 표시']}
        />
      </div>

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
            <span>고민 종류마다 다른 색 (화면 기준)</span>
          </li>
        </ul>
      </section>

      <Sub label="Screen Anatomy · Scan Result">결과 화면은 왼쪽에 겹친 원(얼굴 위), 오른쪽에 수치와 관리 순서(얼굴 밖)로 나눴습니다.</Sub>
      <section className="x-band x-band--plain">
        <Annotated src="scan-result.png" alt="피부 스캔 결과 화면" label="스캔 결과 화면 구성" pins={SCAN_PINS} />
      </section>
      <div className="x-wrap x-wrap--gap">
        <VideoSlot
          no="03"
          title="Night — 세안 후 부위별 피부 스캔"
          len="15초"
          purpose="퇴근 후 세안한 사용자가 스캔을 받고, 겹친 원으로 결과를 읽는 장면으로 Check · Care를 보여 줍니다."
          shots={['21:40 세안 후 거울 앞 · 얼굴을 틀에 맞춤', '볼 → T존 → 턱 순서로 측정되는 화면', '겹친 원 결과에서 볼 영역을 터치', '수분 앰플부터 6분 관리 코스 시작']}
        />
      </div>

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
          <VideoSlot
            no="04"
            title="Mirror × Mobile — 폰으로 이어 받는 거울"
            len="10초"
            purpose="손에 화장품을 든 상태에서 폰으로 거울을 조작하는 장면으로 두 기기의 역할 분담을 보여 줍니다."
            shots={['폰에서 아침 루틴을 고르고 ‘거울로 보내기’', '거울에 안내가 시작되고 폰은 리모컨으로 전환', '폰에서 ‘다음’ · ‘+1분’ 조작', '완료 기록이 폰에 도착']}
          />
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
        <VideoSlot
          no="05"
          title="Usage Film — 실제 사용 장면"
          len="30~45초"
          ratio="21 / 9"
          ratioLabel="21:9"
          purpose="쇼잉 마무리. 실제 공간(욕실 · 화장대)의 탁상 미러와 함께 하루 전체의 사용 장면을 보여 줍니다."
          shots={['아침: 탁상 위 미러, 출근 준비', '낮: 폰으로 기록 확인', '밤: 세안 후 스캔과 관리', '다음 날 아침: 같은 자리, 바뀐 루틴']}
        />
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
