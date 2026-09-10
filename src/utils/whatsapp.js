import { formatCurrency } from './currency';

export const STORE_PHONE_RAW = "50663342879";
export const STORE_PHONE_DISPLAY = "+506 6334-2879";

/**
 * Genera el mensaje y enlace de WhatsApp para las prendas del carrito
 * @param {Array} items - Lista de prendas en el carrito
 * @returns {string} - URL lista para abrir WhatsApp
 */
export function generateCartWhatsAppUrl(items) {
  if (!items || items.length === 0) return '#';

  const total = items.reduce((sum, item) => sum + (item.price || 0), 0);

  const lines = [
    "Hola, quiero consultar por estas prendas:\n"
  ];

  items.forEach(item => {
    lines.push(`- ${item.code} — ${item.name} — Talla ${item.size} — ${formatCurrency(item.price)}`);
  });

  lines.push(`\nTotal: ${formatCurrency(total)}`);
  lines.push("\n¿Todavía están disponibles?");

  const messageText = lines.join('\n');
  return `https://wa.me/${STORE_PHONE_RAW}?text=${encodeURIComponent(messageText)}`;
}

/**
 * Genera el mensaje y enlace de WhatsApp para consultar por una sola prenda
 * @param {Object} product - Prenda individual
 * @returns {string} - URL lista para abrir WhatsApp
 */
export function generateSingleProductWhatsAppUrl(product) {
  if (!product) return '#';

  const messageText = `Hola, quiero consultar por esta prenda:

- ${product.code} — ${product.name} — Talla ${product.size} — ${formatCurrency(product.price)}

¿Todavía está disponible?`;

  return `https://wa.me/${STORE_PHONE_RAW}?text=${encodeURIComponent(messageText)}`;
}
