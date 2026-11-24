import { useState } from 'react';
import { Reveal, asset } from './parts.jsx';
import { AiTag } from './Photo.jsx';

/* Product-page style explanation (ref. Stella Beauté BFS):
   verb headline slides with benefit tags + core-tech callout + “View More”,
   numbered how-to steps, spec table, FAQ. */

const FEATURES = [
  {
    verb: ['맞추다,', '출근 시간에.'],
    en: 'Fit Time',
    sub: '출근 시각에서 거꾸로 계산해, 거울이 먼저 시작 시각과 단계별 시간을 정해 줍니다.',
    tags: ['#출근 시각 기준', '#단계별 남은 시간', '#종료 10분·5분 전 음성'],
    core: ['Time Fitting', '루틴 단계 × 소요 시간으로 시작 시각을 계산'],
    more: '오늘의 루틴(기초 → 눈썹 → 아이 → 블러셔 → 립)과 각 단계의 소요 시간을 더해 시작 시각을 정합니다. 진행 중에는 단계별 남은 시간을 바 하나로 보여 주고, 화장 종료 10분·5분 전에는 음성으로 알려 시계를 따로 보지 않아도 됩니다.',
    img: 'home.png',
    alt: '아침 홈 화면',
  },
  {
    verb: ['따라 하다,', '한 줄만.'],
    en: 'Follow',
    sub: '얼굴 앞에는 지금 할 행동 한 줄만. 제품과 시범 영상은 얼굴 밖 패널로 옮겼습니다.',
    tags: ['#행동 한 줄', '#제품 매칭', '#가이드 영상'],
    core: ['One-line Guide', '위치 · 행동 · 강도를 한 문장으로'],
    more: '“광대 위쪽에 가볍게 두드려요”처럼 위치(광대 위쪽) · 행동(두드리기) · 강도(가볍게)를 한 문장에 담고, 강조어만 파란색으로 표시합니다. 사용하는 제품이 피부 기록과 맞는지(건조 피부 OK)도 함께 보여 줍니다.',
    img: 'makeup.png',
    alt: '메이크업 진행 화면',
  },
  {
    verb: ['재다,', '부위별로.'],
    en: 'Check',
    sub: '세안 후 거울 앞에 앉으면 볼 → T존 → 턱 순서로 측정하고, 결과를 겹친 원으로 보여 줍니다.',
    tags: ['#볼 · T존 · 턱', '#겹친 원', '#아침 기록 연결'],
    core: ['Layered Circles', '원 크기 = 범위, 겹칠수록 오래 진행'],
    more: '수분 · 유분 · 피부결과 종합 점수를 재고, 숫자보다 먼저 읽히도록 얼굴 위에 원으로 겹쳐 표시합니다. 아침에 쓴 제품과 쿠션 유지 시간(13시간)을 건조의 원인 후보로 연결해 보여 줍니다.',
    img: 'scan-result.png',
    alt: '스캔 결과 화면',
  },
  {
    verb: ['이어 가다,', '내일로.'],
    en: 'Review & Routine',
    sub: '쌓인 기록에서 변화를 찾고, 필요한 단계를 내일 아침 루틴에 더합니다.',
    tags: ['#변화 추이', '#AI 제안', '#루틴 자동 조정'],
    core: ['Daily Loop', '저녁 결과 → 다음 날 아침 루틴'],
    more: '“기초에 수분 앰플 1분을 더할까요?” 같은 제안을 ‘추가’하면 기초 단계가 3분 → 4분이 되고, 시작 시각이 07:50에서 07:49로 앞당겨집니다. 다음 날 아침 첫 화면이 바뀐 루틴으로 시작합니다.',
    img: 'routine.png',
    alt: '루틴 조정 화면',
  },
];

