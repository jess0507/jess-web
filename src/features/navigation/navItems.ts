/** 導覽項目定義(對應 ScaffoldWithNav 的 NavData 清單)。 */
export interface NavItemData {
  key: string;
  /** 對應頁面區塊的 DOM id。 */
  sectionId: string;
}

export const navItemsData: NavItemData[] = [
  { key: 'home', sectionId: 'home' },
  { key: 'projects', sectionId: 'projects' },
  { key: 'skills', sectionId: 'skills' },
];
