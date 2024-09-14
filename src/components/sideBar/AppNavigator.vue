<script setup>
import { useRouter } from 'vue-router'
import MenuList from './MenuList.vue'
const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <aside class="w-250px vh-100 bg-blue-lighter d-flex flex-column align-items-center">
    <div class="w-100 h-100px text-center h1 d-flex flex-center">
      <span class="cursor-pointer" @click="goHome">Tools</span>
    </div>
    <MenuList />
  </aside>
</template>