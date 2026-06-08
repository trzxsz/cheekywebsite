/* =========================================================================
   NOCTRA — single source of truth for brand + navigation.
   Rename the brand by editing `name` / `tagline` here only.
   ========================================================================= */

export const site = {
  name: "NOCTRA",
  legalName: "NOCTRA Performance",
  tagline: "Own the dark.",
  taglinePl: "Zapanuj nad ciemnością.",
  description:
    "Inżynieria światła i narzędzi inspekcyjnych dla kierowców. Magnetyczne lampy COB, endoskopy USB-C i EDC zaprojektowane dla garażu, trasy i terenu.",
  url: "https://noctra.store",
  locale: "pl-PL",
  currency: "PLN",
  email: "kontakt@noctra.store",
  social: {
    instagram: "https://instagram.com/noctra",
    tiktok: "https://tiktok.com/@noctra",
    youtube: "https://youtube.com/@noctra",
  },
} as const;

export type MegaColumn = {
  title: string;
  links: { label: string; href: string; tag?: "new" | "hot" }[];
};

export type NavItem = {
  label: string;
  href: string;
  columns?: MegaColumn[];
  featured?: { title: string; copy: string; href: string; handle: string };
};

export const nav: NavItem[] = [
  {
    label: "Oświetlenie",
    href: "/collections/oswietlenie",
    columns: [
      {
        title: "Lampy warsztatowe",
        links: [
          { label: "Lampy COB obrotowe", href: "/collections/lampy-cob", tag: "hot" },
          { label: "Latarki magnetyczne", href: "/collections/latarki-magnetyczne" },
          { label: "Lampy inspekcyjne", href: "/collections/lampy-inspekcyjne" },
          { label: "Panele LED", href: "/collections/panele-led" },
        ],
      },
      {
        title: "Do auta",
        links: [
          { label: "Oświetlenie bagażnika", href: "/collections/oswietlenie-bagaznika" },
          { label: "Lampy awaryjne", href: "/collections/lampy-awaryjne", tag: "new" },
          { label: "Akcesoria & magnesy", href: "/collections/akcesoria-oswietlenie" },
        ],
      },
    ],
    featured: {
      title: "VANTA COB-1200",
      copy: "Obrotowa lampa warsztatowa 1200 lm na magnes i haki.",
      href: "/products/vanta-cob-1200",
      handle: "vanta-cob-1200",
    },
  },
  {
    label: "Inspekcja",
    href: "/collections/inspekcja",
    columns: [
      {
        title: "Kamery & endoskopy",
        links: [
          { label: "Endoskopy USB-C", href: "/collections/endoskopy-usb-c", tag: "hot" },
          { label: "Kamery inspekcyjne", href: "/collections/kamery-inspekcyjne" },
          { label: "Sondy & sztywne kable", href: "/collections/sondy" },
        ],
      },
      {
        title: "Diagnostyka",
        links: [
          { label: "Mierniki & testery", href: "/collections/mierniki" },
          { label: "Kamery termowizyjne", href: "/collections/termowizja", tag: "new" },
        ],
      },
    ],
    featured: {
      title: "PROBE 5.5",
      copy: "Endoskop USB-C 5.5 mm — zajrzyj w każdy zakamarek silnika.",
      href: "/products/probe-5-5",
      handle: "probe-5-5",
    },
  },
  {
    label: "Narzędzia & EDC",
    href: "/collections/narzedzia",
    columns: [
      {
        title: "EDC kierowcy",
        links: [
          { label: "Zestawy EDC", href: "/collections/edc" },
          { label: "Multitoole", href: "/collections/multitoole" },
          { label: "Młotki bezpieczeństwa", href: "/collections/mlotki-bezpieczenstwa" },
        ],
      },
      {
        title: "Warsztat",
        links: [
          { label: "Klucze & nasadki", href: "/collections/klucze" },
          { label: "Magnetyczne tace", href: "/collections/tace-magnetyczne" },
        ],
      },
    ],
  },
  {
    label: "Organizacja",
    href: "/collections/organizacja",
    columns: [
      {
        title: "Bagażnik",
        links: [
          { label: "Organizery bagażnika", href: "/collections/organizery-bagaznika" },
          { label: "Maty & wykładziny", href: "/collections/maty" },
          { label: "Uchwyty & mocowania", href: "/collections/uchwyty" },
        ],
      },
    ],
  },
  { label: "Bestsellery", href: "/collections/bestsellery" },
];

export const footerNav = {
  Sklep: [
    { label: "Oświetlenie", href: "/collections/oswietlenie" },
    { label: "Inspekcja", href: "/collections/inspekcja" },
    { label: "Narzędzia & EDC", href: "/collections/narzedzia" },
    { label: "Bestsellery", href: "/collections/bestsellery" },
  ],
  Pomoc: [
    { label: "Wysyłka & zwroty", href: "/pomoc/wysylka" },
    { label: "Gwarancja", href: "/pomoc/gwarancja" },
    { label: "Śledzenie zamówienia", href: "/konto/zamowienia" },
    { label: "FAQ", href: "/pomoc/faq" },
  ],
  Marka: [
    { label: "Nasza historia", href: "/o-nas" },
    { label: "Recenzje", href: "/recenzje" },
    { label: "Kontakt", href: "/kontakt" },
  ],
} as const;
