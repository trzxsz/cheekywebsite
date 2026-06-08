/* =========================================================================
   Domain types — modeled on the Shopify Storefront API, simplified for the UI.
   The live adapter (src/lib/shopify/index.ts) maps Storefront GraphQL
   responses onto these exact shapes, so components never change.
   ========================================================================= */

export type Badge = "bestseller" | "new" | "limited";
export type Accent = "molten" | "volt";

export interface ProductImage {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface ProductOption {
  name: string;
  values: string[];
}

export interface ProductVariant {
  id: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  available: boolean;
  /** e.g. { "Kolor": "Czarny", "Moc": "1200 lm" } */
  options: Record<string, string>;
  sku?: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  verified?: boolean;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  subtitle?: string;
  vendor: string;
  description: string;
  features: string[];
  specs: ProductSpec[];
  price: number;
  compareAtPrice?: number;
  currencyCode: string;
  rating: number;
  reviewCount: number;
  /** May be empty during pre-Shopify phase; UI falls back to a branded placeholder. */
  images: ProductImage[];
  options: ProductOption[];
  variants: ProductVariant[];
  collections: string[];
  badges: Badge[];
  tags: string[];
  faq?: FaqItem[];
  reviews?: ProductReview[];
  relatedHandles?: string[];
  /** Presentation hints for the placeholder media + accent system. */
  accent: Accent;
  icon: string;
}

export interface Collection {
  handle: string;
  title: string;
  description?: string;
  productHandles?: string[];
}

export interface CartLine {
  id: string;
  variantId: string;
  productHandle: string;
  title: string;
  variantTitle: string;
  image?: ProductImage;
  price: number;
  quantity: number;
  accent: Accent;
  icon: string;
}

export interface Cart {
  lines: CartLine[];
  subtotal: number;
  currencyCode: string;
}
