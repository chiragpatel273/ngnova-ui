export interface SortState {
  readonly key: string;
  readonly direction: 'asc' | 'desc';
}

/** Returns a sorted copy. `value` maps a row and column key to a comparable value. */
export function sortRows<T>(
  rows: readonly T[],
  sort: SortState | null,
  value: (row: T, key: string) => string | number,
): T[] {
  if (!sort) return [...rows];
  const factor = sort.direction === 'asc' ? 1 : -1;
  return [...rows].sort((left, right) => {
    const a = value(left, sort.key);
    const b = value(right, sort.key);
    const result =
      typeof a === 'number' && typeof b === 'number'
        ? a - b
        : String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
    return result * factor;
  });
}

export function paginate<T>(rows: readonly T[], page: number, pageSize: number): T[] {
  const start = (Math.max(1, page) - 1) * pageSize;
  return rows.slice(start, start + pageSize);
}

/** Serializes rows to CSV and starts a download in the browser. */
export function downloadCsv(
  filename: string,
  header: readonly string[],
  rows: readonly (readonly (string | number)[])[],
): void {
  const escape = (cell: string | number): string => {
    const text = String(cell);
    return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
  };
  const csv = [header, ...rows].map((row) => row.map(escape).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
