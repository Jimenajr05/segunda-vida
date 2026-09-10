/**
 * Formatea un monto numérico a formato de Colones Costarricenses (₡)
 * Ejemplo: 6500 -> "₡6.500", 15000 -> "₡15.000"
 * @param {number} amount - Precio numérico
 * @returns {string} - Formato en colones con símbolo ₡ y separador de miles
 */
export function formatCurrency(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '₡0';
  }
  const parts = Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `₡${parts}`;
}

