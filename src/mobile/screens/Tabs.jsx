import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Toggle } from '../../components/ui/index.jsx';
import { Ring } from '../../components/charts/index.jsx';
import { Filters, IconButton, MCard, MirrorLinkPill, Phone, Row, Section, Tile, TopBar } from '../MobileKit.jsx';

/** g1b · 홈 + 오늘 피부 기반 메이크업 · 관리 포커스 */
export function AppHome() {
  return (
    <Phone tab="home">
      <TopBar
        left={<span style={{ fontSize: 13, color: 'var(--ink-3)' }}>11월 6일 금요일</span>}
        actions={
          <>
            <IconButton icon="bell" label="알림" />
            <IconButton icon="settings" label="설정" to="/app/settings" />
          </>
        }
      />
      <div style={{ padding: '8px 20px 0', fontSize: 30, fontWeight: 300, lineHeight: 1.25, letterSpacing: '-.6px' }}>
        좋은 아침이에요,
        <br />
        <b style={{ fontWeight: 700 }}>지수님</b>
      </div>

      <MCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>오늘 피부 점수 · 07:40 스캔</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 48, fontWeight: 200, lineHeight: 1 }}>82</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>+3</span>
            </div>
          </div>
          <Ring value={82} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid rgba(0,0,0,.06)' }}>
          {[
            ['수분', '42', true],
            ['유분', '55'],
            ['트러블', '0'],
            ['관심', '볼', true],
          ].map(([l, v, a]) => (
            <div key={l} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>{l}</span>
              <span style={{ fontSize: 17, fontWeight: 600, color: a ? 'var(--accent)' : 'var(--ink)' }}>{v}</span>
            </div>
          ))}
        </div>
      </MCard>

      <div className="m-tiles">
        <Tile accent label="아침 메이크업" value="07:50" foot="출근 08:30 · 19분" to="/app/mirror" />
        <Tile label="밤 관리" value="6분" foot="볼 수분 집중" to="/app/skin" />
      </div>

      <MCard style={{ gap: 10 }}>
        <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>오늘의 포커스</span>
        <span style={{ fontSize: 18, fontWeight: 600 }}>
          볼이 <span className="accent">건조한</span> 날이에요
        </span>
        {[
          ['메이크업', '촉촉한 글로우 쿠션 + 세럼'],
          ['관리', '저녁엔 볼에 수분 앰플'],
        ].map(([b, t]) => (
          <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="m-badge">{b}</span>
            <span style={{ fontSize: 15 }}>{t}</span>
          </div>
        ))}
      </MCard>

      <MirrorLinkPill title="거울 연결됨 · 욕실" sub="루틴을 시작하면 거울에서 안내해요" />
    </Phone>
  );
}

const SKIN_DAYS = {
  오늘: { time: '11월 6일 07:40', age: 27, rings: [42, 55, 12, 8] },
  어제: { time: '11월 5일 07:52', age: 27, rings: [46, 54, 10, 8] },
  지난주: { time: '10월 30일 평균', age: 28, rings: [38, 58, 18, 9] },
};

/** g2 · 피부 · 스캔 결과 + 밤 관리 제안 */
export function AppSkin() {
  const [day, setDay] = useState('오늘');
  const d = SKIN_DAYS[day];
  return (
    <Phone tab="skin">
      <TopBar title="피부" actions={<IconButton icon="bell" label="알림" />} />
      <Filters options={Object.keys(SKIN_DAYS)} defaultValue={day} onChange={setDay} />
      <MCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>{d.time} · 거울 스캔</span>
          <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>피부 나이 {d.age}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {['수분', '유분', '트러블', '주름'].map((l, i) => (
            <div key={l} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <Ring value={d.rings[i]} color={i === 0 ? '#3E8EDE' : '#9AA5B1'} />
              <span style={{ fontSize: 12, color: 'var(--ink-2)' }}>{l}</span>
            </div>
          ))}
        </div>
      </MCard>
      <Section title="부위별" meta="관심 부위 1곳" />
      <MCard variant="list">
        <Row title="볼" sub="건조 · 수분 38%" value="관리 필요" valueTone="accent" />
        <Row title="T존" sub="유분 보통" value="양호" />
        <Row title="눈가" sub="주름 8" value="양호" />
      </MCard>
      <MCard variant="accent" style={{ gap: 6 }}>
        <span style={{ fontSize: 13, opacity: 0.9 }}>오늘 밤 관리 제안</span>
        <span style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.4 }}>볼에 수분 앰플을 두 번 레이어링하세요</span>
      </MCard>
    </Phone>
  );
}

