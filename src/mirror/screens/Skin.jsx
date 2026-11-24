import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/Icon.jsx';
import { Button, Card, ChipGroup, Segmented, StepBadge } from '../../components/ui/index.jsx';
import { Donut } from '../../components/charts/index.jsx';
import MirrorLayout, { Corner, FaceTag, MirrorPane, Pill, VoiceButton } from '../MirrorLayout.jsx';

/* ------------------------------------------------------------------ */
/* m1 · 관리 탭 · 오늘 밤 관리 단계 + 거울 위 부위 가이드               */
/* ------------------------------------------------------------------ */

const CARE_STEPS = [
  { name: '클렌징', product: '폼 클렌저', min: 2, guide: '클렌징 · 얼굴 전체', voice: '"거품을 내서 T존부터 둥글게 문질러 주세요"' },
  { name: '토너', product: '수분 토너', min: 1, guide: '토너 · 볼부터 가볍게', voice: '"토너를 손바닥에 덜어 볼부터 눌러 주세요"' },
  { name: '수분 앰플', product: '볼 위주로', min: 2, guide: '앰플 · 볼 집중', voice: '"앰플 두 방울을 볼에 톡톡 두드려 주세요"' },
  { name: '크림', product: '수분크림', min: 1, guide: '크림 · 얼굴 전체', voice: '"크림을 얇게 펴 바르고 감싸 주세요"' },
];

export function CareTonight() {
  const [current, setCurrent] = useState(1);
  const [done, setDone] = useState(new Set([0]));
  const step = CARE_STEPS[current];
  const advance = (markDone) => {
    const next = new Set(done);
    if (markDone) next.add(current);
    setDone(next);
    setCurrent(Math.min(current + 1, CARE_STEPS.length - 1));
  };

  return (
    <MirrorLayout
      title="오늘 밤 관리"
      nav="skin"
      mirror={
        <MirrorPane>
          <Corner at="tl">
            <Segmented label="관리 시간대" options={['저녁 관리', '아침 관리']} />
          </Corner>
          {[-78, 22].map((dx) => (
            <span
              key={dx}
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: `calc(50% + ${dx}px)`,
                top: 300,
                width: 56,
                height: 44,
                borderRadius: '50%',
                border: '2px dashed var(--accent)',
                background: 'rgba(62,142,222,.08)',
              }}
            />
          ))}
          <FaceTag left="calc(50% - 250px)" top={296} title={step.guide} />
          <Pill bottom style={{ fontSize: 17, padding: '12px 20px', background: 'rgba(255,255,255,.8)' }}>
            {step.voice}
          </Pill>
          <VoiceButton />
        </MirrorPane>
      }
    >
      <Card lg style={{ padding: '24px 26px', gap: 6 }}>
        <span className="card-label">오늘 밤 관리</span>
        <span className="headline">
          볼 <span className="accent">수분 집중</span>
        </span>
        <span className="card-meta">4단계 · 6분</span>
      </Card>

      <Card lg fill style={{ padding: 18, gap: 8 }}>
        {CARE_STEPS.map((s, k) => {
          const isDone = done.has(k);
          const isCurrent = k === current;
          return (
            <button
              type="button"
              key={s.name}
              onClick={() => setCurrent(k)}
              aria-current={isCurrent ? 'step' : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '12px 16px',
                borderRadius: 18,
                textAlign: 'left',
                background: isCurrent ? '#fff' : 'rgba(255,255,255,.5)',
              }}
            >
              <StepBadge lg variant={isDone ? 'fill' : isCurrent ? 'ring' : undefined}>
                {isDone ? <Icon name="check" size={13} strokeWidth={3} /> : k + 1}
              </StepBadge>
              <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 17, fontWeight: isCurrent ? 500 : 400, color: isDone && !isCurrent ? 'var(--ink-3)' : 'var(--ink)' }}>{s.name}</span>
                <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>{s.product}</span>
              </span>
              <span style={{ fontSize: 15, color: 'var(--ink-2)' }}>{s.min}분</span>
            </button>
          );
        })}
      </Card>

      <div className="btn-row">
        <Button variant="ghost" onClick={() => advance(false)}>
          건너뛰기
        </Button>
        <Button variant="ink" style={{ flex: 2 }} onClick={() => advance(true)}>
          다음 단계
        </Button>
      </div>
    </MirrorLayout>
  );
}

