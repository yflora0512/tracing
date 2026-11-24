import { useState } from 'react';
import Icon from '../../components/Icon.jsx';
import { Button, Card, ChipGroup, Segmented, Toggle, Tooltip } from '../../components/ui/index.jsx';
import { HeatmapTrend, RadialGauge, TrendLine } from '../../components/charts/index.jsx';
import MirrorLayout, { Corner, MirrorPane } from '../MirrorLayout.jsx';

/* ------------------------------------------------------------------ */
/* 8l · 피부 분석 결과 · 히트맵 + 추이 + 지표 4종 · 글라스              */
/* ------------------------------------------------------------------ */

const INDICATORS = [
  ['수분', 36],
  ['유분', 64],
  ['모공', 20],
  ['탄력', 40],
];
const SKIN_AGE = [
  [20, 40],
  [90, 52],
  [160, 86],
  [230, 96],
  [280, 99],
];

export function Analysis() {
  const [sel, setSel] = useState('수분');
  return (
    <MirrorLayout
      greeting={false}
      nav="skin"
      mirror={
        <MirrorPane glass>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span className="card-label">오늘 08:12 스캔</span>
              <span className="card-meta">최근 7주 추이</span>
            </div>
            <Segmented size="md" variant="light" label="부위" options={['전체', '이마', '볼', '턱']} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 20, flex: 1, minHeight: 0 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 32 }}>
                {[
                  ['최고', '68'],
                  ['최저', '31'],
                  ['최근 4주 변화', '+18%', true],
                ].map(([l, v, a]) => (
                  <div key={l} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontSize: 14, color: 'var(--ink-2)' }}>{l}</span>
                    <span className="number" style={{ color: a ? 'var(--accent)' : undefined }}>
                      {v}
                    </span>
                  </div>
                ))}
              </div>
              <span style={{ fontSize: 12, color: 'var(--accent)' }}>● 최근 4주 · 스캔 24회</span>
            </div>
            <HeatmapTrend />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 8, paddingTop: 20, borderTop: '1px solid #E6E6E6' }}>
            {INDICATORS.map(([label, v]) => (
              <button
                type="button"
                key={label}
                aria-pressed={sel === label}
                onClick={() => setSel(label)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '14px 16px',
                  borderRadius: 20,
                  textAlign: 'left',
                  background: sel === label ? 'rgba(255,255,255,.55)' : 'transparent',
                  boxShadow: sel === label ? 'inset 0 0 0 1px rgba(255,255,255,.9)' : 'none',
                }}
              >
                <RadialGauge value={v} />
                <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontSize: 14, color: 'var(--ink-2)' }}>{label}</span>
                  <span style={{ fontSize: 26, fontWeight: 300, lineHeight: 1.1 }}>
                    {v}
                    <span style={{ fontSize: 14 }}>%</span>
                  </span>
                </span>
              </button>
            ))}
          </div>
        </MirrorPane>
      }
    >
      <Card lg style={{ padding: '20px 22px', gap: 8 }}>
        <span className="card-label">종합 피부 점수</span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{ fontSize: 56, fontWeight: 300, lineHeight: 1 }}>72</span>
          <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--accent)' }}>▲ 4 · 지난 스캔</span>
        </div>
      </Card>

      <Card style={{ padding: '20px 22px', gap: 8, borderRadius: 24 }}>
        <span className="card-label">한 줄 요약</span>
        <span style={{ fontSize: 18, lineHeight: 1.45, textWrap: 'pretty' }}>
          수분이 4주째 오르고 있어요. <br />
          유분은 T존 위주로 높아요.
        </span>
      </Card>

      <Card fill style={{ padding: '20px 22px', gap: 14, borderRadius: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span className="card-label">피부 나이 추이</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span className="number">27세</span>
            <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--accent)' }}>▼ 2세 · 3월 대비</span>
          </div>
        </div>
        <div style={{ position: 'relative', flex: 1, minHeight: 132, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ position: 'relative', flex: 1, minHeight: 110 }}>
            <div style={{ position: 'absolute', inset: 0 }}>
              <TrendLine points={SKIN_AGE} viewH={120} height="100%" mark={2} guide={60}>
                <Tooltip white style={{ left: 'calc(53.3% - 28px)', top: 'calc(71.7% - 54px)', padding: '5px 10px' }}>
                  <span style={{ fontSize: 12, fontWeight: 500 }}>오늘</span>
                </Tooltip>
                <span style={{ position: 'absolute', right: 0, top: 'calc(50% - 16px)', fontSize: 11, color: 'var(--ink-3)' }}>적정</span>
              </TrendLine>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ink-3)', padding: '0 4px' }}>
            <span>3월</span>
            <span>오늘</span>
            <span>12월 예상</span>
          </div>
        </div>
      </Card>
    </MirrorLayout>
  );
}

