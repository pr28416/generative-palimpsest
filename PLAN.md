# Generative Palimpset — Capstone Project Plan

## Concept

A web-based interactive book that functions as a digital palimpsest. The experience runs as a single-page application on a laptop or tablet, designed to make visible the layered, impermanent, and generative nature of both historical manuscripts and AI language models.

The screen resembles aged parchment. Layers of text overlap at varying opacities and angles — some horizontal, some vertical — evoking the material reality of reused manuscript pages. Users interact by scraping: clicking and dragging across the surface fades the top layers and reveals what lies beneath.

## Core Features

### Interaction

- **Scrape mechanic** — click and drag to erode the top layer of text, revealing layers below
- **UV light toggle** — a mode that illuminates all layers simultaneously in distinct colors, like multispectral imaging used on real palimpsests
- **Page navigation** — 6–8 pages, navigated by scrolling or a page-turn gesture

### AI Text Generation

- When a user scrapes an area, the app calls an AI (Claude or GPT) to generate new text that surfaces in the cleared space
- The page can never be fully cleared — new text continues to appear as old text is removed
- Generated text is contextually aware: it echoes, responds to, or contrasts with whatever is currently visible on the page
- Themes: **memory, erasure, preservation, and loss**

### Technical Constraints

- Delivered as a single `.html` file with embedded CSS and JavaScript
- No build step or server required — runs in any modern browser
- AI calls made from the client via API (Claude or GPT)

## Historical & Conceptual Grounding

A palimpsest is a manuscript page that was scraped clean for reuse, often leaving traces of earlier writing beneath. The Archimedes Palimpsest is a key example: a 10th-century Byzantine prayer book that concealed works of Archimedes, recovered only through modern multispectral imaging.

AI operates analogously. A language model is trained on vast corpora of text but does not store that text verbatim — instead, patterns and fragments surface in outputs, sometimes transformed, sometimes distorted. AI "hallucinations" can be read as a form of textual residue: echoes of training data emerging in degraded or recombined form.

This project makes that parallel interactive. The user scraping for meaning mirrors both the scholar attempting to read a damaged manuscript and the user trying to interpret AI-generated text of uncertain provenance.

## Narrative & Aesthetic Goals

- Visuals should feel materially convincing — aged parchment texture, ink-like typography, layered opacity
- AI-generated text should feel meaningful, not arbitrary — grounded in the themes of the project
- The experience should not feel like a gimmick; the scraping mechanic must serve the concept, not overshadow it

## Risk & Mitigation

**Risk:** The project reads as a novelty rather than a serious work.

**Mitigation:**

- Prioritize visual fidelity and atmospheric coherence
- Ensure AI-generated text is substantive and thematically consistent
- Accompany the project with a written essay connecting the work to scholarship on palimpsests, manuscript culture, and AI text generation
- Essay formatted in **Chicago style** with footnotes and bibliography

## Deliverables

1. Single-file web application (`index.html`)
2. Accompanying capstone essay (Chicago style, notes + bibliography)