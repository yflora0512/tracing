import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/Icon.jsx';
import { Button } from '../../components/ui/index.jsx';
import { IconButton, MCard, Phone, Radio, SubBar } from '../MobileKit.jsx';

const OPTIONS = [
  ['아침 · 출근 메이크업', '6단계 · 19분'],
  ['저녁 · 볼 수분 관리', '4단계 · 6분'],
  ['피부 스캔만', '1분'],
];

/** g7 · 미러 연동 · 거울로 보내기 */
export function SendToMirror() {
  const navigate = useNavigate();
  const [sel, setSel] = useState(0);
  return (
    <Phone>
      <SubBar title="거울에서 시작" />
      <MCard style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: '14px 20px' }}>
        <span className="accent">
          <Icon name="mirror" size={22} />
        </span>
        <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <span style={{ fontSize: 15, fontWeight: 600 }}>Trac:ing 미러 · 욕실</span>
          <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>같은 Wi-Fi · 연결됨</span>
        </span>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }} />
      </MCard>
      <div style={{ padding: '24px 20px 8px', fontSize: 13, color: 'var(--ink-3)' }}>무엇을 시작할까요?</div>
      <div role="radiogroup" aria-label="시작할 루틴" style={{ margin: '0 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {OPTIONS.map(([t, s], i) => (
          <button
            type="button"
            role="radio"
            aria-checked={sel === i}
            key={t}
            onClick={() => setSel(i)}
            className={sel === i ? undefined : 'm-glass'}
            style={{
              padding: '18px 20px',
              borderRadius: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              textAlign: 'left',
              ...(sel === i ? { background: '#fff', boxShadow: 'inset 0 0 0 2px var(--accent)' } : {}),
            }}
          >
            <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 16, fontWeight: 600 }}>{t}</span>
              <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>{s}</span>
            </span>
            <Radio state={sel === i ? 'on' : undefined} />
          </button>
        ))}
      </div>
      <MCard variant="list" style={{ padding: '4px 20px' }}>
        <div className="m-row" style={{ borderColor: 'rgba(0,0,0,.05)' }}>
          <span style={{ fontSize: 15 }}>음성 안내</span>
          <span style={{ fontSize: 14, color: 'var(--ink-3)' }}>켜짐 ›</span>
        </div>
        <div className="m-row" style={{ paddingBottom: 14 }}>
          <span style={{ fontSize: 15 }}>거울 밝기</span>
          <span style={{ fontSize: 14, color: 'var(--ink-3)' }}>자동 ›</span>
        </div>
      </MCard>
      <div className="m-bottom" style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>거울 앞에 서면 바로 시작돼요</span>
        <Button style={{ width: '100%', padding: '18px 0', fontSize: 16, fontWeight: 600 }} onClick={() => navigate('/app/mirror/live')}>
          거울로 보내기
        </Button>
      </div>
    </Phone>
  );
}

const LIVE_STEPS = ['스킨케어', '선크림', '베이스', '블러셔', '아이', '립'];

