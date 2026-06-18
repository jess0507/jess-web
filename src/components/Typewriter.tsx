import { useEffect, useState } from 'react';

interface TypewriterProps {
  text: string;
  /** 每個字元的打字間隔(毫秒)。 */
  speedMs?: number;
  /** 重複次數(打字→停留→刪除 為一輪),達標後停在完整文字。 */
  repeat?: number;
  className?: string;
}

/**
 * 打字機動畫(對應 Flutter 的 TypewriterAnimatedText)。
 * 逐字打出 → 停留 → 刪除 → 重打,循環 repeat 次後停在完整文字。
 */
export function Typewriter({
  text,
  speedMs = 60,
  repeat = 5,
  className = '',
}: TypewriterProps) {
  const [display, setDisplay] = useState('');

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    let index = 0;
    let loops = 0;
    let deleting = false;

    const tick = () => {
      if (cancelled) return;

      if (!deleting) {
        index += 1;
        setDisplay(text.slice(0, index));
        if (index >= text.length) {
          // 已達標次數則停在完整文字
          if (loops >= repeat - 1) return;
          deleting = true;
          timer = setTimeout(tick, 1200);
          return;
        }
      } else {
        index -= 1;
        setDisplay(text.slice(0, index));
        if (index <= 0) {
          deleting = false;
          loops += 1;
        }
      }
      timer = setTimeout(tick, deleting ? speedMs / 2 : speedMs);
    };

    timer = setTimeout(tick, speedMs);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [text, speedMs, repeat]);

  return <span className={`typewriter-caret ${className}`}>{display}</span>;
}
