# Generative Palimpsest

A web-based interactive book conceived as a digital palimpsest — a surface written over itself many times, where old traces surface through new text. Built as a capstone project for GENED 1090: *What is a Book?* at Harvard.

---

## Concept

A palimpsest is a manuscript whose original text was scraped away so the parchment could be reused. The erasure was never complete: earlier hands persisted beneath the new writing, visible under ultraviolet light. The most famous example is the Archimedes Palimpsest — a 10th-century prayer book that concealed treatises on mathematics lost for eight hundred years.

This project treats that layering as both form and argument. Each page holds three historical text layers at varying opacities and angles, mimicking the scriptio inferior of a real palimpsest. The reader scrapes the surface with their cursor; as zones clear, an AI model (OpenAI `gpt-5-nano`) surfaces new text from "below" — echoing, distorting, or quietly contradicting what is visible. The page can never be fully cleared. Generation is continuous.

The parallel to large language models is intentional. A model trained on vast corpora does not store text; it is altered by it. What emerges when prompted is residue, not retrieval — the same relationship a palimpsest has to its erased layers.

---

## Features

- **Two-page spread** layout with GSAP clip-path page-turn animation
- **Canvas scraping mechanic** — drag to erase the parchment veil with `destination-out` compositing
- **AI text generation** — OpenAI integration via a secure server-side route handler; triggers when a cleared zone exceeds 60% transparency
- **Distinct AI ink palette** — each new AI fragment surfaces in a different color (6-hue cycle); in UV mode each hue becomes luminous
- **UV light mode** — reveals all three text layers simultaneously in distinct colors, simulating multispectral imaging
- **Parchment wear** — progressive visual aging as more of the page is scraped
- **Loading pulse** — pulsing ring appears at the cleared zone while AI generates
- **Custom bone-folder cursor** on the scrape canvas
- **Catchwords & quire signatures** — medieval ordering aids rendered in the page chrome
- **Running titles, foliation, marginalia, footnotes** — full manuscript paratext apparatus
- **Table of contents** on the title page with spread-index navigation
- **First-load instruction overlay** (localStorage-gated, dismissible)
- **Keyboard & swipe navigation** — arrow keys, touch swipe

### Pages

| Spread | Left | Right |
|--------|------|-------|
| 0 | Endpaper | Title page & ToC |
| 1 | I. Memory | II. Erasure |
| 2 | III. The Archimedes Palimpsest | IV. Preservation |
| 3 | V. Loss | VI. The Generative Scribe |

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + custom CSS |
| Animation | GSAP |
| AI | OpenAI SDK (`gpt-5-nano`) |
| Fonts | IM Fell English, Spectral, Lora, Cormorant Garamond (Google Fonts) |
| Canvas | HTML5 Canvas API |

---

## Getting Started

### Prerequisites

- Node.js 18+
- An OpenAI API key

### Setup

```bash
git clone https://github.com/pr28416/generative-palimpsest.git
cd generative-palimpsest
npm install
```

Create a `.env.local` file in the project root:

```
OPENAI_API_KEY=your_key_here
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
app/
  page.tsx              # BookContainer — spread state, GSAP navigation, intro modal
  layout.tsx            # Root layout, Google Fonts
  globals.css           # All custom styles (parchment, layers, UV, chrome, modal)
  api/generate/
    route.ts            # Server-side OpenAI route handler

components/
  BookSpread.tsx        # Two-page spread with spine gutter
  Page.tsx              # Single page: text layers, canvas, AI fragments, chrome
  TitlePage.tsx         # Title page with ToC
  Endpaper.tsx          # Decorative left page of opening spread

hooks/
  useScrape.ts          # Canvas erase logic, zone tracking, AI trigger

lib/
  content.ts            # All page text, sources, marginalia, catchwords, signatures
```

---

## Usage

| Action | Result |
|--------|--------|
| Click & drag on a page | Scrapes the parchment veil; reveals text beneath |
| Clear ~60% of a zone | Triggers AI generation; new text surfaces in a distinct color |
| Toggle **UV light** | Reveals all layers simultaneously in separate hues |
| Arrow keys / ‹ › buttons | Navigate between spreads |
| Swipe left / right | Navigate on touch devices |

---

## Rubric Checklist (GENED 1090)

| Feature | Implementation |
|---------|---------------|
| Text with author | Six thematic chapters; sources cited per layer; AI as anonymous generative scribe |
| Page layout | Two-page spread; distinct zones for body text, marginalia, footnotes |
| Colophon / title page | Title page with author, scribe credit, year, place |
| Ordering aids | Foliation (`fol. 1r`–`6r`), catchwords, quire signatures (`a i`, `b i`, `c i`) |
| Paratexts | Running titles, chapter headings, table of contents, marginalia, footnote strips |
| Binding | Spine gutter with gradient; GSAP clip-path page-turn as binding/sequencing metaphor |
| Font choice | Four period-appropriate serif typefaces, each assigned to a different text layer |
| Material engagement | Canvas parchment texture; UV light mode; scraping as material act |
| Clear purpose | Argument about AI, memory, and the materiality of text — enacted rather than stated |
