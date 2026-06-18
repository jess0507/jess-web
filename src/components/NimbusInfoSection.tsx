interface NimbusInfoSectionProps {
  sectionTitle: string;
  title1: string;
  body: string;
}

/**
 * 區塊標題組件:左側為旋轉 90° 的小標題 + 垂直分隔線,右側為主標題與說明。
 * 對應 Flutter 的 NimbusInfoSection。
 */
export function NimbusInfoSection({
  sectionTitle,
  title1,
  body,
}: NimbusInfoSectionProps) {
  return (
    <div className="flex items-start">
      {/* 左側:旋轉的 section 標題 + 分隔線 */}
      <div className="flex flex-col items-center">
        <span className="-rotate-90 whitespace-nowrap py-2 text-base text-brandgrey-250">
          {sectionTitle}
        </span>
        <span className="mt-4 h-10 w-px bg-brandgrey-350" />
      </div>

      <div className="ml-4 flex-1">
        <h2 className="font-mono text-2xl font-bold text-ink">{title1}</h2>
        <p className="mt-5 whitespace-pre-line text-base leading-[1.8] text-text1">
          {body}
        </p>
      </div>
    </div>
  );
}
