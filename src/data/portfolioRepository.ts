import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { PortfolioData } from './types';

// 資料位置:collection `config` / doc `portfolio` / 欄位 `data`
const COLLECTION = 'config';
const DOCUMENT = 'portfolio';
const FIELD = 'data';

/**
 * 從 Firestore 讀取並解析 portfolio 資料(對應 PortfolioRepository.load)。
 * `data` 欄位可能是 Map,也可能是存成 JSON 字串。
 */
export async function loadPortfolio(): Promise<PortfolioData> {
  const snapshot = await getDoc(doc(db, COLLECTION, DOCUMENT));

  if (!snapshot.exists()) {
    throw new Error(`Firestore 文件 ${COLLECTION}/${DOCUMENT} 不存在`);
  }

  const raw = snapshot.data()?.[FIELD];

  let data: unknown;
  if (typeof raw === 'string') {
    data = JSON.parse(raw);
  } else if (raw && typeof raw === 'object') {
    data = raw;
  } else {
    throw new Error(
      `Firestore 文件 ${COLLECTION}/${DOCUMENT} 缺少 Map 或 JSON 字串型別的 \`${FIELD}\` 欄位`
    );
  }

  return parsePortfolio(data as Record<string, unknown>);
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
