<script setup>
import { useGlobalStore } from '@/store'
const store = useGlobalStore()
const goGithub = () => {
  window.open('https://github.com/mervynlam/tools')
}
const handleTeaClick = () => {
  store.open_donate()
}
</script>
<template>
  <header>
    <div class="w-100 h-60px bg-blue-lighter d-flex flex-row-reverse align-items-center">
      <var-space class="d-flex align-items-center mx-2">
        <var-button @click="handleTeaClick" type="success">
          <var-space> <var-icon name="thumb-up-outline" />赞助一下 </var-space>
        </var-button>
        <var-button text round @click="goGithub"><var-icon name="github" size="30" /></var-button>
      </var-space>
    </div>
  </header>
</template>