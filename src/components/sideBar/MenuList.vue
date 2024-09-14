<script setup>
import { pages } from '@/router/pages'
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()
const handleMenuClick = (path) => {
  router.push(path)
}
</script>
<template>
  <div class="d-flex flex-column flex-center w-100 menu-list">
    <div class="w-100 px-3 py-1" v-for="page in pages" :key="page.path">
      <div
        :class="[
          'menu-item w-100 rounded-pill text-center py-2 cursor-pointer',
          { actived: route.path === page.path }
        ]"
        @click="handleMenuClick(page.path)"
      >
        {{ page.name }}
      </div>
    </div>
  </div>
</template>