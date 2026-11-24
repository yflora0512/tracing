import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Route, Routes } from 'react-router-dom';
import './styles/global.css';
import { AppStateProvider } from './app/AppState.jsx';
import { SCREENS } from './app/routes.jsx';
import Stage from './app/Stage.jsx';
import Gallery from './app/Gallery.jsx';
import Showing from './show/Showing.jsx';

/** Hash routes (#/screens, #/mirror…) open the prototype; anything else is the showing page. */
const isPrototype = (hash) => /^#\/(screens|mirror|app)/.test(hash);

function Root() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const onHash = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // The showing page embeds live screens, each in its own MemoryRouter, so it must sit outside any router.
  if (!isPrototype(hash)) return <Showing />;

  return (
    <AppStateProvider>
      <HashRouter>
        <Routes>
          <Route path="/screens" element={<Gallery />} />
          {SCREENS.map((s) => (
            <Route key={s.path} path={s.path} element={<Stage screen={s} />} />
          ))}
        </Routes>
      </HashRouter>
    </AppStateProvider>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
