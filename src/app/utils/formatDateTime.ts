export const formatDateDisplay = (iso?: string | null): string => {
  if (!iso) return '-';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '-';
  const day = d.getDate();
  const suffix = (n: number) => {
    const j = n % 10, k = n % 100;
    if (j === 1 && k !== 11) return 'st';
    if (j === 2 && k !== 12) return 'nd';
    if (j === 3 && k !== 13) return 'rd';
    return 'th';
  };
  const month = d.toLocaleString('en-US', { month: 'long' });
  const year = d.getFullYear();
  return `${day}${suffix(day)} ${month}, ${year}`;
};

export const formatTimeDisplay = (iso?: string | null): string => {
  if (!iso) return '-';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '-';
  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 -> 12
  return `${hours}:${minutes}${ampm}`;
};

export const formatExpectedRange = (from?: string | null, to?: string | null): string => {
  if (!from || !to) return '-';
  const f = formatTimeDisplay(from);
  const t = formatTimeDisplay(to);
  if (f === '-' || t === '-') return '-';
  return `${f} - ${t}`;
};

export type { };
