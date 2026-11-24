import { useEffect, useState } from 'react';
import Icon from '../components/Icon.jsx';
import FlowDemo from './FlowDemo.jsx';
import LiveScreen from './LiveScreen.jsx';
import SyncDemo from './SyncDemo.jsx';
import ZoomView from './ZoomView.jsx';
import { MirrorShot, Placeholder, Reveal, SectionHead, asset } from './parts.jsx';
import './show.css';

const NAV = [
  ['problem', '문제'],
  ['research', '리서치'],
  ['concept', '컨셉'],
  ['morning', '아침'],
  ['connect', '연결'],
  ['night', '저녁'],
  ['tomorrow', '내일'],
  ['sync', '연동'],
  ['system', '디자인'],
];

/* ---------------- content (기획서 · 실제 UI 근거) ---------------- */

const QUESTIONS = ['바쁜 출근 시간에 화장을 잘 할 수 있을까요?', '내 피부에 맞는 관리를 하고 있을까요?', '매일의 관리로 바라던 피부에 가까워졌을까요?'];

const RESEARCH = [
  {
    tag: 'DAY',
    title: '바쁜 출근 시간, 시간에 맞춘 화장이 필요하다',
    stats: [
      ['67.1%', '30·40대 직장인 여성의 출근 준비 시간 부족 경험', '통계청, 《생활 시간 조사》 (2025.07.28)'],
      ['32분', '출근 시 평균 화장 시간', '여성조선, 《출근 때 평균 화장 시간》 (2014.03.12)'],
      ['밀림·양 조절', '기초·색조 메이크업 단계 중 실제 어려움', '오픈서베이, 《뷰티 트렌드 리포트》 (2025)'],
    ],
    pairs: [
      ['출근 준비 중 화장에 일정 시간 이상 소요됨', '내 준비 시간에 맞춘 타이머로 단계별 메이크업을 안내'],
      ['청장년 직장인 여성 다수가 출근 준비 시간 부족 경험', '화장 종료 5분·10분 전 음성 안내로 시간적 여유 확보'],
      ['적정량과 위치 파악이 어려워 시간이 지연됨', '음성 안내와 원형 스팟으로 도포량과 위치를 한눈에 안내'],
    ],
  },
  {
    tag: 'NIGHT',
    title: '하루 끝 피부 관리, 내게 맞는지 확인이 필요하다',
    stats: [
      ['+35.2%', '기능성 화장품 생산액 전년 대비 증가율', '식약처, 《24년 화장품 생산·수출액 사상 최대》 (2025.05.27)'],
      ['57.2%', '맞춤형 화장품 구매 의사', '식약처, 《맞춤형 화장품 세계 시장 동향 조사》 (2022.02.25)'],
      ['모공·건조·주름', '30·40대 연령별 주요 피부 고민', '오픈서베이, 《뷰티 트렌드 리포트 2024》 (2024.01.22)'],
    ],
    pairs: [
      ['기능성 화장품 증가에 따른 체계적 관리 니즈 확대', '전날 사용한 제품과 피부 데이터로 제품과 케어를 매칭'],
      ['맞춤형 화장품 선호 및 개인 맞춤 케어 니즈 증가', '제품별 사용 경험과 피부 고민에 맞춘 관리 제안'],
      ['연령대에 따라 세분화된 피부 고민', '고민의 종류와 정도를 색과 중첩으로 구분해 시각화'],
    ],
  },
];

const PERSONAS = [
  {
    tag: 'PERSONA 01 · DAY / TIME FIRST',
    name: '한지우',
    meta: '34세 · 외국계 패션 디자이너',
    quote: '시계를 계속 보지 않아도 출근 시간 늦지 않게 화장을 잘 하고 싶어요',
    pains: ['건조한 부위가 밀리고 들떠서 화장 수정 시간이 길어진다', '시간을 확인하면서 영상과 거울을 번갈아 보기가 번거롭다'],
    needs: ['출발 시각과 자신의 속도·피부에 맞춘 단계별 안내', '거울을 보면서 바로 따라 할 수 있는 위치·양 안내'],
  },
  {
    tag: 'PERSONA 02 · NIGHT / CARE FIRST',
    name: '윤서진',
    meta: '45세 · 금융 애널리스트',
    quote: '퇴근 후 매일 밤 관리하고 있지만, 내 피부에 맞고 건강해지는지 궁금해요',
    pains: ['복잡한 제품 사용 속에서 내 피부가 언제 편안했는지 모른다', '피부 고민이 부위마다 달라 출근 화장부터 관리까지 어렵다'],
    needs: ['사용한 제품과 피부 변화를 간편하게 연결해 기록', '출근부터 퇴근까지 하루의 피부 관리가 이어지는 경험'],
  },
];

