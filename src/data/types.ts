// 對應 Firestore config/portfolio 文件 data 欄位的型別定義。

/** 外部文件連結(履歷 / 作品集)。 */
export interface ShareLinks {
  resumeGoogleDocs: string;
  portfolioGoogleDocs: string;
}

/** 社群連結項目。icon 為字串 key,對應到 SocialIcon 元件的圖示對照表。 */
export interface SocialItem {
  tag: string;
  icon: string;
  url: string;
  iconColor?: string;
  borderColor?: string;
}

/** 技能分類與項目清單。 */
export interface SkillData {
  category: string;
  list: string[];
}

/** 單一專案。 */
export interface Project {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  link: string;
}

/** portfolio 頁面所需的完整資料(對應 PortfolioData)。 */
export interface PortfolioData {
  links: ShareLinks;
  socials: SocialItem[];
  skills: SkillData[];
  projects: Project[];
}

/** 資料載入前使用的空狀態。 */
export const emptyPortfolio: PortfolioData = {
  links: { resumeGoogleDocs: '', portfolioGoogleDocs: '' },
  socials: [],
  skills: [],
  projects: [],
};