/* ------------------------------------------------------------------ */
/* 5a / 5b / 5c · 피부 스캔 · 준비 → 진행 중 → 결과                     */
/* ------------------------------------------------------------------ */

const MEASURES = ['수분', '유분', '트러블', '피부결'];

function ScanFrame({ active }) {
  const c = active ? 'var(--accent)' : '#888888';
  const corner = (pos) => ({
    position: 'absolute',
    width: 40,
    height: 40,
    [pos[0]]: 0,
    [pos[1]]: 0,
    [`border${pos[0] === 'top' ? 'Top' : 'Bottom'}`]: `3px solid ${c}`,
    [`border${pos[1] === 'left' ? 'Left' : 'Right'}`]: `3px solid ${c}`,
    [`border${pos[0] === 'top' ? 'Top' : 'Bottom'}${pos[1] === 'left' ? 'Left' : 'Right'}Radius`]: 18,
  });
  return (
    <div aria-hidden="true" style={{ position: 'absolute', left: 'calc(50% - 140px)', top: 170, width: 280, height: 290 }}>
      {[
        ['top', 'left'],
        ['top', 'right'],
        ['bottom', 'left'],
        ['bottom', 'right'],
      ].map((p) => (
        <span key={p.join()} style={corner(p)} />
      ))}
    </div>
  );
}

function MeasureList({ progress }) {
  return (
    <Card variant="solid" style={{ padding: '18px 22px', gap: 0 }}>
      <span style={{ fontSize: 14, color: 'var(--ink-2)', paddingBottom: 6 }}>측정 항목</span>
      {MEASURES.map((m, k) => {
        const state = progress == null ? 'todo' : k < progress ? 'done' : k === progress ? 'doing' : 'todo';
        return (
          <div key={m} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderTop: '1px solid var(--line)', fontSize: 16 }}>
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                ...(state === 'done'
                  ? { background: 'var(--ink)', color: '#fff' }
                  : { border: `2px solid ${state === 'doing' ? 'var(--accent)' : 'var(--line-2)'}` }),
              }}
            >
              {state === 'done' && <Icon name="check" size={12} strokeWidth={3} />}
            </span>
            <span style={{ flex: 1, color: state === 'todo' && progress == null ? 'var(--ink-3)' : state === 'todo' ? 'var(--ink-3)' : 'var(--ink)' }}>{m}</span>
            {state === 'doing' && <span style={{ fontSize: 13, color: 'var(--accent)' }}>진행 중</span>}
          </div>
        );
      })}
    </Card>
  );
}

function ScanMesh() {
  return (
    <svg aria-hidden="true" style={{ position: 'absolute', left: 'calc(50% - 90px)', top: 200 }} width="180" height="225" viewBox="0 0 180 225" fill="none" stroke="#3E8EDE" strokeWidth="1" opacity=".7">
      <path d="M90 10 L40 60 L30 120 L60 180 L90 210 L120 180 L150 120 L140 60 Z" />
      <path d="M90 10 L90 210 M40 60 L140 60 M30 120 L150 120 M60 180 L120 180 M40 60 L90 120 L140 60 M60 180 L90 120 L120 180" />
      <g fill="#3E8EDE" stroke="none">
        {[
          [90, 10],
          [40, 60],
          [140, 60],
          [30, 120],
          [150, 120],
          [90, 120],
          [60, 180],
          [120, 180],
          [90, 210],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="2.5" />
        ))}
      </g>
    </svg>
  );
}

