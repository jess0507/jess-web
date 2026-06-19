import staticPortfolio from './portfolio.json';
import type { PortfolioData } from './types';

/**
 * 從打包進 bundle 的靜態 JSON 載入 portfolio(對應 Firestore `config/portfolio` 的內容)。
 * 首屏即有資料、不需等網路,對 SEO / 首屏速度最有利。
 */
export async function loadPortfolioStatic(): Promise<PortfolioData> {
  return parsePortfolio(staticPortfolio as Record<string, unknown>);
}

/** 將原始 JSON 物件轉成型別化的 PortfolioData。 */
function parsePortfolio(json: Record<string, unknown>): PortfolioData {
  const links = (json.links ?? {}) as Record<string, unknown>;
  return {
    links: {
      resumeGoogleDocs: String(links.resumeGoogleDocs ?? ''),
      portfolioGoogleDocs: String(links.portfolioGoogleDocs ?? ''),
    },
    socials: ((json.socials as unknown[]) ?? []).map((e) => {
      const o = e as Record<string, unknown>;
      return {
        tag: String(o.tag ?? ''),
        icon: String(o.icon ?? ''),
        url: String(o.url ?? ''),
        iconColor: o.iconColor ? String(o.iconColor) : undefined,
        borderColor: o.borderColor ? String(o.borderColor) : undefined,
      };
    }),
    skills: ((json.skills as unknown[]) ?? []).map((e) => {
      const o = e as Record<string, unknown>;
      return {
        category: String(o.category ?? ''),
        list: ((o.list as unknown[]) ?? []).map(String),
      };
    }),
    projects: ((json.projects as unknown[]) ?? []).map((e) => {
      const o = e as Record<string, unknown>;
      return {
        id: Number(o.id ?? 0),
        title: String(o.title ?? ''),
        subtitle: String(o.subtitle ?? ''),
        imageUrl: String(o.imageUrl ?? ''),
        link: String(o.link ?? ''),
      };
    }),
  };
}