/* ------------------------------------------------------------------ */
/* v1 · 변화 · 추이 그래프 + 제품 사용 시점 + 제품별 효과               */
/* ------------------------------------------------------------------ */

const CHANGE = {
  수분: { value: 42, delta: '4주 전보다 +9', pts: [[10, 52], [50, 50], [90, 46], [130, 48], [170, 40], [210, 34], [250, 30], [290, 24]] },
  유분: { value: 55, delta: '4주 전보다 −2', pts: [[10, 34], [50, 36], [90, 32], [130, 35], [170, 37], [210, 36], [250, 38], [290, 36]] },
  트러블: { value: 0, delta: '4주 전 2 → 0', pts: [[10, 20], [50, 26], [90, 34], [130, 40], [170, 48], [210, 56], [250, 60], [290, 62]] },
};

export function Changes() {
  const [metric, setMetric] = useState('수분');
  const c = CHANGE[metric];
  return (
    <MirrorLayout
      title="피부 변화"
      nav="changes"
      mirror={
        <Card style={{ padding: '26px 30px', borderRadius: 32, gap: 18, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Segmented label="지표" options={Object.keys(CHANGE)} value={metric} onChange={setMetric} />
            <Segmented label="기간" options={['4주', '1주', '3개월']} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <span className="display">{c.value}</span>
            <span style={{ fontSize: 17, color: 'var(--accent)' }}>{c.delta}</span>
          </div>
          <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
            <div style={{ position: 'absolute', inset: 0 }}>
              <TrendLine points={c.pts} height="100%" mark={null} markLine={false} vline={170}>
                <span style={{ position: 'absolute', left: 'calc(170 / 300 * 100% + 8px)', top: 0, fontSize: 13, color: 'var(--ink-2)' }}>수분 앰플 사용 시작</span>
              </TrendLine>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--ink-4)' }}>
            {['10월 9일', '10월 16일', '10월 23일', '10월 30일', '오늘'].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
        </Card>
      }
    >
      <Card lg style={{ padding: '22px 26px', gap: 12 }}>
        <span className="card-label">피부 요약 · 4주</span>
        {[
          ['수분', '+9', true],
          ['유분', '−2'],
          ['트러블', '2 → 0'],
        ].map(([l, v, a]) => (
          <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 17 }}>
            <span>{l}</span>
            <span style={{ fontWeight: 500, color: a ? 'var(--accent)' : 'var(--ink)' }}>{v}</span>
          </div>
        ))}
      </Card>
      <Card lg fill style={{ padding: '22px 26px', gap: 14 }}>
        <span className="card-label">제품별 효과</span>
        {[
          ['수분 앰플', '12일 사용', '수분 +7', true],
          ['수분크림', '28일 사용', '수분 +2'],
          ['톤업 선크림', '20일 사용', '변화 없음'],
        ].map(([name, used, effect, a]) => (
          <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid rgba(0,0,0,.06)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 17 }}>{name}</span>
              <span className="card-meta">{used}</span>
            </div>
            <span style={{ fontSize: 15, fontWeight: 500, color: a ? 'var(--accent)' : 'var(--ink-2)' }}>{effect}</span>
          </div>
        ))}
        <span className="card-meta" style={{ marginTop: 'auto' }}>
          사용 기록과 피부 스캔을 함께 비교해요
        </span>
      </Card>
    </MirrorLayout>
  );
}

