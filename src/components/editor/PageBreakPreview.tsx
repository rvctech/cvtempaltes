import { useRef, useEffect, useState } from 'react';

const A4_RATIO = 297 / 210;

interface PageBreakPreviewProps {
  children: React.ReactNode;
}

const PageBreakPreview = ({ children }: PageBreakPreviewProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [breaks, setBreaks] = useState<number[]>([]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.offsetWidth;
      if (!w) return;
      const pageH = w * A4_RATIO;
      const contentH = el.scrollHeight;
      const count = Math.max(1, Math.ceil(contentH / pageH));
      const pts: number[] = [];
      for (let i = 1; i < count; i++) {
        pts.push(i * pageH);
      }
      setBreaks(pts);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [children]);

  return (
    <div className="relative">
      <div ref={contentRef} className="relative">
        {children}
        {breaks.map((y, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 flex items-center gap-3 pointer-events-none"
            style={{ top: y - 1 }}
          >
            <span className="flex-1 h-px border-t border-dashed border-red-300 dark:border-red-500/50" />
            <span className="text-[10px] font-medium text-red-400 dark:text-red-500/70 whitespace-nowrap shrink-0">
              Page {i + 2}
            </span>
            <span className="flex-1 h-px border-t border-dashed border-red-300 dark:border-red-500/50" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageBreakPreview;
