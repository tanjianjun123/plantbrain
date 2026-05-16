<template>
  <div class="min-h-screen gradient-bg">
    <!-- 顶部问候区域 -->
    <div class="px-5 pt-12 pb-6">
      <div class="flex items-center justify-between mb-2">
        <div>
          <p class="text-gray-500 text-sm">早上好 👋</p>
          <h1 class="text-2xl font-bold text-gray-800">我的植物花园</h1>
        </div>
        <div class="relative">
          <button class="w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center text-xl hover:scale-105 transition-transform">
            🔔
          </button>
          <span class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">3</span>
        </div>
      </div>

      <!-- 天气卡片 -->
      <div class="card mt-4 !p-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="text-4xl">☀️</span>
          <div>
            <p class="text-2xl font-bold text-gray-800">22°C</p>
            <p class="text-sm text-gray-500">晴 · 上海</p>
          </div>
        </div>
        <div class="text-right text-sm text-gray-600">
          <p>湿度 65%</p>
          <p>适宜浇水 🌱</p>
        </div>
      </div>
    </div>

    <!-- 今日待办（集成AI智能提醒） -->
    <div class="px-5 pb-5">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-lg font-bold text-gray-800">📋 今日待办</h2>
        <router-link to="/care" class="text-primary-600 text-sm font-medium">查看全部 →</router-link>
      </div>

      <!-- AI智能提示条 -->
      <div class="card !p-3.5 !bg-gradient-to-r !from-blue-50 !to-cyan-50 !border-l-4 !border-l-blue-400 mb-3">
        <div class="flex items-center gap-2.5">
          <span class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-base flex-shrink-0">
            🤖
          </span>
          <p class="text-sm text-gray-700 flex-1 leading-relaxed">
            <span class="font-medium text-blue-700">AI 提醒：</span>
            根据天气数据，今天适合给<span class="font-medium">小薄荷</span>浇水，湿度刚好！
          </p>
          <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </div>
      </div>

      <div class="space-y-3">
        <div 
          v-for="task in todayTasks.slice(0, 3)" 
          :key="task.id"
          class="card !p-4 flex items-center gap-3 cursor-pointer hover:shadow-md transition-all"
          :class="{ 'border-l-4 border-l-red-400': task.overdue }"
        >
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-xl flex-shrink-0">
            {{ task.icon }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-gray-800 text-sm">{{ task.title }}</p>
            <p class="text-xs text-gray-500 truncate">{{ task.plantName }}</p>
          </div>
          <span 
            class="px-2 py-1 rounded-full text-xs font-medium flex-shrink-0"
            :class="task.overdue ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'"
          >
            {{ task.dueTime }}
          </span>
        </div>
      </div>
    </div>

    <!-- 植物概览 -->
    <div class="px-5 pb-5">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-lg font-bold text-gray-800">🌿 我的植物</h2>
        <router-link to="/plants" class="text-primary-600 text-sm font-medium">管理全部 ({{ plants.length }}) →</router-link>
      </div>

      <!-- 横向滚动植物卡片 -->
      <div class="flex gap-4 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
        <div 
          v-for="plant in plants" 
          :key="plant.id"
          @click="$router.push(`/plants/${plant.id}`)"
          class="flex-shrink-0 w-36 card !p-0 cursor-pointer hover:shadow-lg transition-all animate-fade-in"
        >
          <div class="relative h-32 overflow-hidden rounded-t-3xl">
            <img 
              :src="plant.image" 
              :alt="plant.name" 
              class="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
            />
            <div class="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium backdrop-blur-sm"
              :class="{
                'bg-green-400/90 text-white': plant.healthStatus === 'healthy',
                'bg-yellow-400/90 text-white': plant.healthStatus === 'subhealthy',
                'bg-red-400/90 text-white': plant.healthStatus === 'pest'
              }"
            >
              {{ healthStatusText(plant.healthStatus) }}
            </div>
            
            <!-- AI健康提示角标 -->
            <div v-if="plant.healthStatus !== 'healthy'" class="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-medium bg-white/95 backdrop-blur-sm text-orange-600 shadow-sm flex items-center gap-1 border border-orange-200">
              <span class="text-xs">🤖</span>
              <span>{{ plant.healthStatus === 'subhealthy' ? '需关注' : '需诊断' }}</span>
            </div>
          </div>
          <div class="p-3">
            <h3 class="font-bold text-gray-800 text-sm truncate">{{ plant.name }}</h3>
            <p class="text-xs text-gray-500 truncate">{{ plant.variety }}</p>
            <div class="flex items-center gap-1 mt-2 text-xs text-gray-600">
              <span>💧</span>
              <span>{{ plant.careSchedule.nextWatering > 0 ? `${plant.careSchedule.nextWatering}天后` : '今天' }}</span>
            </div>
          </div>
        </div>
        
        <!-- 添加植物按钮 -->
        <router-link 
          to="/plants/add" 
          class="flex-shrink-0 w-36 card !p-0 cursor-pointer hover:shadow-md transition-all flex flex-col items-center justify-center h-[188px] border-2 border-dashed border-primary-200 hover:border-primary-400 group"
        >
          <div class="w-14 h-14 rounded-full bg-primary-50 group-hover:bg-primary-100 flex items-center justify-center text-3xl mb-2 transition-colors">
            +
          </div>
          <p class="text-sm font-medium text-primary-600">添加植物</p>
        </router-link>
      </div>
    </div>

    <!-- 快捷工具（AI功能自然融入） -->
    <div class="px-5 pb-5">
      <h2 class="text-lg font-bold text-gray-800 mb-3">⚡ 快捷工具</h2>
      <div class="grid grid-cols-4 gap-3">
        <router-link 
          v-for="tool in quickTools" 
          :key="tool.path"
          :to="tool.path"
          class="card !p-4 flex flex-col items-center gap-2 cursor-pointer hover:scale-105 active:scale-95 transition-transform relative group"
        >
          <span class="text-3xl">{{ tool.icon }}</span>
          <span class="text-xs font-medium text-gray-700 text-center">{{ tool.label }}</span>
          
          <!-- AI标签（仅AI相关功能显示） -->
          <span v-if="tool.isAI" class="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 bg-primary-500 text-white text-[9px] rounded-full font-medium shadow-sm">
            AI
          </span>
        </router-link>
      </div>
    </div>

    <!-- 社区精选 -->
    <div class="px-5 pb-8">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-lg font-bold text-gray-800">🔥 社区热门</h2>
        <router-link to="/community" class="text-primary-600 text-sm font-medium">更多 →</router-link>
      </div>

      <div 
        v-for="post in posts.slice(0, 2)" 
        :key="post.id"
        @click="$router.push(`/community/post/${post.id}`)"
        class="card !p-4 mb-3 cursor-pointer hover:shadow-md transition-all"
      >
        <div class="flex items-start gap-3">
          <img :src="post.author.avatar" :alt="post.author.nickname" class="w-10 h-10 rounded-full flex-shrink-0" />
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-semibold text-sm text-gray-800">{{ post.author.nickname }}</span>
              <span class="text-xs text-gray-400">{{ post.createdAt }}</span>
            </div>
            <h3 class="font-medium text-gray-800 text-sm line-clamp-2 mb-2">{{ post.title }}</h3>
            <div class="flex items-center gap-4 text-xs text-gray-500">
              <span>❤️ {{ post.likes }}</span>
              <span>💬 {{ post.comments }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部AI助手悬浮按钮 -->
    <div class="fixed bottom-24 right-5 z-40">
      <router-link 
        to="/ai/chat" 
        class="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg hover:shadow-xl flex items-center justify-center text-2xl transition-all duration-300 active:scale-95 group"
      >
        🤖
        <span class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { mockPlants, mockTodayTasks, mockPosts } from '../data/mockData'

const plants = ref(mockPlants)
const todayTasks = ref(mockTodayTasks)
const posts = ref(mockPosts)

const quickTools = ref([
  { icon: '🤖', label: 'AI问答', path: '/ai/chat', isAI: true },
  { icon: '📸', label: '拍照识别', path: '/ai/identify', isAI: true },
  { icon: '📅', label: '养护日历', path: '/care', isAI: false },
  { icon: '💬', label: '群聊', path: '/groups', isAI: false },
])

const healthStatusText = (status) => {
  const map = {
    healthy: '健康',
    subhealthy: '亚健康',
    pest: '异常'
  }
  return map[status] || status
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