export function FeatureSlides() {
  const [i, setI] = useState(0);
  const [open, setOpen] = useState(false);
  const f = FEATURES[i];
  const go = (k) => {
    setI((k + FEATURES.length) % FEATURES.length);
    setOpen(false);
  };
  return (
    <div className="fs">
      <div className="fs__text" aria-live="polite">
        <p className="fs__count">
          <b>{String(i + 1).padStart(2, '0')}</b> / {String(FEATURES.length).padStart(2, '0')} · {f.en}
        </p>
        <h3 className="fs__verb" key={`v${i}`}>
          {f.verb[0]}
          <br />
          {f.verb[1]}
        </h3>
        <p className="fs__sub">{f.sub}</p>
        <ul className="fs__tags">
          {f.tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <div className="fs__core">
          <span>[ Core ]</span>
          <b>{f.core[0]}</b>
          <em>{f.core[1]}</em>
        </div>
        <button type="button" className="fs__more" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          {open ? 'Close' : 'View More'} <i aria-hidden="true">{open ? '−' : '+'}</i>
        </button>
        {open && <p className="fs__detail">{f.more}</p>}
      </div>
      <div className="fs__visual">
        <div className="fs__screen">
          {FEATURES.map((x, k) => (
            <img key={x.img} src={asset(x.img)} alt={k === i ? x.alt : ''} className={k === i ? 'is-on' : ''} loading="lazy" decoding="async" />
          ))}
        </div>
        <div className="fs__nav">
          <button type="button" onClick={() => go(i - 1)} aria-label="이전 기능">
            ←
          </button>
          {FEATURES.map((x, k) => (
            <button key={x.en} type="button" className={`fs__dot ${k === i ? 'is-on' : ''}`} onClick={() => go(k)} aria-label={`${k + 1}. ${x.en}`} />
          ))}
          <button type="button" onClick={() => go(i + 1)} aria-label="다음 기능">
            →
          </button>
        </div>
      </div>
    </div>
  );
}

const STEPS = [
  { v: '놓고, 연결하다', img: 'photo/phone.jpg', d: '책상이나 화장대 위에 거울을 두고, 폰 앱에서 같은 Wi-Fi의 Trac:ing 미러에 연결합니다. 출근 시각과 아침 루틴을 앱에서 정해 거울로 보냅니다.' },
  { v: '따라 하다', img: 'photo/morning.jpg', d: '아침에 거울 앞에 앉으면 홈 화면이 켜집니다. 얼굴 위 행동 한 줄을 따라 화장하고, 손이 바쁠 때는 음성이나 폰 리모컨으로 다음 단계로 넘깁니다.' },
  { v: '스캔하다', img: 'photo/night.jpg', d: '퇴근 후 세안하고 거울 앞에 앉아 얼굴을 틀에 맞춥니다. 볼 → T존 → 턱 순서로 측정이 자동으로 진행됩니다.' },
  { v: '확인하고, 이어 가다', img: 'photo/skin.jpg', pos: '100% 50%', d: '겹친 원과 수치로 오늘 피부를 확인하고 관리 코스를 시작합니다. 쌓인 기록은 변화 화면과 다음 날 루틴에 반영됩니다.' },
];

export function HowToUse() {
  return (
    <ol className="how">
      {STEPS.map((s, k) => (
        <Reveal as="li" className="how__step" key={s.v} delay={k * 80}>
          <div className="how__img">
            <img src={asset(s.img)} alt="" loading="lazy" decoding="async" style={s.pos ? { objectPosition: s.pos } : undefined} />
            <AiTag />
          </div>
          <span className="how__n">[ {String(k + 1).padStart(2, '0')} ]</span>
          <h3 className="how__v">{s.v}</h3>
          <p className="how__d">{s.d}</p>
        </Reveal>
      ))}
    </ol>
  );
}

const SPEC = [
  ['제품 구성', '탁상형 디스플레이 미러 + 연동 모바일 앱'],
  ['미러 UI', '1440 × 817 (가로형)'],
  ['모바일 UI', '390 × 844'],
  ['권장 사용 거리', '약 1m — UI 글자 크기 기준'],
  ['피부 측정', '볼 → T존 → 턱 순서 자동 측정 · 수분 / 유분 / 피부결 / 종합 점수'],
  ['안내 방식', '화면 행동 한 줄 + 음성 (화장 종료 10분·5분 전 알림, 음성 명령)'],
  ['연결', '같은 Wi-Fi의 폰 앱 — 루틴 보내기 · 리모컨 · 기록 수신'],
  ['크기 · 무게 · 센서 방식 · 전원', null],
];

const FAQ = [
  ['화장한 채로 스캔해도 되나요?', '날마다 같은 조건에서 비교하기 위해 세안 후 스캔을 기준으로 설계했습니다. 그래서 스캔은 퇴근 후 세안한 뒤(21:40 장면)에 이루어집니다.'],
  ['루틴에 단계를 더하면 시간은 어떻게 되나요?', '추가한 시간만큼 시작 시각이 앞당겨집니다. 예를 들어 기초에 수분 앰플 1분을 더하면 07:50 시작이 07:49로 바뀝니다.'],
  ['손에 화장품이 묻어 있을 때는 어떻게 조작하나요?', '거울을 직접 만지지 않아도 됩니다. 음성으로 다음 단계로 넘기거나, 폰 리모컨에서 ‘다음’ · ‘+1분’을 누르면 됩니다.'],
  ['기록은 어디에서 볼 수 있나요?', '거울의 변화 화면과 폰 앱 모두에서 볼 수 있습니다. 메이크업 결과와 스캔 결과는 끝나면 폰으로 전송됩니다.'],
  ['거울과 폰은 처음에 어떻게 연결하나요?', '앱에서 같은 Wi-Fi에 있는 Trac:ing 미러를 골라 연결합니다. 첫 연결(페어링) 과정의 화면은 아직 설계되지 않았습니다 — 추가 자료 필요.'],
];

export function SpecFaq() {
  const [open, setOpen] = useState(0);
  return (
    <div className="spec">
      <Reveal className="spec__col">
        <h3 className="spec__h">Specification</h3>
        <dl className="spec__table">
          {SPEC.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd className={v ? '' : 'is-need'}>{v || '추가 자료 필요 — 기획서에 정의되지 않음'}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
      <Reveal className="spec__col" delay={100}>
        <h3 className="spec__h">FAQ</h3>
        <ul className="faq">
          {FAQ.map(([q, a], k) => (
            <li key={q} className={k === open ? 'is-open' : ''}>
              <button type="button" aria-expanded={k === open} onClick={() => setOpen(k === open ? -1 : k)}>
                <span>Q</span>
                {q}
                <i aria-hidden="true">{k === open ? '−' : '+'}</i>
              </button>
              {k === open && <p>{a}</p>}
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}
