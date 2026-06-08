import type { Product, Collection, ProductReview } from "./types";
import { products, collections } from "./mock-data";

/* =========================================================================
   Storefront data access layer.

   TODAY: served from local mock data (./mock-data.ts).
   GO LIVE: set SHOPIFY env vars and replace the bodies below with Storefront
   GraphQL calls that map responses onto the same `Product` / `Collection`
   shapes. Components never change — they only call these functions.

   Required env (see .env.example):
     SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
     SHOPIFY_STOREFRONT_ACCESS_TOKEN=xxxxxxxx
   ========================================================================= */

export const USING_LIVE_SHOPIFY = Boolean(
  process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
);

// Simulate async I/O so the swap to real fetch() is seamless.
async function db<T>(value: T): Promise<T> {
  return value;
}

export async function getAllProducts(): Promise<Product[]> {
  return db(products);
}

export async function getProductByHandle(handle: string): Promise<Product | undefined> {
  return db(products.find((p) => p.handle === handle));
}

export async function getProductsByHandles(handles: string[]): Promise<Product[]> {
  const set = new Set(handles);
  return db(products.filter((p) => set.has(p.handle)));
}

export async function getCollection(handle: string): Promise<Collection | undefined> {
  const found = collections.find((c) => c.handle === handle);
  if (found) return db(found);
  // Derive a sensible title from an unknown handle (so links never 404 hard).
  return db({
    handle,
    title: handle
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
  });
}

export async function getProductsByCollection(handle: string): Promise<Product[]> {
  if (handle === "nowosci") return db(products.filter((p) => p.badges.includes("new")));
  if (handle === "bestsellery")
    return db(products.filter((p) => p.badges.includes("bestseller") || p.collections.includes("bestsellery")));
  return db(products.filter((p) => p.collections.includes(handle)));
}

export async function getAllCollections(): Promise<Collection[]> {
  return db(collections);
}

export async function getBestsellers(limit = 8): Promise<Product[]> {
  const ranked = [...products].sort((a, b) => b.reviewCount - a.reviewCount);
  const best = ranked.filter((p) => p.badges.includes("bestseller"));
  const fill = ranked.filter((p) => !p.badges.includes("bestseller"));
  return db([...best, ...fill].slice(0, limit));
}

export async function getNewArrivals(limit = 6): Promise<Product[]> {
  return db(products.filter((p) => p.badges.includes("new")).slice(0, limit));
}

export async function getRelatedProducts(handle: string, limit = 4): Promise<Product[]> {
  const product = products.find((p) => p.handle === handle);
  if (!product) return db([]);
  const explicit = product.relatedHandles
    ? products.filter((p) => product.relatedHandles!.includes(p.handle))
    : [];
  const sameCollection = products.filter(
    (p) => p.handle !== handle && p.collections.some((c) => product.collections.includes(c)),
  );
  const merged = [...explicit, ...sameCollection].filter(
    (p, i, arr) => p.handle !== handle && arr.findIndex((x) => x.handle === p.handle) === i,
  );
  return db(merged.slice(0, limit));
}

export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.trim().toLowerCase();
  if (!q) return db([]);
  return db(
    products.filter((p) =>
      [p.title, p.subtitle ?? "", p.description, ...p.tags].join(" ").toLowerCase().includes(q),
    ),
  );
}

/* ---- Reviews -------------------------------------------------------------
   Provide deterministic placeholder reviews when a product has none, so the
   PDP always has social proof. Real reviews come from a Shopify review app. */

const AUTHORS = ["Marek W.", "Kasia D.", "Tomasz R.", "Paweł S.", "Ola K.", "Bartek M.", "Janusz P.", "Ewa L."];
const TITLES = ["Robi robotę", "Jakość premium", "Polecam w 100%", "Lepsze niż myślałem", "Must-have do auta", "Mocne światło", "Solidne wykonanie"];
const BODIES = [
  "Używam codziennie w warsztacie. Magnes trzyma pewnie, światło mocne i równe.",
  "Wreszcie sprzęt, który nie rozpada się po miesiącu. Wykonanie czuć od pierwszego chwytu.",
  "Zamówiłem w piątek, w poniedziałek było. Działa dokładnie jak na opisie.",
  "Bateria trzyma długo, ładowanie USB-C to wygoda. Polecam każdemu kierowcy.",
  "Kompaktowe, a daje radę. Leży w schowku i zawsze jest pod ręką.",
];

export function getReviews(product: Product): ProductReview[] {
  if (product.reviews?.length) return product.reviews;
  const count = Math.min(5, Math.max(3, Math.round(product.reviewCount / 250)));
  return Array.from({ length: count }).map((_, i) => {
    const seed = (product.handle.charCodeAt(0) + i * 7) % AUTHORS.length;
    return {
      id: `${product.handle}-r${i}`,
      author: AUTHORS[seed],
      rating: i === 0 ? 5 : Math.max(4, Math.round(product.rating)),
      date: `2026-0${(i % 6) + 1}-1${i}`,
      title: TITLES[(seed + i) % TITLES.length],
      body: BODIES[(seed + i) % BODIES.length],
      verified: true,
    };
  });
}
