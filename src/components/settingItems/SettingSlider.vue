<script setup>
import { NSlider } from 'naive-ui'
const value = defineModel('value')
const { label, min, max, step, classname, tooltip } = defineProps([
  'label',
  'min',
  'max',
  'step',
  'classname',
  'tooltip'
])
</script>
<template>
  <div :class="['d-flex flex-center gap-3', classname]">
    <span class="text-nowrap w-10">{{ label }}</span>
    <n-slider v-model:value="value" :min="min" :max="max" :step="step" :tooltip="tooltip" />
  </div>
</template>