export function largestRemainderPercentages(values: number[]): number[] {
  const safe = values.map((value) => Math.max(0, Number.isFinite(value) ? value : 0));
  const total = safe.reduce((sum, value) => sum + value, 0);
  if (!total) return safe.map(() => 0);

  const exact = safe.map((value) => (value / total) * 100);
  const rounded = exact.map(Math.floor);
  const remainderOrder = exact
    .map((value, index) => ({ index, remainder: value - rounded[index] }))
    .sort((left, right) => right.remainder - left.remainder || left.index - right.index);
  let points = 100 - rounded.reduce((sum, value) => sum + value, 0);
  for (let index = 0; index < points; index += 1) rounded[remainderOrder[index].index] += 1;
  return rounded;
}

export function percentageMap(options: readonly string[], counts: Record<string, number>): Record<string, number> {
  const values = largestRemainderPercentages(options.map((option) => counts[option] ?? 0));
  return Object.fromEntries(options.map((option, index) => [option, values[index]]));
}
