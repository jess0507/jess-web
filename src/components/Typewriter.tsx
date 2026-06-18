import { useEffect, useState } from 'react';

export interface TypewriterLine {
  text: string;
  /** 每個字元的打字間隔(毫秒)。 */
  speedMs?: number;
  className?: string;
}

interface TypewriterProps {
  /** 要同步播放的多行文字(一起打、一起重頭跑)。 */
  lines: TypewriterLine[];
  /** 全部打完後停留多久再從頭重跑(毫秒)。 */
  pauseMs?: number;
  /** 重複次數(打字→停留→重打 為一輪),達標後停在完整文字。 */
  repeat?: number;
}

const DEFAULT_SPEED = 60;

/**
 * 打字機動畫(對應 Flutter 的 TypewriterAnimatedText)。
 * 多行同步逐字打出 → 停留 → 從頭重打(不刪除),循環 repeat 次後停在完整文字。
 */
export function Typewriter({ lines, pauseMs = 1500, repeat = 5 }: TypewriterProps) {
  const [counts, setCounts] = useState<number[]>(() => lines.map(() => 0));

  useEffect(() => {
    let frame: number;
    let startTime = performance.now();
    let loops = 0;
    let pausedUntil = 0;
    let lastKey = '';

    const lengthAt = (line: TypewriterLine, now: number) =>
      Math.min(
        line.text.length,
        Math.floor((now - startTime) / (line.speedMs ?? DEFAULT_SPEED)),
      );

    const step = (now: number) => {
      // 停留階段:時間到就兩行一起歸零、從頭重跑
      if (pausedUntil > 0) {
        if (now >= pausedUntil) {
          pausedUntil = 0;
          startTime = now;
          loops += 1;
          lastKey = '';
          setCounts(lines.map(() => 0));
        }
        frame = requestAnimationFrame(step);
        return;
      }

      const next = lines.map((line) => lengthAt(line, now));
      const key = next.join(',');
      if (key !== lastKey) {
        lastKey = key;
        setCounts(next);
      }

      const allDone = next.every((count, i) => count >= lines[i].text.length);
      if (allDone) {
        if (loops >= repeat - 1) return; // 達標:停在完整文字
        pausedUntil = now + pauseMs;
      }
      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [lines, pauseMs, repeat]);

  return (
    <div className="flex flex-col justify-end gap-1">
      {lines.map((line, i) => (
        <span
          key={line.text}
          className={`typewriter-caret ${line.className ?? ''}`}
        >
          {line.text.slice(0, counts[i] ?? 0)}
        </span>
      ))}
    </div>
  );
}
