<script setup>
import { reactive } from 'vue'
const config = reactive({
  words: '',
  size: 25,
  angle: '',
  space: '',
  color: ''
})
const handleInput = (...rest) => {
  console.log('rest: ', rest)
}
</script>
<template>
  <div class="d-flex flex-column gap-3">
    <var-input v-model="config.words" variant="outlined" placeholder="水印文字" size="small" />
    <div class="d-flex">
      <div class="w-50 d-flex flex-center gap-3">
        大小
        <var-slider v-model="config.size" @input="handleInput" @onUpdate="handleInput" />
      </div>
    </div>
  </div>
</template>