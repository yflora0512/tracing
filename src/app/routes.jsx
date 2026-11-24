import Home from '../mirror/screens/Home.jsx';
import { MakeupStart, SkinNight } from '../mirror/screens/DayNight.jsx';
import { MakeupDone, MakeupProgress } from '../mirror/screens/Makeup.jsx';
import { CareTonight, Scan, SkinRecord } from '../mirror/screens/Skin.jsx';
import { Analysis, Changes, ProductRegister, RoutineEdit } from '../mirror/screens/Data.jsx';
import { AppChanges, AppHome, AppProducts, AppRoutine, AppSkin } from '../mobile/screens/Tabs.jsx';
import { MirrorDone, MirrorRemote, SendToMirror } from '../mobile/screens/MirrorLink.jsx';
import { AppProductNew, AppSettings } from '../mobile/screens/Device.jsx';

const MIRROR = { w: 1440, h: 817 };
const PHONE = { w: 390, h: 844 };
const DEVICE = { w: 390, h: 800 };

/** Every screen, in flow order — drives the router, the index page and prev/next. */
export const SCREENS = [
  // 거울 · Day / Night 흐름
  { path: '/mirror', group: '거울 · Day / Night 흐름', title: '홈 · Day / Night', ref: '9a · 9b', size: MIRROR, element: <Home /> },
  { path: '/mirror/makeup', group: '거울 · Day / Night 흐름', title: '메이크업 탭 · 출근 시간 맞춤', ref: '9c', size: MIRROR, element: <MakeupStart /> },
  { path: '/mirror/skin', group: '거울 · Day / Night 흐름', title: '피부 탭 · Night 관리', ref: '9d', size: MIRROR, element: <SkinNight /> },
  // 거울 · 메이크업
  { path: '/mirror/makeup/progress', group: '거울 · 메이크업', title: '메이크업 진행', ref: '4zb', size: MIRROR, element: <MakeupProgress /> },
  { path: '/mirror/makeup/done', group: '거울 · 메이크업', title: '메이크업 완료', ref: '6i', size: MIRROR, element: <MakeupDone /> },
  // 거울 · 관리
  { path: '/mirror/care', group: '거울 · 관리', title: '오늘 밤 관리', ref: 'm1', size: MIRROR, element: <CareTonight /> },
  { path: '/mirror/scan', group: '거울 · 관리', title: '피부 스캔 · 준비 → 진행 → 결과', ref: '5a · 5b · 5c', size: MIRROR, element: <Scan /> },
  { path: '/mirror/analysis', group: '거울 · 관리', title: '피부 분석 결과', ref: '8l', size: MIRROR, element: <Analysis /> },
  { path: '/mirror/record', group: '거울 · 관리', title: '피부 기록', ref: '4b', size: MIRROR, element: <SkinRecord /> },
  // 거울 · 데이터 · 설정
  { path: '/mirror/changes', group: '거울 · 변화 · 루틴 · 설정', title: '변화 · 피부 · 제품 데이터', ref: 'v1', size: MIRROR, element: <Changes /> },
  { path: '/mirror/routine', group: '거울 · 변화 · 루틴 · 설정', title: '루틴 편집', ref: 'r4', size: MIRROR, element: <RoutineEdit /> },
  { path: '/mirror/products/new', group: '거울 · 변화 · 루틴 · 설정', title: '제품 등록', ref: '6a', size: MIRROR, element: <ProductRegister /> },
  // 앱
  { path: '/app', group: '앱 · 모바일 A7', title: '홈', ref: 'g1b', size: PHONE, element: <AppHome /> },
  { path: '/app/skin', group: '앱 · 모바일 A7', title: '피부', ref: 'g2', size: PHONE, element: <AppSkin /> },
  { path: '/app/changes', group: '앱 · 모바일 A7', title: '변화', ref: 'g3', size: PHONE, element: <AppChanges /> },
  { path: '/app/routine', group: '앱 · 모바일 A7', title: '루틴', ref: 'g4', size: PHONE, element: <AppRoutine /> },
  { path: '/app/products', group: '앱 · 모바일 A7', title: '제품', ref: 'g5', size: PHONE, element: <AppProducts /> },
  { path: '/app/products/new', group: '앱 · 모바일 A7', title: '제품 등록', ref: '6g', size: DEVICE, element: <AppProductNew /> },
  { path: '/app/settings', group: '앱 · 모바일 A7', title: '설정', ref: '9e', size: DEVICE, element: <AppSettings /> },
  // 앱 · 미러 연동
  { path: '/app/mirror', group: '앱 · 미러 연동', title: '거울로 보내기', ref: 'g7', size: PHONE, element: <SendToMirror /> },
  { path: '/app/mirror/live', group: '앱 · 미러 연동', title: '진행 중 리모컨', ref: 'g8', size: PHONE, element: <MirrorRemote /> },
  { path: '/app/mirror/done', group: '앱 · 미러 연동', title: '완료 기록 수신', ref: 'g9', size: PHONE, element: <MirrorDone /> },
];
