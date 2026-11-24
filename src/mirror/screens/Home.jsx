import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/Icon.jsx';
import { Banner, Card, Segmented, Tooltip } from '../../components/ui/index.jsx';
import { DayLabels, TrendLine, WeekBars } from '../../components/charts/index.jsx';
import { useAppState } from '../../app/AppState.jsx';
import MirrorLayout from '../MirrorLayout.jsx';
import SkinMirror from './SkinMirror.jsx';

const DAYS = ['금', '토', '일', '월', '화', '수', '오늘'];
const FOCUS = [
  [10, 19.7],
  [56.7, 22.7],
  [103.3, 18.3],
  [150, 28.5],
  [196.7, 34.4],
  [243.3, 41.7],
  [290, 49.1],
];

const METRICS = {
  수분: { status: '낮음', note: '▼ 3일 연속', bars: [70, 66, 72, 60, 52, 44, 32], today: 32, avg: 57, accent: true },
  유분: { status: '보통', note: '변화 없음', bars: [58, 60, 55, 62, 57, 59, 58], today: 58, avg: 58 },
  트러블: { status: '없음', note: '2일째 깨끗해요', bars: [30, 24, 20, 12, 8, 4, 2], today: 2, avg: 14 },
};

const BANNER = {
  day: { icon: 'sun', title: '출근까지 50분', sub: '오늘의 화장 4단계 · 20분', cta: '메이크업 시작', to: '/mirror/makeup' },
  night: { icon: 'moon', title: '오늘 피부 확인할 시간이에요', sub: '세안 후 스캔 · 약 2분', cta: '피부 확인', to: '/mirror/skin' },
};

/** 9a / 9b · 홈 Day · Night — 포커스 · 관심 지표 유지, 배너만 시간대별로 */
export default function Home() {
  const { mode } = useAppState();
  const navigate = useNavigate();
  const [metric, setMetric] = useState('수분');
  const m = METRICS[metric];
  const b = BANNER[mode];

  return (
    <MirrorLayout modeSwitch nav="home" mirror={<SkinMirror />}>
      <Banner icon={b.icon} title={b.title} sub={b.sub} cta={b.cta} onCta={() => navigate(b.to)} />

      <Card lg style={{ padding: '22px 26px 18px', gap: 10 }}>
        <div className="card-head" style={{ alignItems: 'center' }}>
          <span className="card-label">오늘의 포커스</span>
          <button type="button" aria-label="피부 분석 결과 보기" onClick={() => navigate('/mirror/analysis')}>
            <Icon name="arrowUpRight" size={22} />
          </button>
        </div>
        <div className="headline" style={{ marginBottom: 14 }}>
          볼이 계속 <span className="accent">건조해요</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
          <TrendLine points={FOCUS}>
            <Tooltip label="오늘" value="수분 42" style={{ right: 0, top: -6 }} />
          </TrendLine>
          <DayLabels days={DAYS} />
        </div>
      </Card>

      <Card variant="frost" fill style={{ padding: '20px 22px', gap: 10 }}>
        <div className="card-head" style={{ alignItems: 'center' }}>
          <span className="card-label">관심 지표</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Segmented size="sm" label="관심 지표" options={Object.keys(METRICS)} value={metric} onChange={setMetric} />
            <button
              type="button"
              aria-label="변화 보기"
              onClick={() => navigate('/mirror/changes')}
              style={{ display: 'flex', width: 32, height: 32, alignItems: 'center', justifyContent: 'center', color: 'var(--ink-soft)' }}
            >
              <Icon name="trendSmall" size={20} />
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span className="headline" style={{ color: m.accent ? 'var(--accent)' : undefined }}>
            {m.status}
          </span>
          <span style={{ fontSize: 13, color: m.accent ? 'var(--accent)' : 'var(--ink-3)' }}>{m.note}</span>
        </div>
        <WeekBars
          values={m.bars}
          days={DAYS}
          tooltip={
            <Tooltip label="오늘" style={{ right: 0, top: 4, gap: 2, fontSize: 11 }}>
              <span style={{ display: 'flex', gap: 10, justifyContent: 'space-between', color: 'var(--ink-soft)' }}>
                <span>● {metric}</span>
                <b style={{ fontWeight: 500, color: 'var(--ink)' }}>{m.today}</b>
              </span>
              <span style={{ display: 'flex', gap: 10, justifyContent: 'space-between', color: 'var(--ink-3)' }}>
                <span>주간 평균</span>
                <b style={{ fontWeight: 500, color: 'var(--ink)' }}>{m.avg}</b>
              </span>
            </Tooltip>
          }
        />
      </Card>
    </MirrorLayout>
  );
}
