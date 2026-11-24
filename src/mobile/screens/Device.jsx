import { Button, ChipGroup, Segmented, Toggle } from '../../components/ui/index.jsx';
import { Device } from '../MobileKit.jsx';

const glassCard = { padding: '16px 18px', gap: 0 };

function SettingRow({ label, value, tone, toggle, first }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: 44,
        borderTop: first ? 0 : '1px solid var(--line)',
        fontSize: 16,
      }}
    >
      <span>{label}</span>
      {toggle ? <Toggle label={label} /> : <span style={{ fontSize: 14, color: tone === 'accent' ? 'var(--accent)' : 'var(--ink-2)' }}>{value}</span>}
    </div>
  );
}

/** 9e · 설정 (모바일) · 출근 준비 항목 추가 */
export function AppSettings() {
  return (
    <Device title="설정">
      <div className="card card--glass" style={glassCard}>
        <button type="button" style={{ display: 'flex', gap: 12, alignItems: 'center', paddingBottom: 12, textAlign: 'left' }}>
          <span style={{ width: 48, height: 48, borderRadius: '50%', border: '2px dashed var(--placeholder)' }} />
          <span style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <span style={{ fontSize: 18 }}>지수님</span>
            <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>건성 · 민감</span>
          </span>
          <span>›</span>
        </button>
        <SettingRow label="거울 연결" value="연결됨" tone="accent" />
      </div>

      <span className="device__section">출근 준비 · Day</span>
      <div style={{ display: 'flex', flexDirection: 'column', padding: '4px 18px', borderRadius: 22, background: '#fff' }}>
        <SettingRow first label="출근 시간" value="평일 09:00" tone="accent" />
        <SettingRow label="준비 시작 알림" value="50분 전" tone="accent" />
        <SettingRow label="Night 전환" value="21:00 · 자동" />
      </div>

      <span className="device__section">알림</span>
      <div className="card card--glass" style={{ ...glassCard, paddingTop: 4, paddingBottom: 4 }}>
        <SettingRow first label="피부 변화 알림" toggle />
        <SettingRow label="루틴 시작 알림" toggle />
      </div>

      <span className="device__section">일반</span>
      <div className="card card--glass" style={{ ...glassCard, paddingTop: 4, paddingBottom: 4 }}>
        <SettingRow first label="음성 AI" value="켜짐" />
        <SettingRow label="개인정보 · 사진 보관" value="›" />
        <SettingRow label="저장 공간" value="38%" />
      </div>
    </Device>
  );
}

/** 6g · 제품 등록 (폰 카메라로 인식) · 글라스 카드 */
export function AppProductNew() {
  return (
    <Device title="제품 등록">
      <div
        style={{
          position: 'relative',
          height: 260,
          borderRadius: 28,
          background: '#DADADA',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--ink-3)',
          fontSize: 14,
          flexShrink: 0,
        }}
      >
        카메라
        <span aria-hidden="true" style={{ position: 'absolute', inset: '30px 70px', border: '3px solid var(--accent)', borderRadius: 20 }} />
        <span
          style={{
            position: 'absolute',
            bottom: 12,
            padding: '6px 14px',
            borderRadius: 999,
            background: 'rgba(255,255,255,.5)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            color: 'var(--ink)',
            fontSize: 13,
          }}
        >
          라벨이 보이게 비춰주세요
        </span>
      </div>
      <Segmented variant="block" label="등록 방식" options={['카메라', '바코드', '직접 입력']} />
      <div className="card card--glass" style={{ padding: '16px 18px', gap: 10 }}>
        <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 500 }}>인식됨 · 확인해 주세요</span>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ width: 48, height: 48, flexShrink: 0, borderRadius: 12, border: '2px dashed var(--placeholder)' }} />
          <span style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>브랜드명</span>
            <span style={{ fontSize: 17 }}>크림 블러셔 03 코랄</span>
          </span>
        </div>
        <ChipGroup multiple options={['블러셔', '크림', '아침 루틴']} defaultValue={['블러셔', '크림']} />
      </div>
      <div className="btn-row" style={{ marginTop: 'auto' }}>
        <Button variant="outline" style={{ padding: '15px 0', fontSize: 16 }}>
          다시 찍기
        </Button>
        <Button style={{ padding: '15px 0', fontSize: 16 }}>파우치에 추가</Button>
      </div>
    </Device>
  );
}