const KEYWORDS = [
  ['Clear', '명료한', '한눈에 알기 쉽게'],
  ['Guided', '안내하는', '따라 하기 쉽게'],
  ['Adaptive', '맞추는', '상황과 피부에 맞게'],
  ['Layered', '중첩되는', '겹쳐 쌓이는 정보와 수치'],
];

const LOOP = [
  { n: '01', en: 'Fit Time', ko: '시간 맞춤', d: '출근 상황과 내 피부에 맞게 화장 단계를 구성·조정', to: 'morning', t: 'DAY' },
  { n: '02', en: 'Follow', ko: '화장 안내', d: 'AI 음성과 화장 위치 점선 트레이싱 가이드로 안내', to: 'morning', t: 'DAY' },
  { n: '03', en: 'Connect', ko: '기록 연결', d: '제품·수정 부위·피부 상태를 남겨 저녁 관리로 연결', to: 'connect', t: 'DAY' },
  { n: '04', en: 'Check', ko: '피부 확인', d: '세안 후 고민 부위와 컨디션을 고려해 정밀 확인', to: 'night', t: 'NIGHT' },
  { n: '05', en: 'Care', ko: '맞춤 관리', d: '하루 데이터와 피부 상태에 맞춰 관리 순서 안내', to: 'night', t: 'NIGHT' },
  { n: '06', en: 'Review', ko: '변화 확인', d: '고민별 수치와 개선도를 기반으로 내일 루틴 제안', to: 'tomorrow', t: 'NEXT' },
];

const CHAPTERS = [
  { id: 'morning', n: '001', en: 'Morning', ko: '아침 · 시간 맞춤과 안내', steps: '01 Fit Time · 02 Follow', tags: ['#시간 맞춤', '#메이크업 가이드', '#보정 기록'] },
  { id: 'connect', n: '002', en: 'Connect', ko: '연결 · 아침에서 저녁으로', steps: '03 Connect', tags: ['#사용 제품', '#보정 부위', '#유지 시간'] },
  { id: 'night', n: '003', en: 'Night', ko: '저녁 · 확인과 맞춤 관리', steps: '04 Check · 05 Care', tags: ['#부위별 스캔', '#겹친 원', '#관리 코스'] },
  { id: 'tomorrow', n: '004', en: 'Tomorrow', ko: '내일 · 변화와 루틴 반영', steps: '06 Review · Routine', tags: ['#변화 추이', '#AI 제안', '#루프'] },
];

const MORNING_STEPS = [
  {
    phase: '사용 전',
    title: '거울이 먼저 켜진다',
    img: 'home.png',
    desc: '08:10, 거울 앞에 서면 어제 저녁 기록을 바탕으로 “볼이 계속 건조해요”를 먼저 알려 줍니다. 오늘 피부 상태를 확인한 뒤 메이크업 탭으로 이동합니다.',
    hotspot: { l: 91.6, t: 24.2, w: 5.8, h: 7.6, label: '메이크업 탭', tip: 'left' },
  },
  {
    phase: '조작 → 화면 변화',
    title: '지금 할 행동 한 줄',
    img: 'makeup.png',
    desc: '얼굴 위에는 “광대 위쪽에 가볍게 두드려요” 한 줄과 진행 바(블러셔 3/4 · 4분 남음)만 둡니다. 사용할 제품과 가이드 영상은 얼굴 밖 패널로 옮겨 거울을 가리지 않습니다.',
    hotspot: { l: 72.3, t: 89.2, w: 17.1, h: 6.4, label: '다음 단계', tip: 'top' },
  },
  {
    phase: '사용 결과',
    title: '보정 부위까지 기록',
    live: { path: '/mirror/makeup/done', w: 1440, h: 817 },
    desc: '18분 / 예상 20분. 4단계 중 3단계는 좋고, 블러셔 오른쪽 1곳은 “1cm 아래로” 보정을 권합니다. 화면의 ‘거울 / 결과 체크’를 직접 눌러 보세요. 사용한 제품은 피부 기록에 자동 저장됩니다.',
  },
];

