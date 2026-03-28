export function escapeCsvValue(value: string): string {
  const needsQuotes = [',', '"', '\n'].some(ch => value.includes(ch));
  if (!needsQuotes) {
    return value;
  }
  return `"${value.replace(/"/g, '""')}"`;
}
