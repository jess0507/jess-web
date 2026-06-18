import { useState } from 'react';

interface ProjectItemProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  width: number;
  height: number;
}

/**
 * 專案卡片:hover 時底部浮現半透明標題列(對應 ProjectItem + ProjectCover)。
 */
export function ProjectItem({
  title,
  subtitle,
  imageUrl,
  width,
  height,
}: ProjectItemProps) {
  const [hovering, setHovering] = useState(false);

  return (
    <div
      className="relative overflow-hidden bg-brandgrey-100"
      style={{ width, height }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <img
        src={imageUrl}
        alt={title}
        className="h-full w-full object-contain"
        loading="lazy"
      />

      {/* hover 時由下方滑入並淡入的標題列 */}
      <div
        className={`absolute inset-x-0 bottom-0 flex items-center bg-black/80 px-4 transition-all duration-300 ${
          hovering ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
        }`}
        style={{ height: height / 3 }}
      >
        {/* 左側白色指示線,hover 時展開 */}
        <span
          className={`mr-4 h-px bg-white transition-all duration-700 ease-out ${
            hovering ? 'w-6' : 'w-0'
          }`}
        />
        <div className="flex flex-col justify-center">
          <span className="font-mono text-base font-bold text-white">
            {title}
          </span>
          <span className="mt-1 font-mono text-base font-bold text-white">
            {subtitle}
          </span>
        </div>
      </div>
    </div>
  );
}
