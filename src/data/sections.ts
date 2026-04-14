export interface CardData {
  id: string;
  title: string;
  icon: string;
  description: string;
  detail?: string;
  cta?: { label: string; href: string };
}

export interface SectionData {
  id: string;
  title: string;
  subtitle: string;
  cards: CardData[];
  color: string; // accent color for glow effects
}

export const sections: SectionData[] = [
  {
    id: "vision",
    title: "Vision",
    subtitle: "Wer wir sind und wohin wir gehen",
    color: "#00d4ff",
    cards: [
      {
        id: "vision-1",
        title: "Wer wir sind",
        icon: "Globe",
        description: "Ein Team aus Designern, Entwicklern und Strategen.",
        detail:
          "Wir verbinden Kreativität mit technischer Exzellenz, um digitale Erlebnisse zu schaffen, die begeistern.",
      },
      {
        id: "vision-2",
        title: "Warum wir anders sind",
        icon: "Zap",
        description: "Innovation als Grundprinzip.",
        detail:
          "Wir denken nicht in Templates — wir entwerfen jedes Projekt als einzigartiges Erlebnis.",
      },
      {
        id: "vision-3",
        title: "Unsere Zukunftsvision",
        icon: "Rocket",
        description: "Die Grenze zwischen Web und Realität auflösen.",
        detail:
          "Immersive Erlebnisse, die Marken in den dreidimensionalen Raum bringen.",
      },
    ],
  },
  {
    id: "leistungen",
    title: "Leistungen",
    subtitle: "Was wir anbieten",
    color: "#a855f7",
    cards: [
      {
        id: "leistungen-1",
        title: "Branding",
        icon: "Palette",
        description: "Markenidentität, die im Gedächtnis bleibt.",
        detail:
          "Von Logo bis Brand Guidelines — wir schaffen visuelle Systeme mit Wiedererkennungswert.",
      },
      {
        id: "leistungen-2",
        title: "Webdesign",
        icon: "Monitor",
        description: "Websites, die beeindrucken und konvertieren.",
        detail:
          "Responsive, performant und auf eure Zielgruppe zugeschnitten.",
      },
      {
        id: "leistungen-3",
        title: "App-Entwicklung",
        icon: "Smartphone",
        description: "Native und Cross-Platform Apps.",
        detail:
          "iOS, Android und Web — aus einer Hand, mit nahtloser UX.",
      },
      {
        id: "leistungen-4",
        title: "Digital Signage",
        icon: "TvMinimal",
        description: "Digitale Displays mit Wow-Effekt.",
        detail:
          "Interaktive Installationen und Content-Systeme für den physischen Raum.",
      },
      {
        id: "leistungen-5",
        title: "Content Creation",
        icon: "Clapperboard",
        description: "Inhalte, die Geschichten erzählen.",
        detail:
          "Video, Motion Graphics, 3D-Visualisierungen und mehr.",
      },
    ],
  },
  {
    id: "projekte",
    title: "Projekte",
    subtitle: "Ausgewählte Arbeiten",
    color: "#f97316",
    cards: [
      {
        id: "projekte-1",
        title: "Projekt Alpha",
        icon: "Building2",
        description: "Immersive Brand Experience für einen Global Player.",
        detail:
          "3D-Website mit interaktiver Produktpräsentation — 200% mehr Verweildauer.",
      },
      {
        id: "projekte-2",
        title: "Projekt Beta",
        icon: "Target",
        description: "E-Commerce Relaunch mit Conversion-Fokus.",
        detail:
          "Redesign und Performance-Optimierung — 45% höhere Conversion Rate.",
      },
      {
        id: "projekte-3",
        title: "Projekt Gamma",
        icon: "Sparkles",
        description: "Digital Signage für Flagship Stores.",
        detail:
          "Interaktive Displays in 12 Standorten — vernetzt und in Echtzeit steuerbar.",
      },
    ],
  },
  {
    id: "technologie",
    title: "Technologie",
    subtitle: "Unsere Tools und Methoden",
    color: "#22d3ee",
    cards: [
      {
        id: "tech-1",
        title: "3D Web Experience",
        icon: "Box",
        description: "Three.js, WebGL und immersive Welten.",
        detail:
          "Wir bringen die dritte Dimension ins Web — performant und auf jedem Gerät.",
      },
      {
        id: "tech-2",
        title: "Automatisierung",
        icon: "Settings",
        description: "Workflows, die sich selbst optimieren.",
        detail:
          "CI/CD, automatisierte Tests und intelligente Deployment-Pipelines.",
      },
      {
        id: "tech-3",
        title: "CMS & Plattform",
        icon: "Blocks",
        description: "Headless CMS für maximale Flexibilität.",
        detail:
          "Content-Management, das sich eurem Workflow anpasst — nicht umgekehrt.",
      },
      {
        id: "tech-4",
        title: "Daten & Analyse",
        icon: "BarChart3",
        description: "Datengetriebene Entscheidungen.",
        detail:
          "Analytics, A/B-Testing und Performance-Monitoring in Echtzeit.",
      },
    ],
  },
  {
    id: "kontakt",
    title: "Kontakt",
    subtitle: "Let's build something great",
    color: "#ec4899",
    cards: [
      {
        id: "kontakt-1",
        title: "Kontakt",
        icon: "Mail",
        description: "Schreib uns eine Nachricht.",
        cta: { label: "E-Mail senden", href: "mailto:hello@helix.de" },
      },
      {
        id: "kontakt-2",
        title: "Termin buchen",
        icon: "CalendarDays",
        description: "Kostenloses Erstgespräch vereinbaren.",
        cta: { label: "Termin wählen", href: "#" },
      },
      {
        id: "kontakt-3",
        title: "Angebot anfragen",
        icon: "FileText",
        description: "Individuelles Angebot erhalten.",
        cta: { label: "Anfrage starten", href: "#" },
      },
      {
        id: "kontakt-4",
        title: "Social",
        icon: "Share2",
        description: "Folge uns auf LinkedIn, Instagram & Co.",
        cta: { label: "Folgen", href: "#" },
      },
    ],
  },
];
