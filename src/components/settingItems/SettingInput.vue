<script setup>
import { NInput } from 'naive-ui'
const value = defineModel('value')
const { label, classname, placeholder, size } = defineProps([
  'label',
  'classname',
  'placeholder',
  'size'
])
</script>
<template>
  <div :class="['d-flex flex-center gap-3', classname]">
    <span class="text-nowrap w-10" v-if="label">{{ label }}</span>
    <n-input round v-model:value="value" :placeholder="placeholder" :size="size" />
  </div>
</template>