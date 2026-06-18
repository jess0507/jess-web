import { useEffect, useRef, useState } from 'react';
import { FaChevronDown, FaCheck } from 'react-icons/fa6';
import { useLocale } from '@/i18n/LocaleContext';
import { logEvent } from '@/services/analytics';
import type { LocaleCode } from '@/i18n/translations';

interface Option {
  code: LocaleCode;
  flag: string;
  label: string;
}

const options: Option[] = [
  { code: 'zh', flag: '🇹🇼', label: '中文' },
  { code: 'en', flag: '🇺🇸', label: 'English' },
];

/** 語系選擇器(對應 LocaleSelector)。 */
export function LocaleSelector({ light = false }: { light?: boolean }) {
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const current = options.find((o) => o.code === locale) ?? options[0];
  const textColor = light ? 'text-white' : 'text-secondary';

  const handleSelect = (code: LocaleCode) => {
    setLocale(code);
    logEvent('locale_changed', { locale: code });
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 font-semibold ${textColor}`}
      >
        <span className="text-lg">{current.flag}</span>
        <span>{current.label}</span>
        <FaChevronDown size={12} />
      </button>

      {open && (
        <ul className="absolute right-0 z-50 mt-2 min-w-[140px] overflow-hidden rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5">
          {options.map((o) => {
            const selected = o.code === locale;
            return (
              <li key={o.code}>
                <button
                  type="button"
                  onClick={() => handleSelect(o.code)}
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-left text-ink hover:bg-black/5"
                >
                  <span className="text-lg">{o.flag}</span>
                  <span className={selected ? 'font-bold' : 'font-normal'}>
                    {o.label}
                  </span>
                  {selected && (
                    <FaCheck size={14} className="ml-auto text-primary-200" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
