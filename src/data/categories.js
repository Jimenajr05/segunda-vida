/**
 * Categorías oficiales de la tienda SEGUNDA VIDA
 * Nota: No se utilizan emojis para mantener un estilo limpio, sobrio y elegante.
 */
export const CATEGORIES = [
  "Todos",
  "Blusas",
  "Pantalones",
  "Shorts",
  "Faldas",
  "Vestidos",
  "Enterizos",
  "Blusas deportivas",
  "Licras deportivas",
  "Bodies",
  "Conjuntos",
  "Tops deportivos",
  "Trajes de baño",
  "Bolsos",
  "Guantes de gym",
  "Pijamas",
  "Shorts deportivos",
  "Faldas deportivas",
  "Salidas de baño",
  "Ropa de perrito",
  "Zapatos",
  "Abrigos"
];

export const SIZES = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "Única"
];

export const PRICE_RANGES = [
  { id: "all", label: "Cualquier precio", min: 0, max: Infinity },
  { id: "under-5k", label: "Menos de ₡5.000", min: 0, max: 4999 },
  { id: "5k-10k", label: "₡5.000 - ₡10.000", min: 5000, max: 10000 },
  { id: "10k-20k", label: "₡10.000 - ₡20.000", min: 10000, max: 20000 },
  { id: "over-20k", label: "Más de ₡20.000", min: 20001, max: Infinity }
];
