export function fdiv(a: number, b: number) {
  const x = Math.floor(a / b)
  const y = a % b
  return [x, y]
}
