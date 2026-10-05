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

export const fragrances: Fragrance[] = [
  {
    id: "amber-touch",
    name: "Amber Touch",
    size: "60ml",
    concentration: "Extrait De Parfum",
    notes: [],
    inspiration: null,
    price: null,
    reviews: null,
    labelReady: true,
  },
  ...Array.from({ length: 6 }, (_, index) => ({
    id: `catalog-slot-${index + 2}`,
    name: null,
    size: null,
    concentration: null,
    notes: [],
    inspiration: null,
    price: null,
    reviews: null,
    labelReady: false,
  })),
];

export const productLabel = (fragrance: Fragrance, index: number) =>
  fragrance.name ?? `Fragrance ${String(index + 1).padStart(2, "0")}`;
