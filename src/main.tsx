import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

// 프리렌더가 굳힌 본문은 JS 없는 읽기(미리보기·크롤러)용이다.
// hydrate 는 DOM 스냅숏의 텍스트 노드 경계 문제로 mismatch 가 나므로,
// 비우고 새로 그린다 — 같은 화면을 한 프레임에 다시 그릴 뿐이다.
const rootEl = document.getElementById('root')!;
if (rootEl.childElementCount > 0) rootEl.replaceChildren();
createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
