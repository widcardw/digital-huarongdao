<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: string | number
  disabled?: boolean
}>(), {
  disabled: false,
})

const emits = defineEmits(['update:modelValue', 'blur', 'focus'])

const value = useVModel(props, 'modelValue', emits)
let focused = $ref(false)

function inputFocus() {
  focused = true
  emits('focus')
}

function inputBlur() {
  focused = false
  emits('blur')
}
</script>

<template>
  <div
    class="outer"
    inline-flex items-center
    space-x-2
  >
    <slot name="outer-left" />
    <div
      class="inner"
      outline="teal-600"
      shadow rounded
      inline-flex items-center
      space-x-2 px-2
      :class="{ 'outline focus:shadow-inner': focused, 'outline-transparent': !focused }"
      transition-all
    >
      <slot name="inner-left" />
      <input
        v-model="value"
        :disabled="disabled"
        class="disabled:op-30 bg-transparent !outline-none"
        transition-all
        p="y-1" w-full
        @blur="inputBlur"
        @focus="inputFocus"
      >
      <slot name="inner-right" />
    </div>
    <slot name="outer-right" />
  </div>
</template>
