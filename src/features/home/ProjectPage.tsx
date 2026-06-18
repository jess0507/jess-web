import { usePortfolio } from '@/data/PortfolioContext';
import { useIsMobile } from '@/hooks/useIsMobile';
import { logEvent } from '@/services/analytics';
import { openUrlLink } from '@/lib/utils';
import { ProjectItem } from './ProjectItem';

/** 專案清單:桌機橫向排列、行動裝置縱向堆疊(對應 ProjectPage)。 */
export function ProjectPage() {
  const { data } = usePortfolio();
  const isMobile = useIsMobile(850); // RefinedBreakpoints().tabletLarge

  const width = isMobile ? 500 : 350;
  const height = 250;

  const handleClick = (title: string, link: string) => {
    logEvent('project_clicked', { project_title: title, project_link: link });
    openUrlLink(link);
  };

  return (
    <div
      className={
        isMobile
          ? 'flex flex-col items-center gap-10'
          : 'flex flex-wrap justify-evenly gap-x-8 gap-y-1'
      }
    >
      {data.projects.map((project) => (
        <button
          key={project.id}
          type="button"
          onClick={() => handleClick(project.title, project.link)}
          className="block max-w-full cursor-pointer"
        >
          <ProjectItem
            title={project.title}
            subtitle={project.subtitle}
            imageUrl={project.imageUrl}
            width={width}
            height={height}
          />
        </button>
      ))}
    </div>
  );
}
