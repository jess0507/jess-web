import { usePortfolio } from '@/data/PortfolioContext';

/** 技能區塊:依分類列出技能項目(對應 SkillSection)。 */
export function SkillSection() {
  const { data } = usePortfolio();

  return (
    <div className="flex flex-wrap gap-x-2 gap-y-1">
      {data.skills.map((skill) => (
        <div key={skill.category} className="w-[200px] pb-5">
          <h3 className="font-mono text-base font-bold text-ink">
            {skill.category}
          </h3>
          <div className="mt-2 flex flex-col gap-2">
            {skill.list.map((item) => (
              <span key={item} className="text-base text-text2">
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