const NIGHT_STEPS = [
  {
    phase: '사용 전',
    title: '오늘 볼 것부터',
    img: 'scan-ready.png',
    desc: '21:40, 아침 기록을 이어 받아 “볼이 3일째 건조해요”를 먼저 보여 줍니다. 얼굴을 틀 안에 맞추면 조명·거리를 확인하고 스캔을 준비합니다.',
    hotspot: { l: 63.1, t: 88.2, w: 26.3, h: 7.4, label: '스캔 시작', tip: 'top' },
  },
  {
    phase: '화면 변화',
    title: '부위별 순서 측정',
    img: 'scan-progress.png',
    auto: 3200,
    desc: '볼 → T존 → 턱 → 얼굴 전체 순서로 측정합니다. 지금 재는 부위가 거울 위에 바로 표시되고, 오른쪽 목록에서 진행 상태(2/4)를 확인합니다. 측정이 끝나면 자동으로 결과로 넘어갑니다.',
  },
  {
    phase: '결과 읽기',
    title: '겹친 원으로 읽기',
    img: 'scan-result.png',
    desc: '원이 클수록 고민 범위가 넓고, 많이 겹칠수록 오래 진행된 상태입니다. 수분 42 · 유분 58 · 피부결 71, 아침의 “세미 매트 쿠션 13시간 유지” 기록이 건조의 이유로 연결됩니다.',
    hotspot: { l: 16, t: 46.5, w: 13.5, h: 12, label: '볼 영역', tip: 'top' },
  },
  {
    phase: '사용 결과',
    title: '오늘의 관리 코스',
    img: 'scan-detail.png',
    desc: '오늘 목표는 수분 60(지금 42). 관리하면 2~3일 안에 회복된다고 알려 주고, 수분 앰플(볼에 2방울)부터 6분 관리 코스로 바로 이어집니다. 화장품만 또는 디바이스 포함을 고를 수 있습니다.',
  },
];

const ROUTINE_STEPS = [
  {
    phase: '사용 전',
    title: 'AI가 제안한다',
    img: 'routine.png',
    desc: '쌓인 기록을 바탕으로 “기초에 수분 앰플 1분을 더할까요?”를 제안합니다. 바뀌는 값(기초 3→4분 · 총 14→15분 · 시작 07:50→07:49)을 미리 보여 준 뒤 선택하게 합니다.',
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
    desc: '‘추가’를 누르면 내일 아침 루틴이 07:49 시작으로 바뀌고 보습 단계가 1분 늘어납니다. ‘피부 기록에 맞춰 자동 조정’을 켜 두면 건조한 날마다 같은 방식으로 조정됩니다.',
    hotspot: { l: 63.1, t: 89.4, w: 26.3, h: 6.2, label: '저장', tip: 'top' },
  },
  {
    phase: '사용 결과',
    title: '다음 날 첫 화면',
    img: 'home.png',
    desc: '오늘의 결과가 다음 날 첫 화면이 됩니다. 아침의 거울은 다시 어제 기록으로 오늘 피부를 알려 주며, 하루가 처음으로 이어집니다.',
  },
];

const CHANGE_REGIONS = [
  { key: 'all', label: '전체', x: 0, y: 0, w: 100, h: 100, title: '변화 · 쌓이면 보이는 변화', desc: '피부 지수 추이, 종합 점수, 한 줄 요약, 피부 나이를 한 화면에 모았습니다. 영역을 눌러 확대해 보세요.' },
  { key: 'trend', label: '7주 추이', x: 3, y: 15, w: 58, h: 57, title: '관리한 날부터 오르는 그래프', desc: '파란 칸은 관리를 이어 간 최근 4주(스캔 24회)입니다. 최저 31에서 최고 68까지, 최근 4주 변화는 +18%. 전체·이마·볼·턱으로 부위를 바꿔 볼 수 있습니다.' },
  { key: 'score', label: '점수 · 요약', x: 63, y: 14, w: 27, h: 31, title: '숫자 하나, 문장 하나', desc: '종합 피부 점수 72(지난 스캔 대비 ▲4)와 “수분이 4주째 오르고 있어요. 유분은 T존 위주로 높아요.” 한 줄 요약으로 결과를 읽기 쉽게 정리합니다.' },
  { key: 'age', label: '피부 나이', x: 63, y: 46, w: 27, h: 50, title: '피부 나이 27세', desc: '3월 대비 2세 낮아졌고, 지금 추세라면 12월까지의 예상치를 함께 보여 줍니다. 적정선 대비 위치를 그래프로 확인합니다.' },
  { key: 'parts', label: '항목별', x: 4, y: 79, w: 57, h: 15, title: '항목별 지수', desc: '수분 36% · 유분 64% · 모공 20% · 모공 40%를 원형 지표로 보여 줍니다. (Figma 원본에서 ‘모공’이 두 번 표기되어 마지막 항목명 확인이 필요합니다.)' },
];

const CONNECT_TILES = [
  { key: 'skin', icon: 'skin', big: '건조', label: '피부 상태', sub: '볼 · 3일째', row: 40.9, accent: true },
  { key: 'fix', icon: 'makeup', big: '볼', label: '보정 부위', sub: '블러셔 1회', row: 46.1 },
  { key: 'hold', icon: 'product', big: '13h', label: '쿠션 유지', sub: '세미 매트', row: 51.3 },
];

