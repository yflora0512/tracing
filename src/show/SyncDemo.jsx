import { useCallback, useState } from 'react';
import LiveScreen from './LiveScreen.jsx';
import { asset } from './parts.jsx';

const STAGES = [
  {
    key: 'wait',
    phone: '루틴 선택',
    mirror: '대기',
    note: '앱에서 시작할 루틴을 고르고 ‘거울로 보내기’를 누르세요.',
    log: '앱 · 같은 Wi-Fi의 Trac:ing 미러(욕실)와 연결됨',
  },
  {
    key: 'live',
    phone: '진행 중 리모컨',
    mirror: '단계별 메이크업 안내',
    note: '거울은 얼굴 앞에서 ‘지금 할 행동’만 안내하고, 폰은 이전·일시정지·다음·+1분 리모컨이 됩니다. 마지막 단계에서 다음(또는 ✕)을 누르세요.',
    log: '앱 → 거울 · 아침 출근 메이크업 6단계 전송, 거울에서 안내 시작',
  },
  {
    key: 'done',
    phone: '완료 기록 수신',
    mirror: '결과 체크',
    note: '거울은 보정할 부위를 얼굴 위에 표시하고, 폰에는 소요 시간·피부 점수·사용 제품이 기록으로 도착합니다.',
    log: '거울 → 앱 · 아침 메이크업 완료 기록 도착 (19분 · 피부 점수 82)',
  },
  {
    key: 'saved',
    phone: '홈 · 변화',
    mirror: '기록 반영',
    note: '확인한 기록은 저녁 피부 확인과 내일 루틴 제안으로 이어집니다.',
    log: '기록 저장 · 저녁 관리(Connect)로 연결',
  },
];

const stageOf = (path) => (path === '/app/mirror' ? 0 : path === '/app/mirror/live' ? 1 : path === '/app/mirror/done' ? 2 : 3);

/** Live phone (real prototype) drives the mirror next to it. */
export default function SyncDemo() {
  const [run, setRun] = useState(0);
  const [stage, setStage] = useState(0);
  const [log, setLog] = useState([STAGES[0].log]);

  const onPath = useCallback((p) => {
    const n = stageOf(p);
    setStage(n);
    setLog((l) => (l[l.length - 1] === STAGES[n].log ? l : [...l, STAGES[n].log].slice(-4)));
  }, []);

  const reset = () => {
    setRun((r) => r + 1);
    setStage(0);
    setLog([STAGES[0].log]);
  };

  const st = STAGES[stage];

  return (
    <div className="sync">
      <div className="sync__devices">
        <figure className="sync__mirror">
          <figcaption className="device-label">
            <span className="device-label__dot" /> Mirror · <b>{st.mirror}</b>
          </figcaption>
          <div className="sync__mirror-frame">
            {stage === 2 ? (
              <LiveScreen key={`m${run}`} path="/mirror/makeup/done" w={1440} h={817} className="sync__mirror-live" />
            ) : (
              <img src={asset(stage === 1 ? 'makeup.png' : 'home.png')} alt={`거울 화면 · ${st.mirror}`} className={stage === 0 ? 'is-idle' : ''} />
            )}
            {stage === 0 && <span className="sync__badge">앱에서 보낼 루틴을 기다리는 중</span>}
            {stage === 3 && <span className="sync__badge sync__badge--ok">✓ 아침 기록 저장 · 저녁 관리로 연결</span>}
          </div>
        </figure>

        <div className="sync__link" aria-hidden="true">
          <span className={`sync__pulse ${stage === 1 || stage === 2 ? 'is-on' : ''}`} />
        </div>

        <figure className="sync__phone">
          <figcaption className="device-label">
            <span className="device-label__dot device-label__dot--phone" /> Mobile · <b>{st.phone}</b>
          </figcaption>
          <div className="sync__phone-frame">
            <LiveScreen key={`p${run}`} path="/app/mirror" w={390} h={844} onPath={onPath} label="조작 가능한 모바일 앱 화면" />
          </div>
        </figure>
      </div>

      <div className="sync__panel">
        <ol className="sync__stages">
          {STAGES.map((s, k) => (
            <li key={s.key} className={k === stage ? 'is-on' : k < stage ? 'is-done' : ''}>
              <span>{String(k + 1).padStart(2, '0')}</span>
              {s.phone} <i>↔</i> {s.mirror}
            </li>
          ))}
        </ol>
        <p className="sync__note" aria-live="polite">
          {st.note}
        </p>
        <ul className="sync__log" aria-label="기기 간 전달 기록">
          {log.map((l, k) => (
            <li key={`${k}-${l}`}>{l}</li>
          ))}
        </ul>
        <button type="button" className="btn-ghost" onClick={reset}>
          처음부터 다시
        </button>
      </div>
    </div>
  );
}
