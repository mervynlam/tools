<script setup>
import { NColorPicker } from 'naive-ui'
const value = defineModel('value')
const { label, classname } = defineProps(['label', 'classname'])
</script>
<template>
  <div :class="['d-flex flex-center gap-3', classname]">
    <span class="text-nowrap w-15">{{ label }}</span>
    <n-color-picker v-model:value="value"></n-color-picker>
  </div>
</template>