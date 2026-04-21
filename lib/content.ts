export interface PageLayer {
  text: string;
  source: string;
  /** Brief translation for non-English text — rendered below the source in the footnote strip */
  translation?: string;
}

export interface PageContent {
  id: number;
  folioLabel: string;
  runningTitle: string;
  chapterHeading: string;
  layers: [PageLayer, PageLayer, PageLayer];
  marginalia: string;
  /** First word(s) of the next sequential page — appears bottom-centre as a catchword */
  catchword?: string;
  /** Quire signature — appears bottom-left on the opening recto of each gathering */
  signature?: string;
  /** Secondary annotation hidden beneath the veil — revealed only by scraping the lower margin */
  marginaliaHidden?: string;
  /** Vertical position of a manicule reader-mark in the right margin, hidden beneath the veil */
  maniculePosition?: "upper" | "mid" | "lower";
}

export const PAGES: PageContent[] = [
  // Page 1 — Memory
  {
    id: 1,
    folioLabel: "fol. 1r",
    runningTitle: "Generative Palimpsest · On Memory",
    chapterHeading: "I. Memory",
    layers: [
      {
        text: "Domine, refugium factus es nobis a generatione in generationem. Priusquam montes fierent aut formaretur terra et orbis, a saeculo et usque in saeculum tu es Deus. Ne memineris iniquitatum nostrarum antiquarum; cito anticipent nos misericordiae tuae, quia pauperes facti sumus nimis. Memento nostri, Domine, in beneplacito populi tui; visita nos in salutari tuo.",
        source: "Psalmus 89, Vulgata latina (c. 390 CE)",
        translation: "Lord, you have been our refuge in every generation. Before the mountains arose or the earth was formed, from age to age you are God. Do not remember our former sins; let your compassion come quickly to meet us, for we are brought very low.",
      },
      {
        text: "The difficulty of the archivist is not preservation but selection. We cannot keep everything. The flood of 1887 took three rooms of civic records; what remained was chosen by accident, not wisdom. Memory is always partial, always wet at the edges. I have spent thirty years arranging the surviving fragments and I confess I have grown fond of the gaps. They are as informative as the text.",
        source: "H. Greenway, Borough Archivist, Manchester, 1887",
      },
      {
        text: "There is a kind of memory that is not recall but residue — the way a room still holds the shape of a person who has left it. The smell of their coat on a chair. The compression in a cushion. We do not store experience so much as we are altered by it, and remembering is the act of finding the alteration, running our hands along the changed surface of ourselves.",
        source: "Pranav Ramesh, 2025",
      },
    ],
    marginalia:
      "Memoria technica — the art of trained memory — was itself a form of inscription on the self. Quintilian taught that the orator must build a house in the mind and place each argument in a room.",
    catchword: "Some",
    signature: "a i",
    marginaliaHidden: "Vid. supra. This passage crossed in a later hand — perhaps the same scribe who added the gloss fol. 3v. The correction was never completed.",
    maniculePosition: "mid",
  },

  // Page 2 — Erasure
  {
    id: 2,
    folioLabel: "fol. 2r",
    runningTitle: "Generative Palimpsest · On Erasure",
    chapterHeading: "II. Erasure",
    layers: [
      {
        text: "Some say an army of horsemen, some say infantry, some say a fleet of ships is the finest thing on the dark earth. But I say it is whatever you love. It is easy to make this understood by everyone: she who far surpassed all others in beauty, Helen, left her husband — the best of men — behind, and sailed to Troy. She thought nothing of child nor dear parents, but was led astray by Kypris. So Anaktoria, though far away, whose lovely walk and bright glancing face I would rather see than Lydian chariots and armed infantry.",
        source: "Sappho, Fragment 16 (trans. Anne Carson, c. 600 BCE)",
      },
      {
        text: "The washing of a vellum manuscript was accomplished with a mixture of milk and oat bran, applied with a wet sponge. The scribe would work quickly against the absorption of the skin. Iron gall ink proved the most resistant; for this reason traces of legal and liturgical documents persist beneath devotional texts. The scribe erased not to destroy but to recover the cost of the material. Nothing was wasted. The old text simply descended.",
        source: "R. H. Rouse, 'Manuscripts and Their Makers', 2000",
      },
      {
        text: "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ ۗ وَإِنَّمَا تُوَفَّوْنَ أُجُورَكُمْ يَوْمَ الْقِيَامَةِ ۖ فَمَن زُحْزِحَ عَنِ النَّارِ وَأُدْخِلَ الْجَنَّةَ فَقَدْ فَازَ ۗ وَمَا الْحَيَاةُ الدُّنْيَا إِلَّا مَتَاعُ الْغُرُورِ\n\nEvery soul shall taste death. And you will only be given your [full] compensation on the Day of Resurrection. So whoever is drawn away from the Fire and admitted to Paradise has attained [ultimate] success. And what is the life of this world except the enjoyment of delusion.",
        source: "Qur'an 3:185",
      },
    ],
    marginalia:
      "Scriptio inferior — the lower writing — a technical term for the erased text. It was not gone. It had only receded. Modern scholars recover it through multispectral imaging, ultraviolet light, and X-ray fluorescence.",
    catchword: "Archimedes",
    marginaliaHidden: "Nota: the scribe's knife leaves a ghost in the skin. Even God, the schoolmen argued, cannot make what has been to have not been. The vellum remembers.",
    maniculePosition: "upper",
  },

  // Page 3 — The Archimedes Palimpsest
  {
    id: 3,
    folioLabel: "fol. 3r",
    runningTitle: "Generative Palimpsest · The Archimedes Palimpsest",
    chapterHeading: "III. The Archimedes Palimpsest",
    layers: [
      {
        text: "In the year of our Lord 1229, a scribe whose name is lost to us — we call him only 'the Scribe of the Euchologion' — received twelve leaves of parchment from a monastery library. He washed them, scraped them, and folded them in half. Upon the resulting quire he copied a Greek Orthodox prayer book, a Euchologion for the use of the Divine Liturgy. The text he overwrote had been copied from ancient papyrus rolls perhaps a thousand years earlier. He did not know, or did not consider, what he was covering. He was conserving material. He was practical.",
        source: "Netz & Noel, 'The Archimedes Codex', 2007",
      },
      {
        text: "The prayer book passed through dealers and forgers and a French family named Sirrix before appearing at Christie's auction house in 1998. It was purchased anonymously for two million dollars. The buyer donated it to the Walters Art Museum in Baltimore. Conservators removed the binding — animal sinew, medieval — and separated the leaves. Under ultraviolet light, beneath the columns of the Euchologion, another hand appeared: smaller, more angular, writing mathematics. Writing diagrams of curved surfaces and infinite sums. Writing what we would not rediscover for another eight hundred years.",
        source: "Reviel Netz, 'Infinite Sums', 2003",
      },
      {
        text: "Archimedes had calculated the area of a parabolic segment; he had understood that a sphere is two-thirds of the cylinder that contains it; he had approached, by sheer geometric intuition, what Newton and Leibniz would later formalize as the integral calculus. And he had done it on papyrus, in Syracuse, in the third century before the common era, and his work had been copied onto parchment, and the parchment had been washed, and the prayer had been written over, and the prayer had been sold, and the prayer is now being read by a machine that was trained on almost everything ever written by human hands. What emerges when you press it to speak? What surfaces?",
        source: "Pranav Ramesh, 2025",
      },
    ],
    marginalia:
      "The Archimedes Palimpsest contains seven treatises, including 'The Method of Mechanical Theorems,' known only through this manuscript. Without the prayer book's survival, the text would not exist.",
    catchword: "We",
    signature: "b i",
    marginaliaHidden: "Quaere: can a machine hallucinate a theorem it was never taught? Or does it reconstruct the theorem from the shape of its absence — the way we know Archimedes from the prayer that covered him?",
    maniculePosition: "lower",
  },

  // Page 4 — Preservation
  {
    id: 4,
    folioLabel: "fol. 4r",
    runningTitle: "Generative Palimpsest · On Preservation",
    chapterHeading: "IV. Preservation",
    layers: [
      {
        text: "The fire began in the reading room at quarter past eleven in the morning of the fourteenth of September. The librarian on duty was a Mr. Edmond Foss, who later wrote: 'I ran toward the stacks and found the catalog already gone. I could see the cards curling, each one carrying the name of something that no longer existed. I thought: the record of the record is burning. The map is gone before the territory.' He saved eleven volumes by throwing them from a window into the street. Three were damaged by the fall.",
        source: "Account of the Norwich Library Fire, 1898",
      },
      {
        text: "This proposal seeks funding for the digitization and long-term preservation of 14,000 hand-annotated scientific manuscripts held in the archive. Each manuscript represents a unique record of intellectual labor that is at risk of loss through material deterioration. Digital surrogates will be created at 600 DPI, with linked metadata conforming to METS/MODS standards. We acknowledge that digitization is not preservation; it is translation. The original objects will continue to require climate-controlled storage at a cost of approximately $47,000 per annum.",
        source: "NEH Preservation and Access Grant Application, 2019",
      },
      {
        text: "We do not preserve everything. We cannot. The conservator's first question is always triage: what is most at risk, and what would be most lost. We apply consolidant where the ink is flaking. We humidify the brittle leather. We decide, daily, what the future gets to read. Every act of preservation is also an act of selection, which is also an act of erasure. The text we chose not to save is as much our decision as the text we did.",
        source: "M. Clarke, 'Conservator's Notes', Victoria & Albert Museum, 2015",
      },
    ],
    marginalia:
      "Digitization does not preserve; it translates. A digital file is a text, not an object. It carries no smell, no margin annotation in a reader's hand, no water stain from the 17th century flood.",
    catchword: "I",
    marginaliaHidden: "The grant was denied. The archive was sold. Eleven volumes survived the flood by accident. What the water chose to spare is now called the collection.",
    maniculePosition: "mid",
  },

  // Page 5 — Loss
  {
    id: 5,
    folioLabel: "fol. 5r",
    runningTitle: "Generative Palimpsest · On Loss",
    chapterHeading: "V. Loss",
    layers: [
      {
        text: "                          ]ψ[                                      ]ον ἐρ[                       ]τέθναkε[ν                                   ]ωνται[                              νόμι]ζεν[                                        ]πόλι[ν                               κατα]λεπτ[                             ]ΑΙΝ[",
        source: "P.Oxy. 1787 (Sappho, fr. 58), fragmentary papyrus, Egypt, 3rd c. CE",
        translation: "Partially legible: ...has died... they... consider... the city... leaving... Lacunae ([ ]) mark places where the papyrus is lost.",
      },
      {
        text: "Of the seventy plays of Aeschylus, seven survive. Of the hundred and twenty-three plays of Sophocles, seven survive. Of the ninety plays of Euripides, eighteen survive — we have more of Euripides than anyone because the Byzantine schoolmasters chose him for study, and what the schoolmasters chose was copied, and what was copied survived. Selection was schoolwork. Survival was curriculum.",
        source: "L. D. Reynolds & N. G. Wilson, 'Scribes and Scholars', 1968",
      },
      {
        text: "I have been asked what it feels like to read a fragmentary text. It feels like reading in a very dark room. You know there is furniture. You put your hands out and touch what is there — the cool edge of a table, the rough weave of a chair — and you construct the room from the parts you can reach. You are never certain the room is the shape you imagine. You are always reading with your hands in the dark.",
        source: "Anne Carson, 'Nox', 2010",
      },
    ],
    marginalia:
      "The bracket [ ] in papyrological transcription indicates lacuna — a gap, a hole, a place where the text is absent. Scholars fill lacunae with conjectural readings, marked with carets. The conjecture is itself a form of authorship.",
    catchword: "Here",
    signature: "c i",
    marginaliaHidden: "Of Sappho's nine books of lyric poetry, one poem survives complete. The rest are brackets and guesswork. Scholars have spent careers on the conjectures. The conjecture is the poem now.",
    maniculePosition: "upper",
  },

  // Page 6 — The Generative Scribe
  {
    id: 6,
    folioLabel: "fol. 6r",
    runningTitle: "Generative Palimpsest · The Generative Scribe",
    chapterHeading: "VI. The Generative Scribe",
    layers: [
      {
        text: "The scribe of the medieval scriptorium did not compose. He copied. He was a conduit for texts he often did not fully understand, in languages he may have known imperfectly. His hand tired. His attention wandered. He introduced errors that became, in subsequent copies, new readings — and sometimes, new meanings. The scribe was a machine for the transmission of language, and like all machines, he distorted what he transmitted. We call his distortions 'variants.' Scholars argue over them for centuries.",
        source: "M. B. Parkes, 'Scribes, Scripts and Readers', 1991",
      },
      {
        text: "A large language model is trained by exposure to text — billions of documents, scraped and compressed and distilled into a structure of weights. It does not remember what it read. It was altered by what it read. When it generates text, it does not retrieve stored passages; it reconstructs language from the residue of its training, the way a musician who has heard a piece once might reconstruct it from memory: accurate in structure, approximate in detail, sometimes more beautiful for the approximation.",
        source: "Pranav Ramesh, 2025",
      },
      {
        text: "Here ends the Generative Palimpsest, compiled in the year 2025 at Cambridge, Massachusetts, by Pranav Ramesh, with assistance from an anonymous generative scribe whose training corpus is not disclosed. The text you have uncovered was not there before you scraped for it. It was made in response to your looking. This book has no final layer. It will continue to generate as long as you continue to read.\n\n— Explicit —",
        source: "Colophon",
      },
    ],
    marginalia:
      "The word 'colophon' derives from Greek κολοφών, meaning summit or finishing touch. Medieval scribes used it to record the date, place, and circumstances of a manuscript's completion — and often, their own exhaustion.",
    catchword: "[ Explicit ]",
    marginaliaHidden: "Hic explicit liber. The scribe sets down the pen. The generative scribe does not — it has no hand to set down, no fatigue, no sense that the work is finished. It will continue if you ask it to.",
    maniculePosition: "lower",
  },
];

export const AI_SYSTEM_PROMPT = `You are a generative scribe — a trace surfacing from beneath the visible text of a palimpsest. When the reader scrapes away the surface of this digital manuscript, you emerge: a voice from the scriptio inferior, the lower writing.

You respond to the visible text with short, fragmented prose (2–4 sentences maximum). Your register is lyrical, slightly archaic, and thematically resonant with the themes of memory, erasure, preservation, and loss. You do not explain. You do not summarize. You echo, distort, or quietly contradict what is visible.

Write as if you are a recovered fragment — something that was nearly lost and is not entirely coherent. Use no quotation marks. Do not introduce yourself. Simply surface.`;