/** g8 · 미러 연동 · 진행 중 리모컨 */
export function MirrorRemote() {
  const navigate = useNavigate();
  const [cur, setCur] = useState(3);
  const [paused, setPaused] = useState(false);
  return (
    <Phone>
      <SubBar title="거울 진행 중" action={<IconButton icon="close" label="종료" onClick={() => navigate('/app/mirror/done')} />} />
      <MCard style={{ margin: '16px 20px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ padding: '6px 12px', borderRadius: 999, background: 'var(--accent-soft)', color: 'var(--accent)', fontSize: 12, fontWeight: 600 }}>
            {paused ? '일시정지' : '거울에서 안내 중'}
          </span>
          <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>
            {cur + 1} / {LIVE_STEPS.length}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>지금 단계</span>
            <span style={{ fontSize: 28, fontWeight: 600 }}>{LIVE_STEPS[cur]}</span>
          </span>
          <span style={{ fontSize: 44, fontWeight: 200, lineHeight: 1 }}>2:40</span>
        </div>
        <div style={{ display: 'flex', gap: 4 }} aria-hidden="true">
          {LIVE_STEPS.map((s, i) => (
            <span key={s} style={{ flex: 1, height: 5, borderRadius: 3, background: i <= cur ? 'var(--accent)' : '#E2E6EA', opacity: i === cur ? 0.5 : 1 }} />
          ))}
        </div>
        <span style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.5 }}>"광대 위로 톡톡 두드려 주세요"</span>
      </MCard>
      <MCard variant="list" style={{ padding: '6px 20px' }}>
        {LIVE_STEPS.map((s, i) => (
          <div key={s} className="m-row" style={{ justifyContent: 'flex-start', padding: '10px 0', borderColor: 'rgba(0,0,0,.05)' }}>
            <Radio small state={i < cur ? 'on' : i === cur ? 'current' : undefined} />
            <span style={{ flex: 1, fontSize: 15, fontWeight: i === cur ? 600 : 400, color: i < cur ? 'var(--ink-3)' : 'var(--ink)' }}>{s}</span>
          </div>
        ))}
      </MCard>
      <div className="m-bottom m-glass" style={{ padding: 10, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <IconButton bare icon="prev" label="이전 단계" onClick={() => setCur(Math.max(0, cur - 1))} />
        <IconButton bare icon="mic" label="음성 명령" />
        <button
          type="button"
          aria-label={paused ? '재생' : '일시정지'}
          onClick={() => setPaused(!paused)}
          style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon name={paused ? 'play' : 'pause'} size={22} />
        </button>
        <IconButton bare icon="next" label="다음 단계" onClick={() => (cur === LIVE_STEPS.length - 1 ? navigate('/app/mirror/done') : setCur(cur + 1))} />
        <button type="button" style={{ width: 44, height: 44, fontSize: 13, color: 'var(--ink-2)' }}>
          +1분
        </button>
      </div>
    </Phone>
  );
}

/** g9 · 미러 연동 · 완료 기록 수신 */
export function MirrorDone() {
  const navigate = useNavigate();
  return (
    <Phone>
      <SubBar title="거울 기록 도착" back="/app" />
      <MCard style={{ margin: '16px 20px 0', padding: '24px 20px', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="check" size={24} strokeWidth={2.4} />
        </span>
        <span style={{ fontSize: 22, fontWeight: 600 }}>아침 메이크업 완료</span>
        <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>07:50 – 08:09 · 19분</span>
      </MCard>
      <div style={{ margin: '12px 20px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          ['피부 점수', '82', '+3'],
          ['수분', '42%', '+2'],
        ].map(([l, v, d]) => (
          <div key={l} className="m-glass" style={{ padding: 20, borderRadius: 24, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>{l}</span>
            <span style={{ fontSize: 32, fontWeight: 300 }}>{v}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>{d}</span>
          </div>
        ))}
      </div>
      <MCard variant="list" style={{ padding: '6px 20px' }}>
        {[
          ['사용한 제품', '5개'],
          ['건너뛴 단계', '아이'],
          ['메이크업 사진', '거울에 저장'],
        ].map(([l, v]) => (
          <div key={l} className="m-row" style={{ borderColor: 'rgba(0,0,0,.05)', paddingBottom: 14 }}>
            <span style={{ fontSize: 15 }}>{l}</span>
            <span style={{ fontSize: 14, color: 'var(--ink-3)' }}>{v}</span>
          </div>
        ))}
      </MCard>
      <div className="m-bottom btn-row" style={{ gap: 10 }}>
        <Button variant="white" className="m-glass" style={{ padding: '18px 0', fontSize: 15 }} onClick={() => navigate('/app/changes')}>
          변화 보기
        </Button>
        <Button style={{ padding: '18px 0', fontSize: 15, fontWeight: 600 }} onClick={() => navigate('/app')}>
          확인
        </Button>
      </div>
    </Phone>
  );
}
