<script setup lang="ts">
import type { Block } from '~/composables'
import { Direction, dx, dy, useFireworks } from '~/composables'
import { fdiv } from '~/composables/fdiv'
const side = ref(3)
const _side = ref(3)
const _sideSquared = ref(9)

const unordered = ref<Block[]>([])
const steps = ref(0)
const { play } = useFireworks({
  duration: 1000,
})

function gameStart() {
  if (side.value > 10 || side.value < 3) {
    // eslint-disable-next-line no-alert
    window.alert('Not supported!')
    return
  }
  _side.value = side.value
  unordered.value = genShuffledSeq(_side.value)
  updateCanMove()
  steps.value = 0
  _sideSquared.value = _side.value ** 2
}

function swapItem(i: number, j: number) {
  const temp = unordered.value[i].val
  unordered.value[i].val = unordered.value[j].val
  unordered.value[j].val = temp
}

function moveBlock(index: number) {
  if (unordered.value[index].canMove === Direction.NONE) {
    updateCanMove()
    return
  }
  const zeroIndex = unordered.value.findIndex(it => it.val === 0)
  swapItem(zeroIndex, index)
  updateCanMove()
  steps.value++
  if (won())
    play()
}

function updateCanMove() {
  unordered.value.forEach((it) => {
    it.canMove = Direction.NONE
  })
  const zeroIndex = unordered.value.findIndex(it => it.val === 0)
  const [x, y] = fdiv(zeroIndex, _side.value)
  for (let i = Direction.UP; i <= Direction.RIGHT; i++) {
    const nx = x + dx[i]
    const ny = y + dy[i]

    if (nx < 0 || ny < 0 || nx >= _side.value || ny >= _side.value)
      continue
    const nIndex = nx * _side.value + ny
    unordered.value[nIndex].canMove = i
  }
}

function won() {
  for (let i = 0; i < unordered.value.length; i++) {
    if (unordered.value[i].val !== (i + 1) % _sideSquared.value)
      return false
  }
  return true
}

gameStart()
</script>

<template>
  <div>
    <UInput v-model.number="side">
      <template #inner-right>
        <div
          i-carbon-arrow-right icon-btn
          @click="gameStart"
        />
      </template>
    </UInput>
  </div>
  <div
    :style="{ height: `${3 * _side + 0.5 * (_side + 1)}rem` }"
    m-2 flex justify-center
  >
    <div
      v-auto-animate="{ duration: 100 }"
      absolute
      shadow-inner
      :style="{
        width: `${3 * _side + 0.5 * (_side + 1)}rem`,
        height: `${3 * _side + 0.5 * (_side + 1)}rem`,
      }"
    >
      <button
        v-for="(el, i) in unordered"
        :key="el.val" absolute
        w-3rem h-3rem shadow select-none
        :style="{
          top: `${0.5 + Math.floor(i / _side) * 3.5}rem`,
          left: `${0.5 + Math.floor(i % _side) * 3.5}rem`,
          display: el.val === 0 ? 'none' : '',
          cursor: el.canMove === Direction.NONE ? 'auto' : 'pointer',
        }"
        @click="moveBlock(i)"
      >
        {{ el.val }}
      </button>
    </div>
  </div>
  <div>{{ steps }} steps</div>
</template>