export function Scan() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState('ready'); // ready → scanning → result
  const [pct, setPct] = useState(55);

  useEffect(() => {
    if (phase !== 'scanning') return undefined;
    if (pct >= 100) {
      const done = setTimeout(() => setPhase('result'), 400);
      return () => clearTimeout(done);
    }
    const t = setTimeout(() => setPct((p) => Math.min(100, p + 3)), 160);
    return () => clearTimeout(t);
  }, [phase, pct]);

  const header = { ready: '피부 스캔', scanning: '피부 스캔 중', result: '스캔 결과' }[phase];
  const progressIdx = Math.min(3, Math.floor(pct / 25));
  const secondsLeft = Math.max(0, Math.round(((100 - pct) / 100) * 13));

  let mirror;
  let panel;
  if (phase === 'ready') {
    mirror = (
      <MirrorPane>
        <ScanFrame />
        <Pill>얼굴을 틀 안에 맞춰요</Pill>
        <div style={{ position: 'absolute', left: '50%', bottom: 28, transform: 'translateX(-50%)', display: 'flex', gap: 10, whiteSpace: 'nowrap' }}>
          <span className="chip" style={{ background: '#fff' }}>조명 OK ✓</span>
          <span className="chip" style={{ background: '#fff' }}>거리 OK ✓</span>
          <span className="chip" aria-pressed="true">정면 ↔ 조금 왼쪽</span>
        </div>
      </MirrorPane>
    );
    panel = (
      <>
        <Card variant="solid" style={{ padding: 22, gap: 10 }}>
          <span style={{ fontSize: 14, color: 'var(--ink-2)' }}>피부 스캔</span>
          <span style={{ fontSize: 24, lineHeight: 1.35 }}>맨얼굴로 정면을 봐주세요</span>
          <span style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.5 }}>약 10초 · 조명은 자동으로 스캔 모드로 바뀌어요</span>
        </Card>
        <MeasureList />
        <div className="push" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Button
            style={{ padding: '18px 0', fontSize: 18, fontWeight: 400 }}
            onClick={() => {
              setPct(0);
              setPhase('scanning');
            }}
          >
            스캔 시작
          </Button>
          <span style={{ textAlign: 'center', fontSize: 13, color: 'var(--ink-3)' }}>"트랙, 스캔해 줘"로도 시작할 수 있어요</span>
        </div>
      </>
    );
  } else if (phase === 'scanning') {
    mirror = (
      <MirrorPane>
        <ScanFrame active />
        <ScanMesh />
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 'calc(50% - 140px)',
            top: 170 + (pct / 100) * 290,
            width: 280,
            height: 2,
            background: 'var(--accent)',
            boxShadow: '0 0 16px 4px rgba(62,142,222,.35)',
          }}
        />
        <Pill>
          움직이지 마세요 · <b style={{ fontWeight: 500, color: 'var(--accent)' }}>{secondsLeft}초</b>
        </Pill>
        <div style={{ position: 'absolute', left: 40, right: 40, bottom: 32, height: 6, borderRadius: 3, background: 'var(--line-2)' }}>
          <span style={{ display: 'block', width: `${pct}%`, height: '100%', borderRadius: 3, background: 'var(--accent)' }} />
        </div>
      </MirrorPane>
    );
    panel = (
      <>
        <Card variant="solid" style={{ padding: 22, gap: 6 }}>
          <span style={{ fontSize: 14, color: 'var(--ink-2)' }}>분석 중</span>
          <span style={{ fontSize: 40, fontWeight: 300 }}>{pct}%</span>
        </Card>
        <MeasureList progress={progressIdx} />
        <Button variant="white" className="push" style={{ padding: '18px 0' }} onClick={() => setPhase('ready')}>
          취소
        </Button>
      </>
    );
  } else {
    mirror = (
      <MirrorPane>
        <svg aria-hidden="true" style={{ position: 'absolute', left: 'calc(50% - 110px)', top: 250 }} width="220" height="110" viewBox="0 0 220 110" fill="none" stroke="#3E8EDE" strokeWidth="1.2">
          <path d="M14 14 Q60 40 96 34" />
          <path d="M20 30 Q58 54 90 50" />
          <path d="M28 46 Q58 66 84 64" />
          <path d="M14 14 L56 92 L96 34" />
          <circle cx="14" cy="14" r="9" />
          <circle cx="56" cy="92" r="11" strokeOpacity=".5" />
          <g fill="#3E8EDE" stroke="none">
            <circle cx="14" cy="14" r="2.5" />
            <circle cx="96" cy="34" r="2.5" />
            <circle cx="56" cy="92" r="2.5" />
          </g>
        </svg>
        <FaceTag left="calc(50% - 260px)" top={290} title="볼 · 건조" sub="어제보다 ▼ 8%" accent />
        <FaceTag left="calc(50% + 60px)" top={190} title="T존 · 보통" />
        <Pill>스캔 완료 · 08:12</Pill>
      </MirrorPane>
    );
    panel = (
      <>
        <Card variant="solid" style={{ padding: 18, flexDirection: 'row', gap: 8 }}>
          {[
            ['수분', 42, true],
            ['유분', 58],
            ['피부결', 71],
          ].map(([label, v, accent]) => (
            <div key={label} style={{ flex: 1, padding: 14, borderRadius: 20, background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>{label}</span>
              <Donut value={v} accent={accent} />
            </div>
          ))}
        </Card>
        <Card variant="solid" style={{ padding: '20px 22px', gap: 8 }}>
          <span style={{ fontSize: 14, color: 'var(--ink-2)' }}>오늘 메이크업에 반영</span>
          <span style={{ fontSize: 18, lineHeight: 1.45 }}>
            기초 <span className="accent">보습 +1분</span>, 블러셔는 <span className="accent">크림 타입</span>으로 바꿨어요
          </span>
        </Card>
        <div className="btn-row push" style={{ gap: 10 }}>
          <Button variant="white" size="md" onClick={() => navigate('/mirror/analysis')}>
            기록만 저장
          </Button>
          <Button variant="ink" size="md" style={{ flex: 1.4 }} onClick={() => navigate('/mirror/makeup')}>
            메이크업 시작 ›
          </Button>
        </div>
      </>
    );
  }

  return (
    <MirrorLayout title={header} nav="skin" mirror={mirror}>
      {panel}
    </MirrorLayout>
  );
}

/* ------------------------------------------------------------------ */
/* 4b · 피부 기록 · 거울에서 부위 터치 + 상태 선택                       */
/* ------------------------------------------------------------------ */

const RECORD_ROWS = [
  ['수분', ['촉촉', '보통', '건조'], '건조'],
  ['유분', ['적음', '보통', '많음'], '보통'],
  ['트러블', ['없음', '조금', '많음'], '없음'],
];

export function SkinRecord() {
  return (
    <MirrorLayout
      title="오늘 피부 기록"
      nav="skin"
      mirror={
        <MirrorPane>
          <Corner at="tl" style={{ padding: '10px 18px', background: 'rgba(255,255,255,.8)', borderRadius: 999, fontSize: 16, whiteSpace: 'nowrap' }}>
            불편한 부위를 거울에서 눌러요
          </Corner>
          <span
            aria-hidden="true"
            style={{ position: 'absolute', left: 'calc(50% - 70px)', top: 290, width: 44, height: 44, borderRadius: '50%', border: '2px solid var(--accent)', background: 'rgba(62,142,222,.15)' }}
          />
          <span style={{ position: 'absolute', left: 'calc(50% - 150px)', top: 300, padding: '6px 12px', borderRadius: 999, background: 'var(--accent)', color: '#fff', fontSize: 13 }}>볼</span>
          <span
            aria-hidden="true"
            style={{ position: 'absolute', left: 'calc(50% + 10px)', top: 230, width: 36, height: 36, borderRadius: '50%', border: '2px dashed var(--placeholder)' }}
          />
          <VoiceButton dark />
        </MirrorPane>
      }
    >
      <Card variant="solid" style={{ padding: 22, gap: 12 }}>
        <span style={{ fontSize: 14, color: 'var(--ink-2)' }}>오늘 저녁 피부 기록</span>
        <span style={{ fontSize: 24 }}>오늘 피부는 어땠나요?</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {RECORD_ROWS.map(([label, opts, def]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 16, width: 60 }}>{label}</span>
              <ChipGroup options={opts} defaultValue={def} size="sm" />
            </div>
          ))}
        </div>
      </Card>
      <Card variant="solid" style={{ padding: '18px 20px', gap: 10 }}>
        <span style={{ fontSize: 14, color: 'var(--ink-2)' }}>선택한 부위</span>
        <div className="chip-row">
          <span className="chip chip--sm" aria-pressed="true">볼</span>
          <button type="button" className="chip chip--sm">+ 추가</button>
        </div>
        <span style={{ fontSize: 14, color: 'var(--ink-3)', display: 'flex', alignItems: 'center', gap: 4 }}>
          메모는 음성으로 남길 수 있어요 <Icon name="mic" size={16} />
        </span>
      </Card>
      <Button className="push" style={{ padding: '18px 0', fontSize: 18, fontWeight: 400 }}>
        기록 저장
      </Button>
    </MirrorLayout>
  );
}
