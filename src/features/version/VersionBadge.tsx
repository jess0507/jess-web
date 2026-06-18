/** 顯示於畫面右下角的版本號標籤(對應 VersionBadge)。 */
export function VersionBadge({ version }: { version: string }) {
  if (!version) return null;
  return (
    <div className="fixed bottom-4 right-4 z-30 px-3 py-1.5 text-[10px] font-medium text-black/70">
      {version}
    </div>
  );
}
