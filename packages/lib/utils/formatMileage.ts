export function formatMilage(milage: number) {
  if (milage >= 1000) {
    const formatted = (milage / 1000).toFixed(1);
    // Remove .0 if decimal is zero
    return formatted.endsWith('.0') ? `${Math.floor(milage / 1000)}k` : `${formatted}k`;
  }
  return milage?.toString();
}