const CHANGE_BARS = {
  수분: { value: 42, delta: '+9', bars: [35, 42, 56, 49, 70, 84, 91, 98] },
  유분: { value: 55, delta: '−2', bars: [62, 60, 58, 61, 57, 56, 58, 55] },
  트러블: { value: 0, delta: '−2', bars: [40, 36, 30, 22, 18, 10, 6, 2] },
  주름: { value: 8, delta: '0', bars: [44, 45, 44, 43, 44, 44, 43, 44] },
};

/** g3 · 변화 · 추이 + 제품 효과 */
export function AppChanges() {
  const [m, setM] = useState('수분');
  const c = CHANGE_BARS[m];
  return (
    <Phone tab="changes">
      <TopBar title="변화" actions={<IconButton icon="bell" label="알림" />} />
      <Filters options={Object.keys(CHANGE_BARS)} defaultValue={m} onChange={setM} />
      <MCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>최근 4주 {m}</span>
            <span style={{ fontSize: 48, fontWeight: 200, lineHeight: 1 }}>{c.value}</span>
          </div>
          <span style={{ padding: '6px 12px', borderRadius: 999, background: 'var(--accent-soft)', color: 'var(--accent)', fontSize: 13, fontWeight: 700 }}>{c.delta}</span>
        </div>
        <div style={{ position: 'relative', height: 110, display: 'flex', alignItems: 'flex-end', gap: 8 }}>
          {c.bars.map((h, i) => (
            <span key={i} style={{ flex: 1, borderRadius: 8, height: `${h}%`, background: i === c.bars.length - 1 ? 'var(--accent)' : '#E3E8EE' }} />
          ))}
          <span style={{ position: 'absolute', left: '52%', top: -4, padding: '4px 8px', borderRadius: 8, background: 'var(--ink)', color: '#fff', fontSize: 11 }}>앰플 시작</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--ink-4)' }}>
          <span>10/9</span>
          <span>10/23</span>
          <span style={{ color: 'var(--ink)', fontWeight: 600 }}>오늘</span>
        </div>
      </MCard>
      <div className="m-section">
        <span>제품별 효과</span>
        <Link to="/app/products" className="m-section__meta">
          전체 ›
        </Link>
      </div>
      <MCard variant="list">
        <Row title="수분 앰플" sub="12일 사용" value="+7" valueTone="accent" />
        <Row title="수분크림" sub="28일 사용" value="+2" />
        <Row title="톤업 선크림" sub="20일 사용" value="변화 없음" valueTone="muted" />
      </MCard>
    </Phone>
  );
}

const ROUTINES = {
  '아침 · 출근': {
    tiles: [
      ['시작', '07:50', '출근 08:30 기준'],
      ['소요', '19분', '여유 21분'],
    ],
    steps: [
      { t: '07:50', name: '스킨케어', sub: '토너 · 수분크림 · 4분', tag: '보습 +1분' },
      { t: '07:54', name: '선크림', sub: '톤업 선크림 · 2분' },
      { t: '07:56', name: '베이스', sub: '쿠션 21호 · 5분' },
      { t: '08:01', name: '눈썹', sub: '펜슬 브라운 · 3분' },
      { t: '—', name: '아이', sub: '섀도우 음영 · 4분', off: true },
    ],
  },
  '저녁 · 관리': {
    tiles: [
      ['시작', '21:40', '취침 23:00 기준'],
      ['소요', '6분', '볼 수분 집중'],
    ],
    steps: [
      { t: '21:40', name: '클렌징', sub: '폼 클렌저 · 2분' },
      { t: '21:42', name: '토너', sub: '수분 토너 · 1분' },
      { t: '21:43', name: '수분 앰플', sub: '볼 위주로 · 2분', tag: '추가됨' },
      { t: '21:45', name: '크림', sub: '수분크림 · 1분' },
    ],
  },
};

