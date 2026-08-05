// Same deterministic demo occupancy formula used by the 3D twin (Pallet.tsx),
// so vacant locations offered here line up with what the twin shows as empty.
const demoOccupancy = (column: number, level: number, depth: number) => ((column * 17 + level * 11 + depth * 7) % 100) < 70

const LEVEL_LETTERS = 'ABCDEFG'

export function getVacantLocations(room: number, limit = 60): string[] {
  const codes: string[] = []
  for (let column = 1; column <= 30 && codes.length < limit; column++) {
    for (let level = 0; level < 7 && codes.length < limit; level++) {
      for (let depth = 0; depth < 4 && codes.length < limit; depth++) {
        if (!demoOccupancy(column, level, depth)) {
          codes.push(`RM${room}-CO${column}-L${LEVEL_LETTERS[level]}-D${depth + 1}`)
        }
      }
    }
  }
  return codes
}
