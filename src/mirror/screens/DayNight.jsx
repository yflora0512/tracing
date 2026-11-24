import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardLabel, StepList } from '../../components/ui/index.jsx';
import { useAutoMode } from '../../app/AppState.jsx';
import MirrorLayout from '../MirrorLayout.jsx';
import SkinMirror from './SkinMirror.jsx';

const MAKEUP = [
  { name: '수분 프라이머', min: 2, added: true },
  { name: '베이스', min: 6 },
  { name: '블러셔', min: 4 },
  { name: '립', min: 3 },
];

/** 9c · 메이크업 탭 첫 화면 (Day) · 출근 시간 맞춤 + 오늘의 화장 */
export function MakeupStart() {
  useAutoMode('day');
  const navigate = useNavigate();
  return (
    <MirrorLayout modeSwitch nav="makeup" mirror={<SkinMirror />}>
      <Card style={{ gap: 6 }}>
        <span className="card-label">출근까지</span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span className="display">50분</span>
          <span style={{ fontSize: 14, color: 'var(--ink-2)' }}>09:00 출근</span>
        </div>
        <div style={{ position: 'relative', height: 6, marginTop: 14, borderRadius: 3, background: '#E6E6E6' }}>
          <span style={{ position: 'absolute', left: '8%', width: '50%', top: 0, bottom: 0, borderRadius: 3, background: 'var(--accent)' }} />
          <span
            style={{ position: 'absolute', left: 0, top: '50%', width: 10, height: 10, margin: '-5px 0 0 -2px', borderRadius: '50%', background: 'var(--ink)' }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--ink-3)' }}>
          <span>지금 08:10</span>
          <span className="accent">화장 20분</span>
          <span>출발 08:40</span>
        </div>
      </Card>

      <Card fill>
        <CardLabel right="4단계 · 20분">오늘의 화장</CardLabel>
        <StepList steps={MAKEUP} />
        <span className="card-note">어제 저녁 볼 건조가 기록돼서 프라이머 단계를 넣었어요</span>
      </Card>

      <Button className="push" onClick={() => navigate('/mirror/makeup/progress')}>
        메이크업 시작
      </Button>
    </MirrorLayout>
  );
}

const CARE = [
  { name: '클렌징', min: 3 },
  { name: '토너', min: 1 },
  { name: '수분 세럼 · 볼 집중', min: 3, added: true },
  { name: '수분 크림', min: 2 },
];

/** 9d · 피부 탭 Night 관리 · 오늘 피부 + 관리 순서 + 내일 루틴 */
export function SkinNight() {
  useAutoMode('night');
  const navigate = useNavigate();
  const [applied, setApplied] = useState(false);
  return (
    <MirrorLayout modeSwitch nav="skin" mirror={<SkinMirror />}>
      <Card style={{ gap: 8 }}>
        <span className="card-label">오늘 피부</span>
        <span className="headline">
          볼이 <span className="accent">건조해요</span>
        </span>
        <span className="card-meta">아침 화장 기록 · 블러셔 오른쪽 보정 1회</span>
      </Card>

      <Card fill>
        <CardLabel right="4단계 · 12분">맞춤 관리 순서</CardLabel>
        <StepList steps={CARE} />
      </Card>

      <Card style={{ gap: 10 }}>
        <span className="card-label">내일 루틴 제안</span>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 16, lineHeight: 1.4 }}>아침에 수분 프라이머 추가</span>
          <Button variant="tint" size="sm" onClick={() => setApplied(true)} aria-pressed={applied}>
            {applied ? '적용됨' : '적용'}
          </Button>
        </div>
      </Card>

      <Button className="push" onClick={() => navigate('/mirror/scan')}>
        피부 확인 시작
      </Button>
    </MirrorLayout>
  );
}
