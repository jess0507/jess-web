import { useLocale } from '@/i18n/LocaleContext';
import { NimbusInfoSection } from '@/components/NimbusInfoSection';
import { InfoSection } from './InfoSection';
import { ProjectPage } from './ProjectPage';
import { SkillSection } from './SkillSection';

/**
 * 首頁主體:依序為自我介紹、專案、技能三個區塊。
 * 每個區塊帶 id 供導覽列錨點捲動(對應 HomePage 的 globalKey)。
 */
export function HomePage() {
  const { t } = useLocale();

  return (
    <div className="flex flex-col items-center">
      {/* Home 區塊 */}
      <section
        id="home"
        className="w-full px-[10vw] md:px-[15vw]"
        style={{ scrollMarginTop: 80 }}
      >
        <InfoSection />
      </section>

      <div className="h-28" />

      {/* Projects 區塊 */}
      <section
        id="projects"
        className="w-full pl-[10vw] pt-4 md:pl-[15vw]"
        style={{ scrollMarginTop: 80 }}
      >
        <NimbusInfoSection
          sectionTitle={t.myWorks}
          title1={t.meetMyProjects}
          body={t.projectsSubtitle}
        />
      </section>

      <div className="h-10" />
      <div className="w-full px-5 md:px-[50px]">
        <ProjectPage />
      </div>

      <div className="h-28" />

      {/* Skills 區塊 */}
      <section
        id="skills"
        className="w-full pl-[10vw] md:pl-[15vw]"
        style={{ scrollMarginTop: 80 }}
      >
        <NimbusInfoSection
          sectionTitle={t.mySkills}
          title1={t.whatMyDesignSkillsInclude}
          body={t.skillsSubtitle}
        />
      </section>

      <div className="h-10" />
      <div className="w-full px-[10vw] md:px-[15vw]">
        <SkillSection />
      </div>

      <div className="h-28" />
    </div>
  );
}