/** g4 · 루틴 · 출근 역산 + 단계 */
export function AppRoutine() {
  const [r, setR] = useState('아침 · 출근');
  const data = ROUTINES[r];
  return (
    <Phone tab="routine">
      <TopBar title="루틴" actions={<IconButton icon="plus" label="루틴 추가" />} />
      <Filters options={Object.keys(ROUTINES)} defaultValue={r} onChange={setR} />
      <div className="m-tiles">
        <Tile accent label={data.tiles[0][0]} value={data.tiles[0][1]} foot={data.tiles[0][2]} />
        <Tile label={data.tiles[1][0]} value={data.tiles[1][1]} foot={data.tiles[1][2]} />
      </div>
      <Section title="단계" meta="길게 눌러 순서 변경" />
      <MCard variant="list">
        {data.steps.map((s) => (
          <div className="m-row" key={s.name} style={{ justifyContent: 'flex-start', padding: '12px 0' }}>
            <span style={{ width: 40, fontSize: 12, color: 'var(--ink-3)' }}>{s.t}</span>
            <span className="m-row__text">
              <span className="m-row__title" style={{ display: 'flex', gap: 6, alignItems: 'center', color: s.off ? 'var(--ink-4)' : 'var(--ink)' }}>
                {s.name}
                {s.tag && <span style={{ padding: '2px 8px', borderRadius: 999, background: 'var(--accent-soft)', color: 'var(--accent)', fontSize: 11, fontWeight: 600 }}>{s.tag}</span>}
              </span>
              <span className="m-row__sub">{s.sub}</span>
            </span>
            <Toggle defaultOn={!s.off} label={`${s.name} 켜기`} />
          </div>
        ))}
      </MCard>
    </Phone>
  );
}

const PRODUCTS = [
  ['다이브인 앰플', '토리든', '다 써가요', 'accent', '스킨케어'],
  ['블러 웨어 블러셔', '에스쁘아', '건조 피부 OK', 'muted', '색조'],
  ['자작나무 수분크림', '라운드랩', '사용 28일', 'muted', '스킨케어'],
  ['킬커버 쿠션 21호', '클리오', '사용 20일', 'muted', '베이스'],
];

/** g5 · 제품 · 등록 + 잔량 */
export function AppProducts() {
  const [f, setF] = useState('전체 14');
  const list = f === '전체 14' ? PRODUCTS : PRODUCTS.filter((p) => p[4] === f);
  return (
    <Phone tab="products">
      <TopBar title="제품" actions={<IconButton icon="plus" label="제품 추가" to="/app/products/new" />} />
      <Filters options={['전체 14', '스킨케어', '베이스', '색조']} defaultValue={f} onChange={setF} />
      <MCard variant="accent" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 13, opacity: 0.9 }}>새 제품 등록</span>
          <span style={{ fontSize: 17, fontWeight: 600 }}>바코드로 바로 추가</span>
        </span>
        <Link to="/app/products/new" style={{ padding: '10px 14px', borderRadius: 999, background: '#fff', color: 'var(--accent)', fontSize: 13, fontWeight: 700 }}>
          스캔
        </Link>
      </MCard>
      <Section title="내 제품" meta="루틴에 연결 12개" />
      <MCard variant="list">
        {list.map(([t, b, v, tone]) => (
          <Row key={t} title={t} sub={b} value={v} valueTone={tone} />
        ))}
      </MCard>
    </Phone>
  );
}
