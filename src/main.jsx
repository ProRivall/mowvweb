if (import.meta.env.DEV && typeof window !== 'undefined') {
  const patchDevtoolsHook = () => {
    const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!hook || hook.__patchedByMowv) return;
    const { registerRenderer } = hook;
    if (typeof registerRenderer !== 'function') return;
    hook.registerRenderer = function patchedRegisterRenderer(renderer, onCommit, onCommitUnmount) {
      try {
        return registerRenderer.call(this, renderer, onCommit, onCommitUnmount);
      } catch (error) {
        console.warn('React DevTools registerRenderer failed', error);
        return {
          rendererID: -1,
          onCommitFiberRoot: () => {},
          onCommitFiberUnmount: () => {},
          deregister: () => {},
        };
      }
    };
    hook.__patchedByMowv = true;
  };

  if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    patchDevtoolsHook();
  } else {
    const observer = new MutationObserver(() => {
      if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
        patchDevtoolsHook();
        observer.disconnect();
      }
    });
    observer.observe(document.documentElement, { childList: true });
    setTimeout(() => observer.disconnect(), 3000);
  }
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