const FEEDBACK = [
  ['가독성 · 대비 확보', ['흰 글씨 대신 진한 회색 텍스트 #222222', '반투명 흰 글라스 카드로 배경과 분리', '얼굴 위 정보는 행동 한 줄만 노출', '어두운 스크림 대신 밝은 카드 방식']],
  ['정보 위계 개선', ['본문 17px 이상, 대표 수치 44px', '화면별 핵심 요소 1개로 집중', '진행: 지금 할 행동 / 홈: 시작할 루틴', '상세 내용은 패널·다음 화면으로 분리']],
  ['핵심 정보 3개로 축소', ['메이크업 진행 화면의 핵심 3가지', '지금 해야 할 행동 · 바를 부위 · 사용할 제품', '단계 목록·도구·다음 제품은 필요 시 노출']],
];

const COLORS = [
  ['#3E8EDE', 'Accent', '선택 · 알림 · 오늘 데이터'],
  ['#222222', 'Ink', '본문 · 큰 수치'],
  ['#666666', 'Ink 2', '카드 라벨'],
  ['#8A8A8A', 'Ink 3', '보조 라벨'],
  ['#F4F4F4', 'Surface 2', '카드 · 트랙'],
  ['#E4F0FB', 'Accent Soft', '선택 배경'],
];

const TYPE = [
  ['44', '300', '대표 수치', '72'],
  ['30', '500', '카드 헤드라인', '볼이 건조해요'],
  ['22', '500', '인사말 · 화면 제목', '좋은 아침이에요'],
  ['17', '400', '안내 문구 · 리스트', '광대 위쪽에 가볍게 두드려요'],
  ['13', '400', '보조 설명', '어제 저녁 기록 기준'],
];

const MENU = [
  ['home', '홈', 'DAY/NIGHT 바쁜 아침과 하루 끝에 필요한 핵심 정보'],
  ['makeup', '메이크업', '단계별 영상, AI 음성, 화장 위치 점선 트레이싱 가이드'],
  ['skin', '관리', 'DAY/NIGHT 피부 확인과 맞춤 관리 순서'],
  ['trend', '변화', '고민 부위·영역별 피부 데이터로 변화 확인'],
  ['gear', '설정', '제품·루틴 등 고민과 타입에 맞춘 서비스 설정'],
];

const MIRROR_STRIP = [
  ['home.png', 'HOME · 오늘 피부'],
  ['makeup.png', 'Make Up · 단계 안내'],
  ['scan-ready.png', 'Scan Ready · 스캔 준비'],
  ['scan-progress.png', 'Skin Scan · 부위별 측정'],
  ['scan-result.png', 'Scan Result · 겹친 원'],
  ['scan-detail.png', '부위 상세 · 관리 코스'],
  ['change.png', 'Change · 변화'],
  ['routine.png', '루틴 설정 · AI 제안'],
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

/* ---------------- page ---------------- */

function TopBar() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const on = () => {
      const h = document.documentElement;
      setP(h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight));
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <header className="topbar">
      <a href="#top" className="topbar__logo" aria-label="Trac:ing 처음으로">
        <img src={`${import.meta.env.BASE_URL}logo-tracing.png`} alt="Trac:ing" width="92" height="25" />
      </a>
      <nav className="topbar__nav" aria-label="섹션">
        {NAV.map(([id, label]) => (
          <a key={id} href={`#${id}`}>
            {label}
          </a>
        ))}
      </nav>
      <a className="topbar__cta" href="#/screens">
        프로토타입 <Icon name="arrowUpRight" size={16} />
      </a>
      <span className="topbar__progress" style={{ transform: `scaleX(${p})` }} aria-hidden="true" />
    </header>
  );
}

function ChapterHead({ c, title, message, children }) {
  return (
    <Reveal className="ch-head">
      <div className="ch-head__meta">
        <span className="ch-head__n">{c.n}</span>
        <span className="ch-head__en">{c.en}</span>
        <span className="ch-head__ko">{c.ko}</span>
        <span className="ch-head__steps">{c.steps}</span>
      </div>
      <h3 className="h-chapter">{title}</h3>
      <p className="ch-head__msg">{message}</p>
      {children}
    </Reveal>
  );
}

function ConnectDemo() {
  const [sel, setSel] = useState('skin');
  const t = CONNECT_TILES.find((x) => x.key === sel);
  return (
    <div className="connect">
      <Reveal className="connect__card">
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
        <p className="connect__hint">기록을 눌러 저녁 화면 어디에 반영되는지 확인해 보세요 →</p>
      </Reveal>
      <Reveal className="connect__screen" delay={120}>
        <div className="connect__frame">
          <MirrorShot src="scan-ready.png" alt="저녁 스캔 준비 화면 · 중요 피부 기록" />
          <span className="connect__hl" style={{ top: `${t.row - 2.6}%` }} aria-hidden="true" />
        </div>
        <p className="caption">21:40 · Scan Ready — 아침 기록이 ‘중요 피부 기록’ 목록으로 넘어옵니다.</p>
      </Reveal>
    </div>
  );
}

