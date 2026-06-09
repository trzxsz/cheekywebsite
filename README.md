# NOCTRA — motyw Shopify

> **Own the dark.** Premium, ciemny motyw automotive (cyber garage / performance tuning) dla sklepu z oświetleniem warsztatowym, narzędziami inspekcyjnymi i EDC dla kierowców.

Motyw Shopify **Online Store 2.0** (Liquid), gotowy do importu z GitHuba. Zero zależności front-endowych — animowane tło to czysty **WebGL**, interakcje to czysty JS.

---

## ✨ Co zawiera

- **Kinowy hero** z animowanym tłem shadera (WebGL, kolory marki, pauza poza ekranem, `prefers-reduced-motion`).
- **Ekspozycja głównego produktu** (lampa COB) w hero.
- Sticky **nagłówek** z mega menu, animowaną wyszukiwarką i licznikiem koszyka.
- **Wysuwany koszyk (drawer)** z AJAX, paskiem darmowej wysyłki i upsellami.
- Strona **produktu**: galeria + miniatury, warianty (chipy), sticky add-to-cart, akordeony (opis/specyfikacja/dostawa), trust badges, produkty powiązane, schema.org.
- Strona **kolekcji**: siatka, sortowanie, filtry (Search & Discovery), paginacja.
- Sekcje home: bestsellery, kategorie, „dlaczego my", opinie, FAQ, newsletter, lifestyle, pasek zaufania.
- **Konto klienta**: logowanie, rejestracja, konto, zamówienie, adresy, reset/aktywacja hasła.
- **SEO**: meta, OpenGraph, Twitter, JSON-LD (Organization + Product).
- Strona **hasła**, **404**, **wyszukiwania**, **bloga**, **wpisu**, **listy kolekcji**.
- Wishlist (localStorage), magnetyczne przyciski, reveal-on-scroll.

## 🎨 System wizualny

- **Kolory** (edytowalne w *Motyw → Dostosuj → Ustawienia → Kolory*): graphite `#0a0a0c`, molten `#ff4d2e`, ember `#ff9500`, volt `#2e7bff`.
- **Fonty**: Chakra Petch (nagłówki), Sora (tekst), JetBrains Mono (etykiety/specyfikacje).

## 🗂 Struktura

```
layout/        theme.liquid, password.liquid
templates/     index, product, collection, cart, page, search, 404,
               blog, article, list-collections, password + customers/*
sections/      header(+group), footer(+group), hero, featured-collection,
               collection-list, icon-columns, testimonials, faq, newsletter,
               image-with-text, marquee, main-* (product/collection/cart/…)
snippets/      icon, price, star-rating, product-card, product-media,
               cart-drawer, search-overlay, meta-tags
assets/        base.css, theme.js, shader-bg.js
config/        settings_schema.json, settings_data.json
locales/       en.default.json
```

---

## 🚀 Import z GitHuba do Shopify (krok po kroku)

1. W panelu Shopify wejdź w **Sklep online → Szablony**.
2. Kliknij **Dodaj szablon → Połącz z GitHub** (Connect from GitHub).
3. Zaloguj się do GitHub i autoryzuj aplikację Shopify.
4. Wybierz repozytorium **`trzxsz/cheekywebsite`** i gałąź **`main`**.
5. Shopify zaimportuje motyw **NOCTRA**. Kliknij **Opublikuj**, gdy będziesz gotów.

> Każdy `git push` na `main` automatycznie zsynchronizuje zmiany do Shopify.

### Po imporcie — konfiguracja (5 minut)

1. **Menu**: *Sklep online → Nawigacja* → edytuj menu `main-menu` (Oświetlenie, Inspekcja, Narzędzia & EDC, Organizacja). Pozycje z podpunktami tworzą mega menu. Utwórz też menu `footer`.
2. **Produkty**: dodaj produkty i przypisz je do **kolekcji**, których uchwyty (handle) wpisałeś w menu (np. `lampy-cob`, `endoskopy-usb-c`).
3. **Hero**: *Dostosuj → sekcja Hero* → w polu „Główny produkt" wybierz lampę COB.
4. **Bestsellery**: *Dostosuj → Polecane produkty* → wskaż kolekcję `bestsellery`.
5. **Tagi produktów** (sterują kartami): `bestseller`, `new`, `limited`. Placeholder ikony: tag `icon:flashlight` / `icon:camera` …, kolor `accent:volt`.

---

## 🛒 Gotowy opis produktu — lampa COB (wklej w Shopify)

**Tytuł:** VANTA COB-DUO 1600 — dwustronna magnetyczna lampa warsztatowa
**Tagi:** `bestseller`, `icon:flashlight`, `accent:molten`
**Opis:**
> Dwie listwy COB, dwa magnesy, dwa haki — światło dokładnie tam, gdzie pracujesz. Przyklej do maski, zawieś na masce chłodnicy albo trzymaj w dłoni. 1600 lumenów równego światła, korpus obrotowy 360°, ładowanie USB-C.

**Warianty:** Kolor (Molten Red / Stealth Black) × Moc (1200 lm / 1600 lm)
**Specyfikacja (metafield `custom.specs`):** 1600 lm · akumulator 4000 mAh · do 8 h · USB-C · IP65 · magnes + haki + obrót 360°

---

## 🧑‍💻 Podgląd lokalny (opcjonalnie)

Wymaga darmowego konta **Shopify Partners** + sklepu testowego:

```bash
npm install -g @shopify/cli@latest
shopify theme dev        # podgląd na żywo
shopify theme check      # walidacja motywu
```

## 📦 Gałęzie

- **`main`** — motyw Shopify (ten dokument).
- **`nextjs-reference`** — wcześniejszy szkielet headless Next.js (zachowany jako referencja designu).

🤖 Generated with [Claude Code](https://claude.com/claude-code)
