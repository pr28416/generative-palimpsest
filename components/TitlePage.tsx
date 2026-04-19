"use client";

import { PAGES } from "@/lib/content";

// Maps each content page index to the spread that contains it
const PAGE_TO_SPREAD: Record<number, number> = {
  1: 1, 2: 1,   // Memory | Erasure  → spread 1
  3: 2, 4: 2,   // Archimedes | Preservation → spread 2
  5: 3, 6: 3,   // Loss | Generative Scribe → spread 3
};

interface TitlePageProps {
  /** navigate(spreadIndex) — passed in from BookSpread / BookContainer */
  onNavigate: (spreadIndex: number) => void;
}

export default function TitlePage({ onNavigate }: TitlePageProps) {
  return (
    <div className="page-surface">
      <div className="title-page">
        <p className="title-sub">A Digital Palimpsest</p>
        <h1 className="title-main">Generative<br />Palimpsest</h1>
        <div className="title-rule" />

        <p className="title-author">Compiled by the Reader</p>
        <p className="title-scribe">Generative Scribe: Anonymous · Cambridge, 2025</p>

        <div className="toc-block">
          <p className="toc-heading">Contents</p>
          {PAGES.map((page) => (
            <div
              key={page.id}
              className="toc-entry"
              role="button"
              tabIndex={0}
              onClick={() => onNavigate(PAGE_TO_SPREAD[page.id])}
              onKeyDown={(e) =>
                e.key === "Enter" && onNavigate(PAGE_TO_SPREAD[page.id])
              }
            >
              <span>
                {page.id}.{" "}
                {page.chapterHeading.replace(/^[IVX]+\.\s*/, "")}
              </span>
              <span className="toc-folio">{page.folioLabel}</span>
            </div>
          ))}
        </div>

        <p className="colophon-text">
          Scrape any page to reveal what lies beneath the visible layers —
          and to summon a generative scribe whose words surface in response
          to your reading.
        </p>
      </div>

      {/* Page chrome */}
      <div className="page-chrome">
        <span className="running-title">Generative Palimpsest</span>
        <span className="folio-number">fol. 0r</span>
      </div>
    </div>
  );
}
