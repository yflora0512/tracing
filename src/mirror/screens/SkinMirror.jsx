import { useState } from 'react';
import { Segmented } from '../../components/ui/index.jsx';
import { Corner, FaceTag, MirrorPane, VoiceButton, ZoomControl } from '../MirrorLayout.jsx';

/** 거울 / 현재 피부 — shared mirror pane of the Day/Night flow (9a–9d) */
export default function SkinMirror() {
  const [view, setView] = useState('현재 피부');
  const showSkin = view === '현재 피부';
  return (
    <MirrorPane reflection>
      {showSkin && (
        <>
          <FaceTag left="calc(50% - 240px)" top={280} title="볼 · 건조" sub="3일 연속 ▼" accent />
          <FaceTag left="calc(50% + 50px)" top={180} title="T존 · 보통" sub="변화 없음" />
          <FaceTag left="calc(50% + 110px)" top={320} title="트러블 · 없음" />
          <Corner at="bl">어제 저녁 기록 기준 · 부위를 누르면 상세</Corner>
        </>
      )}
      <Corner at="tl">
        <Segmented label="거울 보기" options={['거울', '현재 피부']} value={view} onChange={setView} />
      </Corner>
      <VoiceButton />
      <ZoomControl />
    </MirrorPane>
  );
}
