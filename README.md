# Trac:ing — 하루를 이어서 기억하는 거울

아침 출근부터 밤 관리까지, 나를 위한 탁상용 뷰티 미러 **Trac:ing**의 디자인 쇼잉 페이지와 인터랙티브 프로토타입입니다.

- 쇼잉 페이지: https://yflora0512.github.io/tracing/
- 전체 프로토타입(미러 12 · 앱 10 화면): https://yflora0512.github.io/tracing/#/screens
- 쇼잉 구성안: [docs/showing-plan.md](docs/showing-plan.md)

Interaction Design · 22565053 조윤정 · 김승언 교수님 · 2026

## 구조

```
src/
  show/        쇼잉 페이지 (Showing.jsx, 상태 전환 데모, 기기 연동 데모, 확대 뷰)
  mirror/      미러 화면 1440×817
  mobile/      모바일 앱 화면 390×844
  app/         프로토타입 갤러리 · 라우트
public/show/   Figma 최종작업 프레임 내보내기 (4x)
```

## 실행

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # dist/
```

## 배포

GitHub Pages(`gh-pages` 브랜치)로 배포합니다. 로컬에 git이 없어도 GitHub CLI 로그인만 되어 있으면 됩니다.

```bash
npm run deploy     # build → main에 소스, gh-pages에 dist 업로드
```
