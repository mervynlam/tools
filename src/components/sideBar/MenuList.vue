<script setup>
import { pages } from '@/router/pages'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const menuIndex = ref(0)
const router = useRouter()
const handleMenuClick = (index, path) => {
  menuIndex.value = index
  router.push(path)
}
</script>
<template>
  <div class="d-flex flex-column flex-center w-100 menu-list">
    <div class="w-100 px-3 py-1" v-for="(page, index) in pages" :key="page.path">
      <div
        :class="[
          'menu-item w-100 rounded-pill text-center py-2 cursor-pointer',
          { actived: menuIndex === index }
        ]"
        @click="handleMenuClick(index, page.path)"
      >
        {{ page.name }}
      </div>
    </div>
  </div>
</template>