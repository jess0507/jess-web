/** 在新分頁開啟外部連結(對應 Flutter 的 openUrlLink)。 */
export function openUrlLink(url: string): void {
  if (!url) return;
  window.open(url, '_blank', 'noopener,noreferrer');
}

/** 平滑捲動到指定 id 的區塊(對應 Scrollable.ensureVisible)。 */
export function scrollToSection(id: string): void {
  document.getElementById(id)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
}
