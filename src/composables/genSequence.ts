export enum Direction {
  UP, DOWN, LEFT, RIGHT,
  NONE,
}

export const dx = [1, -1, 0, 0]
export const dy = [0, 0, 1, -1]

export interface Block {
  val: number
  canMove: Direction
}

export function genOrderedSeq(side: number) {
  if (side > 10)
    throw new Error('The number is too large!')

  const squaredSide = side * side

  return Array(squaredSide).fill(0).map((_, i) => (i + 1) % squaredSide)
}

function shuffleArray<T>(array: Array<T>) {
  if (array.length <= 1)
    return array
  const length = array.length
  for (let i = 0; i < length; i++) {
    const temp = array[i]
    const count = Math.floor((i + 1) * Math.random())
    array[i] = array[count]
    array[count] = temp
  }
  return array
}

export function genShuffledSeq(side: number) {
  const ordered = genOrderedSeq(side)
  let seqHasAnswer = false
  let count = 0
  while (!seqHasAnswer && count < 20) {
    shuffleArray(ordered)
    seqHasAnswer = hasAnswer(ordered)
    count++
  }
  return ordered.map(it => ({
    val: it,
    canMove: Direction.NONE,
  } as Block))
  // return shuffleArray(ordered)
  // return ordered
}

export function hasAnswer(array: number[]) {
  const arr = array.filter(i => i !== 0)
  let res = 0
  for (let i = 1; i < arr.length; i++) {
    let query = 0
    for (let j = 0; j < i; j++) {
      if (arr[i] > arr[j])
        query++
    }
    res += query
  }
  return res % 2 === 0
}
