import { useRef, useEffect, useState } from 'react';

const A4_RATIO = 297 / 210;
const MAX_WIDTH = 800;

interface PageBreakPreviewProps {
  children: React.ReactNode;
  contentId?: string;
}

const PageBreakPreview = ({ children, contentId }: PageBreakPreviewProps) => {
  const sizerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [pageWidth, setPageWidth] = useState(0);
  const [pageHeight, setPageHeight] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    const sizer = sizerRef.current;
    if (!sizer) return;
    const measure = () => {
      const avail = sizer.offsetWidth;
      if (!avail) return;
      const w = Math.min(avail, MAX_WIDTH);
      setPageWidth(w);
      const el = measureRef.current;
      if (el) {
        const pageH = w * A4_RATIO;
        const contentH = el.scrollHeight;
        setPageHeight(pageH);
        setPageCount(Math.max(1, Math.ceil(contentH / pageH)));
      }
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(sizer);
    if (measureRef.current) observer.observe(measureRef.current);
    return () => observer.disconnect();
  }, [children, pageWidth]);

  return (
    <div className="relative w-full">
      <div ref={sizerRef} className="w-full h-0 overflow-hidden pointer-events-none" aria-hidden />

      <div
        ref={measureRef}
        id={contentId}
        className="pointer-events-none"
        style={{ position: 'absolute', top: 0, left: '-99999px', width: pageWidth || undefined }}
        aria-hidden
      >
        {children}
      </div>

      <div className="flex flex-col items-center gap-6">
        {Array.from({ length: pageCount }).map((_, i) => (
          <div key={i} className="relative" style={{ width: pageWidth || undefined }}>
            <div
              className="relative overflow-hidden bg-white shadow-lg ring-1 ring-black/5"
              style={{ width: pageWidth || undefined, height: pageHeight || undefined }}
            >
              <div
                className="absolute top-0 left-0"
                style={{ width: pageWidth || undefined, transform: `translateY(-${i * pageHeight}px)` }}
              >
                {children}
              </div>
            </div>
            {pageCount > 1 && (
              <span className="absolute -bottom-5 right-0 text-[10px] font-medium text-gray-400">
                Page {i + 1} of {pageCount}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageBreakPreview;
