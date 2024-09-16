<script setup>
import { pages } from '@/router/pages'
import { useRouter } from 'vue-router'
const router = useRouter()

const handleToolClick = (path) => {
  router.push(path)
}
</script>

<template>
  <div class="d-flex flex-column flex-center gap-10 h-100 w-100">
    <span class="h1">Welcome to Mervyn's Tools</span>
    <div class="d-flex w-100 flex-center gap-8 flex-wrap">
      <div
        class="min-w-300px w-20 h-150px bg-white rounded-lg p-4 cursor-pointer card-item d-flex flex-column gap-3"
        v-for="tool in pages.filter((item) => item.isTool)"
        :key="tool.path"
        @click="handleToolClick(tool.path)"
      >
        <span class="fs-1-2">
          {{ tool.name }}
        </span>
        <span class="text-black-50">
          {{ tool.description }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card-item {
  transition: all 300ms linear;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0px 0px 20px 0px var(--gray-light);
  }
}
</style>