/* ------------------------------------------------------------------ */
/* r4 · 루틴 편집 · 시작 시각 → AI 제안 → 저장                          */
/* ------------------------------------------------------------------ */

const INITIAL_STEPS = [
  { name: '기초', min: 3, hint: '보습 +1분 추천' },
  { name: '눈썹', min: 2 },
  { name: '아이', min: 4 },
  { name: '블러셔', min: 3, hint: '크림 타입' },
  { name: '립', min: 2 },
];

const fmt = (mins) => `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;

export function RoutineEdit() {
  const [steps, setSteps] = useState(INITIAL_STEPS);
  const [suggested, setSuggested] = useState(null); // 'added' | 'later'
  const total = steps.reduce((a, s) => a + s.min, 0);
  const commute = 8 * 60 + 30;
  const start = commute - 40;
  const set = (i, patch) => setSteps(steps.map((s, k) => (k === i ? { ...s, ...patch } : s)));
  const round = { width: 32, height: 32, borderRadius: '50%', background: 'var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center' };

  return (
    <MirrorLayout
      title="루틴 편집"
      nav="routine"
      mirror={
        <Card variant="solid" style={{ padding: 26, borderRadius: 32, gap: 14, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Segmented size="md" variant="light" label="루틴" options={['출근 메이크업', '저녁 관리', { value: 'add', label: '+' }]} style={{ fontSize: 16 }} />
            <button type="button" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 999, background: 'var(--ink)', color: '#fff', fontSize: 17 }}>
              <Icon name="clock" size={18} /> 총 {total}분 <Icon name="pencil" size={16} />
            </button>
          </div>
          {steps.map((s, i) => (
            <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px', borderRadius: 20, background: '#fff' }}>
              <span style={{ color: '#BBBBBB' }} aria-label="순서 변경">
                <Icon name="grip" size={18} />
              </span>
              <span className="step step--lg" style={{ background: 'var(--line)', color: 'var(--ink)' }}>
                {i + 1}
              </span>
              <span style={{ fontSize: 19, width: 90 }}>{s.name}</span>
              <span style={{ flex: 1, fontSize: 14, color: 'var(--accent)' }}>{s.hint}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 16 }}>
                <button type="button" style={round} aria-label={`${s.name} 1분 줄이기`} onClick={() => set(i, { min: Math.max(1, s.min - 1) })}>
                  <Icon name="minus" size={16} />
                </button>
                <span style={{ width: 40, textAlign: 'center' }}>{s.min}분</span>
                <button type="button" style={round} aria-label={`${s.name} 1분 늘리기`} onClick={() => set(i, { min: s.min + 1 })}>
                  <Icon name="plus" size={16} />
                </button>
              </div>
              <button type="button" aria-label={`${s.name} 삭제`} style={{ color: 'var(--ink-3)' }} onClick={() => setSteps(steps.filter((_, k) => k !== i))}>
                <Icon name="close" size={18} />
              </button>
            </div>
          ))}
          <button type="button" style={{ padding: 14, borderRadius: 20, border: '2px dashed #CCCCCC', color: 'var(--ink-2)', fontSize: 16 }}>
            + 단계 추가
          </button>
        </Card>
      }
    >
      <Card lg style={{ padding: '24px 26px', gap: 4 }}>
        <span className="card-label">출근 08:30 기준 시작</span>
        <span className="display" style={{ lineHeight: 1.15 }}>
          {fmt(start - (suggested === 'added' ? 1 : 0))}
        </span>
        <span className="card-meta">
          총 {total}분 · 여유 {40 - total}분
        </span>
      </Card>

      <Card lg fill style={{ padding: '24px 26px', gap: 14 }}>
        <span className="card-label">AI 제안</span>
        {suggested === 'added' ? (
          <span style={{ fontSize: 22, fontWeight: 500, lineHeight: 1.4 }}>
            기초에 <span className="accent">수분 앰플 1분</span>을 더했어요
          </span>
        ) : (
          <>
            <span style={{ fontSize: 22, fontWeight: 500, lineHeight: 1.4 }}>
              볼이 건조해요.
              <br />
              기초에 <span className="accent">수분 앰플 1분</span>을 더할까요?
            </span>
            <span className="card-meta">시작 {fmt(start - 1)}로 바뀌어요</span>
            <div className="btn-row">
              <Button size="md" style={{ padding: 12, fontSize: 15 }} onClick={() => setSuggested('added')}>
                추가
              </Button>
              <Button variant="ghost" size="md" style={{ padding: 12, fontSize: 15 }} onClick={() => setSuggested('later')}>
                나중에
              </Button>
            </div>
          </>
        )}
        <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: '1px solid rgba(0,0,0,.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 15 }}>피부 기록에 맞춰 자동 조정</span>
            <span className="card-meta">건조한 날 보습 단계 +1분</span>
          </div>
          <Toggle label="피부 기록에 맞춰 자동 조정" />
        </div>
      </Card>

      <Button variant="ink" style={{ fontSize: 18 }}>
        저장
      </Button>
    </MirrorLayout>
  );
}

/* ------------------------------------------------------------------ */
/* 6a · 제품 등록 · 거울 앞에 제품을 비추면 인식 → 파우치에 추가        */
/* ------------------------------------------------------------------ */

export function ProductRegister() {
  return (
    <MirrorLayout
      greeting={false}
      nav="settings"
      mirror={
        <MirrorPane faceTop={null}>
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -55%)',
              width: 300,
              height: 380,
              borderRadius: 24,
              border: '2px dashed var(--placeholder)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--ink-3)',
              fontSize: 15,
            }}
          >
            제품
          </div>
          <span
            aria-hidden="true"
            style={{ position: 'absolute', left: '50%', top: 'calc(50% - 250px)', transform: 'translateX(-50%)', width: 340, height: 420, border: '3px solid var(--accent)', borderRadius: 28, opacity: 0.9 }}
          />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              bottom: 40,
              transform: 'translateX(-50%)',
              padding: '12px 22px',
              borderRadius: 999,
              background: 'rgba(255,255,255,.85)',
              fontSize: 17,
              whiteSpace: 'nowrap',
            }}
          >
            라벨이 보이게 제품을 비춰주세요
          </div>
          <Corner at="tl">
            <Segmented variant="ink" label="등록 방식" options={['카메라 인식', '바코드', '직접 입력']} />
          </Corner>
        </MirrorPane>
      }
    >
      <Card variant="white">
        <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 500 }}>인식됨 · 확인해 주세요</span>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ width: 64, height: 64, flexShrink: 0, borderRadius: 14, border: '2px dashed var(--placeholder)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
            <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>브랜드명</span>
            <span style={{ fontSize: 19 }}>크림 블러셔 03 코랄</span>
          </div>
        </div>
      </Card>
      <Card variant="white">
        <span style={{ fontSize: 14, color: 'var(--ink-2)' }}>종류</span>
        <ChipGroup options={['블러셔', '파운데이션', '립', '아이', '스킨케어']} defaultValue="블러셔" />
        <span style={{ fontSize: 14, color: 'var(--ink-2)' }}>제형</span>
        <ChipGroup options={['크림', '파우더', '리퀴드']} defaultValue="크림" />
      </Card>
      <Card variant="white">
        <span style={{ fontSize: 14, color: 'var(--ink-2)' }}>사용할 루틴</span>
        <button type="button" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, textAlign: 'left' }}>
          <span>아침 메이크업 · 블러셔 단계</span>
          <span>›</span>
        </button>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--ink-3)', borderTop: '1px solid var(--line)', paddingTop: 10 }}>
          <span>개봉일</span>
          <span style={{ color: 'var(--ink)' }}>오늘</span>
        </div>
      </Card>
      <div className="btn-row push">
        <Button variant="outline" size="md">
          다시 찍기
        </Button>
        <Button size="md">파우치에 추가</Button>
      </div>
    </MirrorLayout>
  );
}
