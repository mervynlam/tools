<script setup>
import { NRadio, NRadioGroup, NSpace } from 'naive-ui'
const value = defineModel('value')
const { label, classname, options } = defineProps(['label', 'classname', 'options'])
</script>
<template>
  <div :class="['d-flex align-items-center gap-3', classname]">
    <span class="text-nowrap w-15" v-if="label">{{ label }}</span>
    <n-radio-group v-model:value="value">
      <n-space size="large">
        <n-radio v-for="item in options" :key="item.value" :value="item.value">
          {{ item.label }}
        </n-radio>
      </n-space>
    </n-radio-group>
    <slot></slot>
  </div>
</template>