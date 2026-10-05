export type Fragrance = {
  id: string;
  name: string | null;
  size: string | null;
  concentration: string | null;
  notes: string[];
  inspiration: string | null;
  price: string | null;
  reviews: number | null;
  labelReady: boolean;
};

const amberTouchPrototype = {
  name: "Amber Touch",
  size: "60ml",
  concentration: "Extrait De Parfum",
  notes: [],
  inspiration: null,
  price: null,
  reviews: null,
  labelReady: true,
} satisfies Omit<Fragrance, "id">;

// Prototype decision: repeat the supplied Amber Touch bottle seven times.
// Keep unique IDs so the selector remains a real seven-item data-driven rail.
export const fragrances: Fragrance[] = Array.from({ length: 7 }, (_, index) => ({
  ...amberTouchPrototype,
  id: `amber-touch-test-${index + 1}`,
}));

export const productLabel = (fragrance: Fragrance, index: number) =>
  fragrance.name ?? `Fragrance ${String(index + 1).padStart(2, "0")}`;
