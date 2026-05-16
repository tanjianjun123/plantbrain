<template>
  <div class="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto relative">
    <!-- 主内容区域 -->
    <main class="flex-1 overflow-y-auto pb-20">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- 底部导航栏 -->
    <nav class="fixed bottom-0 left-0 right-0 max-w-md mx-auto glass-effect border-t border-gray-100 z-50">
      <div class="flex justify-around items-center h-16 px-2">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="flex flex-col items-center justify-center w-16 py-1 transition-all duration-200 rounded-xl"
          :class="$route.path === item.path ? 'text-primary-600 scale-110' : 'text-gray-400 hover:text-gray-600'"
        >
          <span class="text-2xl mb-0.5">{{ item.icon }}</span>
          <span class="text-xs font-medium">{{ item.label }}</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const navItems = ref([
  { icon: '🏠', label: '首页', path: '/' },
  { icon: '🌿', label: '植物', path: '/plants' },
  { icon: '📅', label: '养护', path: '/care' },
  { icon: '🤖', label: 'AI', path: '/ai/chat' },
  { icon: '💬', label: '社区', path: '/community' },
])
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
