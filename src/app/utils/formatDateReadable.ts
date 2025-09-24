/**
 * Converts ISO date string (e.g. 2026-07-29T23:59:59.999Z) to 'Month Day, Year' (e.g. July 29, 2026)
 * Returns '-' if input is falsy or invalid.
 */
export default function formatDateReadable(dateStr?: string | null): string {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}