export default function Showing() {
  useEffect(() => {
    document.title = 'Trac:ing — 하루를 이어서 기억하는 거울';
    // deep links like …/#night: the section only exists after render, so scroll once it does
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id && !id.startsWith('/')) {
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'instant', block: 'start' }));
    }
  }, []);

  return (
    <div className="show" id="top">
      <TopBar />

      {/* 00 · HERO ------------------------------------------------ */}
      <section className="hero">
        <div className="wrap hero__top">
          <dl className="hero__meta">
            <div>
              <dt>Stu.</dt>
              <dd>22565053 조윤정</dd>
            </div>
            <div>
              <dt>Prof.</dt>
              <dd>김승언 교수님</dd>
            </div>
            <div>
              <dt>Date.</dt>
              <dd>2026.11.17</dd>
            </div>
          </dl>
          <span className="hero__course">Interaction Design</span>
        </div>
        <div className="wrap hero__title">
          <h1 className="wordmark">
            Trac<span className="wordmark__colon">:</span>ing
          </h1>
          <div className="hero__tag">
            <p className="hero__tagline">매일을 쉽고 나답게</p>
            <p className="hero__sub">아침 출근부터 밤 관리까지, 나를 위한 탁상용 뷰티 미러</p>
          </div>
        </div>
        <Reveal className="wrap hero__visual">
          <div className="hero__stage">
            <MirrorShot src="home.png" alt="Trac:ing 미러 홈 화면 · 08:10 볼이 계속 건조해요" eager />
          </div>
          <div className="hero__caption">
            <p className="hero__lead">
              아침 화장 기록이 저녁 피부 관리로, 저녁 결과가 다음 날 아침 루틴으로 이어집니다. <b>하루를 이어서 기억하는 거울</b>, Trac:ing입니다.
            </p>
            <a className="hero__scroll" href="#problem">
              스크롤해서 하루 따라가기 ↓
            </a>
          </div>
        </Reveal>
      </section>

      {/* 01 · PROBLEM -------------------------------------------- */}
      <section className="sec" id="problem">
        <div className="wrap">
          <SectionHead
            num="01"
            label="Overview"
            title={
              <>
                시간이 없는 아침,
                <br />
                기억나지 않는 저녁
              </>
            }
            lead="출근을 준비하는 아침엔 시간이 없고, 저녁엔 오늘 내 피부가 어땠는지 기억나지 않습니다. 화장과 관리가 서로 따로 놀기 때문입니다."
          />
          <ol className="questions">
            {QUESTIONS.map((q, k) => (
              <Reveal as="li" key={q} delay={k * 100}>
                <span className="questions__n">Q{k + 1}</span>
                <span className="questions__q">{q}</span>
                <span className="questions__t">{['아침 · 화장', '저녁 · 관리', '내일 · 변화'][k]}</span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* 02 · RESEARCH ------------------------------------------- */}
      <section className="sec sec--tint" id="research">
        <div className="wrap">
          <SectionHead
            num="02"
            label="Desk Research → Insight → Function"
            title="숫자가 가리킨 두 개의 순간"
            lead="출근 준비 시간의 부족과 밀림·양 조절의 어려움, 그리고 내게 맞는 관리에 대한 수요. 두 리서치에서 얻은 인사이트를 각각 기능으로 연결했습니다."
          />
          {RESEARCH.map((r) => (
            <div className="research" key={r.tag}>
              <Reveal className="research__head">
                <span className={`pill pill--${r.tag.toLowerCase()}`}>{r.tag}</span>
                <h3 className="h-sub">{r.title}</h3>
              </Reveal>
              <div className="stats">
                {r.stats.map(([v, l, src], k) => (
                  <Reveal className="stat" key={v} delay={k * 80}>
                    <b className="stat__v">{v}</b>
                    <span className="stat__l">{l}</span>
                    <span className="stat__src">{src}</span>
                  </Reveal>
                ))}
              </div>
              <ul className="pairs">
                {r.pairs.map(([ins, fn]) => (
                  <Reveal as="li" key={ins}>
                    <span className="pairs__k">Insight</span>
                    <span className="pairs__ins">{ins}</span>
                    <span className="pairs__arrow" aria-hidden="true">
                      →
                    </span>
                    <span className="pairs__k">Function</span>
                    <span className="pairs__fn">{fn}</span>
                  </Reveal>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 03 · PERSONA -------------------------------------------- */}
      <section className="sec" id="persona">
        <div className="wrap">
          <SectionHead
            num="03"
            label="Persona"
            title="아침의 지우, 밤의 서진"
            lead="출근 준비에 쫓기는 30대에게는 시간에 맞춘 음성 화장 가이드를, 퇴근 후 관리가 고민인 40대에게는 부위별 관리 안내와 변화 기록을 제공합니다."
          />
          <div className="personas">
            {PERSONAS.map((p, k) => (
              <Reveal className="persona" key={p.name} delay={k * 120}>
                <Placeholder ratio="1 / 1" title={`${p.name} 프로필 사진`} spec="1:1 · 정면 인물 사진 · 페르소나 카드용" className="persona__ph" />
                <div className="persona__body">
                  <span className="persona__tag">{p.tag}</span>
                  <h3 className="persona__name">
                    {p.name} <small>{p.meta}</small>
                  </h3>
                  <p className="persona__quote">“{p.quote}”</p>
                  <dl className="persona__dl">
                    <dt>Pain point</dt>
                    {p.pains.map((x) => (
                      <dd key={x}>{x}</dd>
                    ))}
                    <dt>Needs</dt>
                    {p.needs.map((x) => (
                      <dd key={x}>{x}</dd>
                    ))}
                  </dl>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal as="p" className="target">
            <b>TARGET</b> 바쁜 출근 전에는 시간에 맞춰 화장하고, 퇴근 후에는 피부 상태와 변화를 확인하며 자신에게 맞는 관리를 이어가고 싶은 30~40대 직장인 여성
          </Reveal>
        </div>
      </section>

      {/* 04 · CONCEPT -------------------------------------------- */}
      <section className="sec sec--paper" id="concept">
        <div className="wrap">
          <SectionHead
            num="04"
            label="Design Concept · Tracing Paper"
            title={
              <>
                필요한 곳을 짚어 주고,
                <br />
                하루를 겹쳐 쌓는다
              </>
            }
            lead="트레이싱지처럼 필요한 위치와 정보, 관리 방법을 그 자리에 짚어 주고, 상황에 맞춰 기록을 누적·중첩해 전달합니다. “내 상황에 맞게, 따라 하기 쉽게, 내 피부에 맞게.”"
          />
          <div className="layers" aria-hidden="true">
            <span className="layers__sheet layers__sheet--1">Morning record</span>
            <span className="layers__sheet layers__sheet--2">Night scan</span>
            <span className="layers__sheet layers__sheet--3">Tomorrow routine</span>
          </div>
          <div className="keywords">
            {KEYWORDS.map(([en, ko, d], k) => (
              <Reveal className="keyword" key={en} delay={k * 80}>
                <span className="keyword__en">{en}</span>
                <span className="keyword__ko">{ko}</span>
                <span className="keyword__d">{d}</span>
              </Reveal>
            ))}
          </div>

          <Reveal className="loop-head">
            <h3 className="h-sub">Service Experience · 하루가 한 바퀴 도는 6단계</h3>
            <span className="loop-head__note">단계를 누르면 해당 장면으로 이동합니다</span>
          </Reveal>
          <ol className="loop">
            {LOOP.map((l) => (
              <li key={l.n}>
                <a href={`#${l.to}`} className={`loop__item loop__item--${l.t.toLowerCase()}`}>
                  <span className="loop__t">
                    {l.t} · {l.n}
                  </span>
                  <b>{l.en}</b>
                  <span className="loop__ko">{l.ko}</span>
                  <span className="loop__d">{l.d}</span>
                </a>
              </li>
            ))}
            <li className="loop__back" aria-label="다음 날 01로 돌아감">
              ↺ 다음 날 01로
            </li>
          </ol>
        </div>
      </section>

      {/* 05 · SHOWING INDEX -------------------------------------- */}
      <section className="sec sec--ink" id="flow">
        <div className="wrap">
          <SectionHead
            num="05"
            label="Design Showing"
            title="하루를 따라가는 네 장면"
            lead="화면을 기능별로 나열하지 않고, 한 사람의 하루를 따라 연결 → 준비 → 안내 → 변화 확인의 흐름으로 보여 줍니다. 각 장면에서 실제 버튼을 눌러 화면이 어떻게 바뀌는지 확인할 수 있습니다."
          />
          <div className="chapters">
            {CHAPTERS.map((c, k) => (
              <Reveal key={c.id} delay={k * 80}>
                <a className="chapter-card" href={`#${c.id}`}>
                  <span className="chapter-card__n">{c.n}</span>
                  <b className="chapter-card__en">{c.en}</b>
                  <span className="chapter-card__ko">{c.ko}</span>
                  <span className="chapter-card__steps">{c.steps}</span>
                  <span className="chapter-card__tags">
                    {c.tags.map((t) => (
                      <i key={t}>{t}</i>
                    ))}
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
          <p className="flow-foot">DAY → NIGHT → NEXT DAY ↺</p>
        </div>
      </section>

      {/* 001 · MORNING ------------------------------------------- */}
      <section className="sec sec--day" id="morning">
        <div className="wrap">
          <ChapterHead c={CHAPTERS[0]} title="출근 시간에 맞춰, 거울이 먼저 켜진다" message="시계를 보지 않아도 거울이 시간과 순서를 챙깁니다. 따라 하기만 하면 되고, 어디를 몇 번 보정했는지도 함께 기록됩니다." />
          <FlowDemo steps={MORNING_STEPS} label="아침 메이크업 흐름" />
          <div className="aux">
            <Reveal className="aux__item">
              <span className="aux__k">Timer</span>
              <b>내 준비 시간에 맞춘 타이머</b>
              <p>출근 시각을 기준으로 단계별 남은 시간을 보여 줘 따로 시계를 볼 필요가 없습니다.</p>
            </Reveal>
            <Reveal className="aux__item" delay={80}>
              <span className="aux__k">Voice</span>
              <b>5분 · 10분 전 음성 안내</b>
              <p>화장이 끝나기 전에 음성으로 알려 시간 부족을 막습니다. 마이크 버튼으로 음성 명령도 가능합니다.</p>
            </Reveal>
            <Reveal className="aux__item" delay={160}>
              <Placeholder ratio="16 / 10" title="점선 트레이싱 · 원형 스팟 가이드" spec="4:3 · 얼굴 위 도포 위치/양 가이드가 보이는 거울 화면 클로즈업" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 002 · CONNECT ------------------------------------------- */}
      <section className="sec" id="connect">
        <div className="wrap">
          <ChapterHead c={CHAPTERS[1]} title="아침의 기록이 저녁으로 넘어간다" message="아침에 쓴 제품, 보정한 부위, 쿠션 유지 시간이 저녁 피부 확인의 출발점이 됩니다. 화장과 관리를 하나로 잇는 연결고리입니다." />
          <ConnectDemo />
        </div>
      </section>

      {/* 003 · NIGHT --------------------------------------------- */}
      <section className="sec sec--night" id="night">
        <div className="wrap">
          <ChapterHead c={CHAPTERS[2]} title="부위별로 재고, 겹친 원으로 읽는다" message="원의 크기는 범위를, 겹침은 진행 정도를 뜻합니다. 고민 부위를 누르면 오늘의 목표와 6분 관리 코스로 바로 이어집니다." />
          <FlowDemo steps={NIGHT_STEPS} label="저녁 피부 스캔 흐름" />
          <div className="legend">
            <Reveal className="legend__item">
              <span className="legend__dots" aria-hidden="true">
                <i />
                <i className="lg" />
              </span>
              <b>원 크기 = 범위</b>
              <p>고민이 넓게 퍼질수록 원이 커집니다.</p>
            </Reveal>
            <Reveal className="legend__item" delay={80}>
              <span className="legend__dots legend__dots--overlap" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <b>겹칠수록 진행</b>
              <p>같은 고민이 오래 이어질수록 원이 겹쳐 진해집니다. (트레이싱 레이어)</p>
            </Reveal>
            <Reveal className="legend__item" delay={160}>
              <span className="legend__dots legend__dots--warm" aria-hidden="true">
                <i />
              </span>
              <b>색 = 고민 종류</b>
              <p>파랑은 수분(건조), 주황은 유분(T존)처럼 고민 종류를 색으로 구분합니다.</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 004 · TOMORROW ------------------------------------------ */}
      <section className="sec" id="tomorrow">
        <div className="wrap">
          <ChapterHead c={CHAPTERS[3]} title="쌓인 기록이 내일 아침을 바꾼다" message="기록이 쌓이면 내 피부가 실제로 어떻게 바뀌었는지 숫자로 보이고, 그 결과가 내일 아침 루틴에 반영됩니다." />
          <h4 className="h-mini">06 Review · 변화 확인 — 영역을 눌러 확대</h4>
          <ZoomView src="change.png" alt="변화 화면 · 피부 지수 7주 추이와 피부 나이" regions={CHANGE_REGIONS} />
          <h4 className="h-mini h-mini--gap">Routine · AI 제안을 내일 루틴에 반영</h4>
          <FlowDemo steps={ROUTINE_STEPS} label="루틴 조정 흐름" />
        </div>
      </section>

      {/* 06 · SYNC ----------------------------------------------- */}
      <section className="sec sec--tint" id="sync">
        <div className="wrap">
          <SectionHead
            num="06"
            label="Mirror × Mobile"
            title="거울은 안내하고, 폰은 이어 받는다"
            lead="화장하는 동안 손에 화장품을 든 사용자는 거울을 직접 만지기 어렵습니다. 그래서 거울은 얼굴 앞에서 안내와 측정을, 폰은 루틴 선택·리모컨·기록 수신을 맡습니다. 오른쪽 폰 화면을 직접 눌러 보세요."
          />
          <div className="roles">
            <Reveal className="role">
              <span className="role__k">Mirror · 얼굴 앞에서</span>
              <ul>
                <li>지금 할 행동 한 줄과 바를 위치 안내</li>
                <li>부위별 피부 스캔과 겹친 원 결과</li>
                <li>메이크업 결과 체크 · 보정 부위 표시</li>
              </ul>
            </Reveal>
            <Reveal className="role" delay={80}>
              <span className="role__k">Mobile · 거울 밖에서</span>
              <ul>
                <li>시작할 루틴 선택 · 거울로 보내기</li>
                <li>진행 중 리모컨 (이전 · 일시정지 · 다음 · +1분)</li>
                <li>완료 기록 수신 · 제품 등록 · 설정</li>
              </ul>
            </Reveal>
          </div>
          <SyncDemo />
          <p className="note-req">추가 자료 필요 · 거울과 앱의 첫 연결(페어링) 과정과 연결이 끊겼을 때의 화면은 기획서·UI에 없어 이번 쇼잉에서는 다루지 않았습니다.</p>
        </div>
      </section>

      {/* 07 · DESIGN SYSTEM -------------------------------------- */}
      <section className="sec" id="system">
        <div className="wrap">
          <SectionHead
            num="07"
            label="Design System · 피드백 반영"
            title="얼굴을 가리지 않는 정보"
            lead="3가지 주요 피드백을 바탕으로 미러 디스플레이의 구조와 가독성, 정보 위계를 개선했습니다. 거울 위에는 꼭 필요한 한 줄만 남기고, 나머지는 얼굴 밖 패널로 옮겼습니다."
          />
          <div className="feedback">
            {FEEDBACK.map(([t, items], k) => (
              <Reveal className="feedback__item" key={t} delay={k * 80}>
                <span className="feedback__n">0{k + 1}</span>
                <b>{t}</b>
                <ul>
                  {items.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>

          <div className="ds">
            <Reveal className="ds__block">
              <h4 className="h-mini">Color · 강조는 한 색만</h4>
              <ul className="swatches">
                {COLORS.map(([hex, name, use]) => (
                  <li key={hex}>
                    <span className="swatch" style={{ background: hex }} />
                    <b>{name}</b>
                    <code>{hex}</code>
                    <span>{use}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal className="ds__block" delay={80}>
              <h4 className="h-mini">Type · Noto Sans KR</h4>
              <ul className="typescale">
                {TYPE.map(([size, w, use, sample]) => (
                  <li key={size}>
                    <span className="typescale__meta">
                      {size}px · {w}
                      <br />
                      {use}
                    </span>
                    <span className="typescale__sample" style={{ fontSize: `${Math.min(+size, 44)}px`, fontWeight: +w }}>
                      {sample}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal className="menu">
            <h4 className="h-mini">Key Menu</h4>
            <ul>
              {MENU.map(([icon, name, d]) => (
                <li key={name}>
                  <span className="menu__icon">
                    <Icon name={icon} size={22} />
                  </span>
                  <b>{name}</b>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* 08 · SCREENS -------------------------------------------- */}
      <section className="sec sec--tint" id="screens">
        <div className="wrap">
          <SectionHead num="08" label="Screens" title="한 화면씩, 하루의 순서대로" lead="미러 최종 화면 8장과 연동 앱 화면 8장입니다. 앱 화면은 실제로 눌러 볼 수 있는 프로토타입입니다." />
        </div>
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
        <div className="wrap">
          <a className="btn-solid btn-solid--lg" href="#/screens">
            전체 인터랙티브 프로토타입 보기 (22개 화면) <Icon name="arrowUpRight" size={18} />
          </a>
        </div>
      </section>

      {/* CLOSING ------------------------------------------------- */}
      <section className="closing">
        <div className="wrap">
          <Reveal>
            <p className="kicker">
              <span className="kicker__num">∞</span>Closing
            </p>
            <h2 className="closing__title">
              아침의 기록이 저녁 관리로,
              <br />
              저녁의 결과가 내일 아침으로.
            </h2>
            <p className="closing__sub">매일 이어지는 거울, Trac:ing</p>
          </Reveal>
          <div className="cycle" aria-label="DAY에서 NIGHT, 다음 날로 이어지는 순환">
            {['DAY · 기록', 'NIGHT · 확인', 'NEXT DAY · 반영'].map((x, k) => (
              <Reveal key={x} className="cycle__node" delay={k * 120}>
                {x}
              </Reveal>
            ))}
          </div>
          <Placeholder ratio="21 / 9" title="실제 사용 장면 영상 · 사진" spec="21:9 · 출근 전 탁상 위 미러 앞에서 화장하는 모습 → 밤에 피부를 확인하는 모습 (마무리 영상, 10~15초)" className="closing__ph" />
          <footer className="foot">
            <img src={`${import.meta.env.BASE_URL}logo-tracing.png`} alt="Trac:ing" width="92" height="25" />
            <span>Interaction Design · 22565053 조윤정 · 김승언 교수님 · 2026</span>
            <a href="#top">맨 위로 ↑</a>
          </footer>
        </div>
      </section>
    </div>
  );
}
