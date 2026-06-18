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
      <span className="font-mono text-base font-bold text-ink">{title}</span>
      {/* 底部指示條:選取時恆顯示,否則 hover 展開 */}
      <span
        className={`absolute bottom-3 left-1/2 h-1.5 -translate-x-1/2 bg-yellow450 transition-all duration-300 ${
          isSelected
            ? 'w-[120px] opacity-85'
            : 'w-0 opacity-85 group-hover:w-[120px]'
        }`}
      />
    </button>
  );
}
