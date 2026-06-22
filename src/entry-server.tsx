// SSR 進入點:供 build 時的預渲染腳本(scripts/prerender.mjs)呼叫,
// 用 react-dom/server 把 App 渲染成靜態 HTML 字串。不在瀏覽器執行。
import { renderToString } from 'react-dom/server';
import App from '@/App';

/** 將 App 渲染為 HTML 字串(資料已內嵌,首次渲染即含完整內容)。 */
export function render(): string {
  return renderToString(<App />);
}
