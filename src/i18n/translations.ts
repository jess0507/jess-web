// 翻譯字典(對應 Flutter 的 app_zh.arb / app_en.arb)。

export type LocaleCode = 'zh' | 'en';

export interface Translation {
  appTitle: string;
  logo: string;
  home: string;
  portfolio: string;
  resume: string;
  intro: string;
  position: string;
  aboutDev: string;
  buildBy: string;
  jessYen: string;
  madeIn: string;
  withText: string;
  emailLabel: string;
  email: string;
  projects: string;
  skills: string;
  myWorks: string;
  meetMyProjects: string;
  projectsSubtitle: string;
  mySkills: string;
  whatMyDesignSkillsInclude: string;
  skillsSubtitle: string;
}

export const translations: Record<LocaleCode, Translation> = {
  zh: {
    appTitle: 'Jess Yen 個人網站',
    logo: 'Jess Yen',
    home: '首頁',
    portfolio: '作品集',
    resume: '履歷',
    intro: '你好! 我是Jess Yen',
    position: 'Senior Android & Flutter Engineer',
    aboutDev:
      '擁有 7 年豐富的行動應用程式經驗。\n已開發了 7 個在 Google Play 上發布的應用程式。',
    buildBy: '使用Flutter建置，作者:',
    jessYen: 'Jess Yen',
    madeIn: '製造於',
    withText: '和',
    emailLabel: 'Email:',
    email: 'merukoo0507@gmail.com',
    projects: '專案',
    skills: '技術',
    myWorks: '作品集',
    meetMyProjects: '開發過的專案',
    projectsSubtitle: '這些專案為我過去承接或參與開發專案或應用程式',
    mySkills: '技能樹',
    whatMyDesignSkillsInclude: '軟體程式技術',
    skillsSubtitle: '在開發軟體或應用程式時，經常用到的程式語言或工具。',
  },
  en: {
    appTitle: 'Jess Yen Web',
    logo: 'Jess Yen',
    home: 'Home',
    portfolio: 'Portfolio',
    resume: 'Resume',
    intro: "Hi! I'm Jess -",
    position: 'Senior Android & Flutter Engineer',
    aboutDev:
      'Possessing 7 years of solid mobile app experience.\nHaving developed 7 apps published on google play. ',
    buildBy: 'Built with Flutter by',
    jessYen: 'Jess Yen',
    madeIn: 'Made in',
    withText: 'with',
    emailLabel: 'Email:',
    email: 'merukoo0507@gmail.com',
    projects: 'Projects',
    skills: 'Skills',
    myWorks: 'my works',
    meetMyProjects: 'Meet My Projects',
    projectsSubtitle:
      'These are projects and applications that I have contributed to or developed.',
    mySkills: 'my skills',
    whatMyDesignSkillsInclude: 'What My Design Skills Include',
    skillsSubtitle:
      'These are the skills and tools I frequently use in development.',
  },
};

/** nav 項目以 key 儲存,對應到翻譯(對應 NavLabelX extension)。 */
export function navLabel(t: Translation, key: string): string {
  switch (key) {
    case 'home':
      return t.home;
    case 'projects':
      return t.projects;
    case 'skills':
      return t.skills;
    default:
      return key;
  }
}
