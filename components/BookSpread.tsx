"use client";

import { PAGES } from "@/lib/content";
import Page from "./Page";
import TitlePage from "./TitlePage";
import Endpaper from "./Endpaper";

export interface Spread {
  left: number | null; // null = decorative endpaper
  right: number;       // 0 = title page, 1–6 = content pages
}

interface BookSpreadProps {
  spread: Spread;
  isActive: boolean;
  uvMode: boolean;
  onNavigate: (spreadIndex: number) => void;
}

function SpreadPage({
  index,
  isActive,
  uvMode,
  onNavigate,
}: {
  index: number | null;
  isActive: boolean;
  uvMode: boolean;
  onNavigate: (i: number) => void;
}) {
  if (index === null) return <Endpaper />;
  if (index === 0) return <TitlePage onNavigate={onNavigate} />;
  const p = PAGES[index - 1];
  if (!p) return null;
  return <Page page={p} isActive={isActive} uvMode={uvMode} />;
}

export default function BookSpread({
  spread,
  isActive,
  uvMode,
  onNavigate,
}: BookSpreadProps) {
  return (
    <div className="book-spread">
      {/* .spread-slot divs are the actual flex items */}
      <div className="spread-slot spread-slot--left">
        <SpreadPage
          index={spread.left}
          isActive={isActive}
          uvMode={uvMode}
          onNavigate={onNavigate}
        />
      </div>

      <div className="spine-gutter" aria-hidden="true" />

      <div className="spread-slot spread-slot--right">
        <SpreadPage
          index={spread.right}
          isActive={isActive}
          uvMode={uvMode}
          onNavigate={onNavigate}
        />
      </div>
    </div>
  );
}
