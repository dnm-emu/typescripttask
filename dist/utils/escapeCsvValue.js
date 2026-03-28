export function escapeCsvValue(value) {
    const needsQuotes = [',', '"', '\n'].some(ch => value.includes(ch));
    if (!needsQuotes) {
        return value;
    }
    return `"${value.replace(/"/g, '""')}"`;
}
//# sourceMappingURL=escapeCsvValue.js.map