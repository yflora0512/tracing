import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/Icon.jsx';
import { Button, Card, Segmented, StepBadge } from '../../components/ui/index.jsx';
import MirrorLayout, { Corner, FaceTag, MirrorPane, VoiceButton } from '../MirrorLayout.jsx';

const STEPS = [
  { name: '베이스', weight: 3, action: <>얼굴 중앙에서 <span className="accent">바깥으로</span> 펴 발라요</>, brand: '클리오', product: '킬커버 쿠션 21호', desc: '쿠션 · 세미 매트' },
  { name: '아이', weight: 2, action: <>눈두덩에 <span className="accent">얇게</span> 쓸어요</>, brand: '롬앤', product: '베러 댄 아이즈', desc: '파우더 · 음영' },
  { name: '블러셔', weight: 3, action: <>광대 위쪽에 <span className="accent">가볍게</span> 두드려요</>, brand: '에스쁘아', product: '블러 웨어 블러셔', desc: <>크림 · 촉촉한 마무리 · <span className="accent">건조 피부 OK</span></> },
  { name: '립', weight: 2, action: <>입술 안쪽부터 <span className="accent">그라데이션</span>으로</>, brand: '페리페라', product: '잉크 무드 글로이 틴트', desc: '틴트 · 글로우' },
];
const REMAINING = [11, 8, 4, 2];

/** 4zb · 메이크업 진행 — 행동 문구 하나 + 하단 단계/시간, 제품 카드 글라스 */
export function MakeupProgress() {
  const navigate = useNavigate();
  const [i, setI] = useState(2);
  const s = STEPS[i];
  return (
    <MirrorLayout
      greeting={false}
      nav="makeup"
      mirror={
        <MirrorPane>
          <Corner at="tl">
            <button
              type="button"
              aria-label="메이크업 탭으로"
              onClick={() => navigate('/mirror/makeup')}
              style={{ display: 'flex', padding: 8, borderRadius: 999, background: 'rgba(255,255,255,.5)', backdropFilter: 'blur(20px)' }}
            >
              <span style={{ width: 36, height: 36, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="back" size={18} />
              </span>
            </button>
          </Corner>
          <div
            style={{
              position: 'absolute',
              left: 206,
              top: 58,
              width: 420,
              padding: '18px 24px 20px',
              background: 'rgba(255,255,255,.5)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: 22,
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
          >
            <span style={{ fontSize: 22 }}>{s.action}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 500, whiteSpace: 'nowrap' }}>
                {s.name} {i + 1}/{STEPS.length}
              </span>
              <div style={{ flex: 1, display: 'flex', gap: 3 }} aria-hidden="true">
                {STEPS.map((st, k) => (
                  <span
                    key={st.name}
                    style={{ flex: st.weight, height: 4, borderRadius: 2, position: 'relative', overflow: 'hidden', background: k < i ? 'var(--ink)' : '#DDDDDD' }}
                  >
                    {k === i && <span style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '36%', background: 'var(--accent)' }} />}
                  </span>
                ))}
              </div>
              <span style={{ fontSize: 14, whiteSpace: 'nowrap' }}>
                <b style={{ fontWeight: 500 }}>{REMAINING[i]}분</b> <span className="subtle">남음</span>
              </span>
            </div>
          </div>
          <VoiceButton />
        </MirrorPane>
      }
    >
      <Card style={{ padding: '16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span
            style={{
              width: 56,
              height: 56,
              flexShrink: 0,
              borderRadius: 14,
              border: '2px dashed var(--placeholder)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10,
              color: 'var(--ink-3)',
            }}
          >
            제품
          </span>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>{s.brand}</span>
            <span style={{ fontSize: 17 }}>{s.product}</span>
          </div>
        </div>
        <div style={{ fontSize: 14, color: 'var(--ink-2)' }}>{s.desc}</div>
      </Card>

      <Card variant="frost" fill style={{ padding: 18, gap: 10 }}>
        <span style={{ fontSize: 14, color: 'var(--ink-2)' }}>가이드 영상</span>
        <button
          type="button"
          aria-label="가이드 영상 재생"
          style={{ flex: 1, borderRadius: 18, background: '#EEEEEE', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'var(--ink-3)' }}
        >
          <Icon name="play" size={18} /> 영상 자리
        </button>
      </Card>

      <div className="btn-row" style={{ gap: 10 }}>
        <Button variant="white" disabled={i === 0} onClick={() => setI(i - 1)}>
          이전
        </Button>
        <Button style={{ flex: 2, fontWeight: 400 }} onClick={() => (i === STEPS.length - 1 ? navigate('/mirror/makeup/done') : setI(i + 1))}>
          다음
        </Button>
      </div>
    </MirrorLayout>
  );
}

const RESULTS = [
  { name: '베이스', min: 6, ok: true },
  { name: '아이', min: 5, ok: true },
  { name: '블러셔', min: 3, ok: false },
  { name: '립', min: 4, ok: true },
];

/** 6i · 메이크업 완료 — 결과 체크 + 단계별 결과 */
export function MakeupDone() {
  const navigate = useNavigate();
  const [view, setView] = useState('결과 체크');
  return (
    <MirrorLayout
      nav="makeup"
      mirror={
        <MirrorPane faceTop={170}>
          {view === '결과 체크' && (
            <>
              <FaceTag left="calc(50% - 250px)" top={300} title="블러셔 · 오른쪽" sub="조금 높아요 · 1cm 아래로" accent />
              <span
                aria-hidden="true"
                style={{ position: 'absolute', left: 'calc(50% - 110px)', top: 285, width: 44, height: 30, borderRadius: '50%', border: '2px solid var(--accent)' }}
              />
              <FaceTag left="calc(50% + 120px)" top={250} title="베이스 · 균일 ✓" />
              <FaceTag left="calc(50% + 100px)" top={380} title="립 · 좌우 대칭 ✓" />
            </>
          )}
          <Corner at="tl">
            <Segmented variant="ink" label="거울 보기" options={['거울', '결과 체크']} value={view} onChange={setView} />
          </Corner>
        </MirrorPane>
      }
    >
      <Card lg style={{ padding: '20px 22px', gap: 6 }}>
        <span className="card-label">메이크업 완료</span>
        <span className="number">
          18분 <span style={{ fontSize: 15, color: 'var(--ink-3)' }}>/ 예상 20분</span>
        </span>
        <span style={{ fontSize: 15, color: 'var(--accent)' }}>4단계 중 3단계 좋아요 · 1곳 보정 권장</span>
      </Card>

      <Card>
        <span style={{ fontSize: 14, color: 'var(--ink-2)' }}>단계별 결과</span>
        {RESULTS.map((r, k) => (
          <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 16, padding: '6px 0' }}>
            <StepBadge variant={r.ok ? 'done' : 'fill'}>{r.ok ? <Icon name="check" size={12} strokeWidth={3} /> : '!'}</StepBadge>
            <span style={{ flex: 1 }}>
              {k + 1}. {r.name}
            </span>
            <span className="step-row__time">{r.min}분</span>
          </div>
        ))}
      </Card>

      <Card>
        <span style={{ fontSize: 14, color: 'var(--ink-2)' }}>오늘 사용한 제품</span>
        <span style={{ fontSize: 15 }}>4개 · 피부 기록에 자동 저장</span>
      </Card>

      <div className="btn-row push">
        <Button variant="outline" size="md">
          사진 저장
        </Button>
        <Button size="md" onClick={() => navigate('/mirror/makeup/progress')}>
          보정하기
        </Button>
      </div>
    </MirrorLayout>
  );
}
