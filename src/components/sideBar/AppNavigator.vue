<script setup>
import { useRouter } from 'vue-router'
import MenuList from './MenuList.vue'
const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <aside class="vh-100 bg-blue-lighter d-flex flex-column align-items-center">
    <div class="title w-100 h-100px text-center h1 d-flex flex-center">
      <span class="cursor-pointer" @click="goHome">Tools</span>
    </div>
    <MenuList />
  </aside>
</template>
<style lang="scss" scoped>
@media only screen and (max-width: 600px) {
  .title {
    visibility: hidden;
  }
  aside {
    min-width: 90px;
  }
}
@media only screen and (min-width: 601px) {
  aside {
    min-width: 250px;
  }
}
</style>