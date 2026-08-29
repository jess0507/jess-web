import { PageViewCounter } from './PageViewCounter';

/**
 * 右下角固定顯示總瀏覽次數與使用者數;版本號置於頁面最底部置中(對應 VersionBadge)。
 */
export function VersionBadge({ version }: { version: string }) {
  return (
    <>
      <PageViewCounter className="fixed bottom-4 right-4 z-30 items-end px-3 py-1.5 text-[10px] font-medium text-black/40" />
      {version && (
        <footer className="py-6 text-center text-[10px] font-medium text-black/40">
          {version}
        </footer>
      )}
    </>
  );
}
