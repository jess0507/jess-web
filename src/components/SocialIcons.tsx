import type { IconType } from 'react-icons';
import { FaEnvelope, FaLinkedinIn, FaGithub, FaLink } from 'react-icons/fa6';
import { logEvent } from '@/services/analytics';
import { openUrlLink } from '@/lib/utils';
import type { SocialItem } from '@/data/types';

// 對應 Flutter SocialItem._iconMap
const iconMap: Record<string, IconType> = {
  envelope: FaEnvelope,
  linkedin: FaLinkedinIn,
  github: FaGithub,
};

interface SocialIconsRowProps {
  socials: SocialItem[];
  /** 分析事件來源標記(如 info_section、web_navigation_bar)。 */
  source: string;
  buttonClassName?: string;
  iconClassName?: string;
  iconSize?: number;
  className?: string;
}

/** 社群圖示橫列(對應 SocialIconsRow)。 */
export function SocialIconsRow({
  socials,
  source,
  buttonClassName = 'bg-white shadow',
  iconClassName = 'text-ink',
  iconSize = 14,
  className = '',
}: SocialIconsRowProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {socials.map((social) => {
        const Icon = iconMap[social.icon] ?? FaLink;
        return (
          <button
            key={social.tag}
            type="button"
            title={social.tag}
            aria-label={social.tag}
            onClick={() => {
              logEvent('social_link_click', {
                social_type: social.tag,
                url: social.url,
                source,
              });
              openUrlLink(social.url);
            }}
            className={`flex h-7 w-7 items-center justify-center rounded-full transition-transform hover:scale-110 ${buttonClassName}`}
            style={social.iconColor ? { color: social.iconColor } : undefined}
          >
            <Icon
              size={iconSize}
              className={social.iconColor ? '' : iconClassName}
            />
          </button>
        );
      })}
    </div>
  );
}
