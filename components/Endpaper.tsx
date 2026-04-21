const GLOSSARY: { term: string; def: string }[] = [
  {
    term: "palimpsest",
    def: "A manuscript page from which the original writing has been scraped or washed so the surface can be reused. Traces of earlier text often remain.",
  },
  {
    term: "scriptio inferior",
    def: "The lower writing — the erased or underwritten text in a palimpsest, often recoverable through multispectral imaging or ultraviolet light.",
  },
  {
    term: "rasura",
    def: "The act of scraping away ink from parchment with a pumice stone or knife to prepare the surface for reuse. From Latin radere, to scrape.",
  },
  {
    term: "vellum",
    def: "A fine writing surface prepared from calf, sheep, or goat skin, stretched and dried under tension. More durable than papyrus; expensive enough to justify reuse.",
  },
  {
    term: "quire",
    def: "A gathering of folded leaves forming a unit of a codex. Typically four bifolia (eight leaves). Quires were numbered or signed to aid the binder.",
  },
  {
    term: "lacuna",
    def: "A gap, hole, or missing section in a manuscript text. Plural: lacunae. Scholars mark lacunae with square brackets [ ] and supply conjectural readings.",
  },
  {
    term: "colophon",
    def: "A note at the end of a manuscript recording the date, place, scribe, and circumstances of completion. From Greek κολοφών, a finishing touch.",
  },
  {
    term: "catchword",
    def: "The first word of the following page, written at the bottom of the current page to guide the reader and the binder in correct sequence.",
  },
  {
    term: "manicule",
    def: "A marginal mark in the shape of a pointing hand (☞), drawn by scribes or readers to flag significant passages. From Latin manicula, little hand.",
  },
];

export default function Endpaper() {
  return (
    <div className="endpaper endpaper--glossary">
      <p className="endpaper-heading">Glossary of Manuscript Terms</p>
      <div className="endpaper-rule" />
      <dl className="gloss-list">
        {GLOSSARY.map(({ term, def }) => (
          <div key={term} className="gloss-entry">
            <dt className="gloss-term">{term}</dt>
            <dd className="gloss-def">{def}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
