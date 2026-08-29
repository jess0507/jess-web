import { PageViewCounter } from './PageViewCounter';

/** 顯示於畫面右下角的總瀏覽次數與版本號標籤(對應 VersionBadge)。 */
export function VersionBadge({ version }: { version: string }) {
  return (
    <div className="fixed bottom-4 right-4 z-30 flex items-center gap-2 px-3 py-1.5 text-[10px] font-medium text-black/70">
      <PageViewCounter />
      {version && <span>{version}</span>}
    </div>
  );
}
