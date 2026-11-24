import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import { SCREENS } from './routes.jsx';
import './app.css';

/** Index of every implemented screen, grouped by section. */
export default function Gallery() {
  const groups = SCREENS.reduce((acc, s) => {
    (acc[s.group] ||= []).push(s);
    return acc;
  }, {});

  return (
    <div className="gallery">
      <header className="gallery__head">
        <img src={`${import.meta.env.BASE_URL}logo-tracing.png`} alt="Trac:ing" width="92" height="25" />
        <h1 className="gallery__title">트레이싱 거울 · 모바일</h1>
        <p className="gallery__sub">섹션별 최신 시안 {SCREENS.length}개 화면 · 거울 1440×817 · 앱 390×844</p>
        <a className="gallery__back" href="#">← 쇼잉 페이지로</a>
      </header>
      {Object.entries(groups).map(([group, items], gi) => (
        <section key={group} className="gallery__section">
          <h2 className="gallery__h2">
            <span className="gallery__num">{String(gi + 1).padStart(2, '0')}</span>
            {group}
          </h2>
          <div className="gallery__grid">
            {items.map((s) => (
              <Link key={s.path} to={s.path} className="gallery__card">
                <span className="gallery__ref">{s.ref}</span>
                <span className="gallery__name">{s.title}</span>
                <span className="gallery__meta">
                  {s.size.w}×{s.size.h}
                  <Icon name="arrowUpRight" size={18} />
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
