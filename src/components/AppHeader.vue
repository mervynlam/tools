<script setup>
import { useGlobalStore } from '@/store'
import { NButton, NIcon } from 'naive-ui'
import { MdThumbsUp, LogoGithub } from '@vicons/ionicons4'
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
      <div class="d-flex align-items-center mx-2 gap-3">
        <n-button strong type="primary" @click="handleTeaClick">
          <div class="d-flex flex-center gap-3">
            <n-icon size="16">
              <MdThumbsUp />
            </n-icon>
            赞助一下
          </div>
        </n-button>
        <div
          @click="goGithub"
          class="cursor-pointer rounded-lg github w-30px h-30px d-flex justify-content-center"
        >
          <n-icon :component="LogoGithub" size="24" />
        </div>
      </div>
    </div>
  </header>
</template>
<style lang="scss" scoped>
.github:hover {
  background-color: var(--blue-lightest);
}
</style>