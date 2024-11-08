export type DataRow = Record<string, string | number>

export function mockData(size = 5): DataRow[] {
  const length = Math.floor(Math.random() * 5 + size)
  const ids = crypto.getRandomValues(new Uint32Array(length))
  return Array.from({ length }, (_, i) => ({
    id: ids[i],
    no: i + 1,
    title: `Song ${i + 1}`,
    length: 5 + i,
  }))
}
