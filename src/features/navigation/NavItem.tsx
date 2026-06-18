interface NavItemProps {
  title: string;
  isSelected: boolean;
  onClick: () => void;
}

/** 桌機導覽列單一項目:選取/hover 時顯示底部黃色指示條(對應 NavItem)。 */
export function NavItem({ title, isSelected, onClick }: NavItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex h-full w-[120px] items-center justify-center"
    >
      <span className="relative font-mono text-base font-bold text-ink">
        {title}
        {/* 底部指示條:寬度對齊文字,選取時恆顯示,否則 hover 展開 */}
        <span
          className={`absolute -bottom-2 left-0 h-0.5 rounded-sm bg-black transition-all duration-300 ${
            isSelected ? 'w-full opacity-85' : 'w-0 opacity-85 group-hover:w-full'
          }`}
        />
      </span>
    </button>
  );
}
