<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部标题栏 -->
    <div class="bg-white sticky top-0 z-40 px-5 pt-12 pb-4 shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-2xl font-bold text-gray-800">我的植物</h1>
        <router-link to="/plants/add" class="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center text-xl font-light hover:bg-primary-600 transition-colors shadow-plant active:scale-95">
          +
        </router-link>
      </div>

      <!-- 搜索框 -->
      <div class="relative">
        <input 
          type="text" 
          v-model="searchQuery"
          placeholder="搜索植物品种、名称..." 
          class="input-field !pl-10 !pr-4 !py-2.5 !text-sm"
        />
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
      </div>

      <!-- 筛选标签 -->
      <div class="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
        <button 
          v-for="filter in filters" 
          :key="filter.value"
          @click="activeFilter = filter.value"
          class="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200"
          :class="activeFilter === filter.value ? 'bg-primary-500 text-white shadow-plant' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <!-- 植物列表 -->
    <div class="px-5 py-4 space-y-4 pb-8">
      <!-- 统计信息 -->
      <div class="grid grid-cols-3 gap-3 mb-2">
        <div class="card !p-3 text-center">
          <p class="text-2xl font-bold text-primary-600">{{ filteredPlants.length }}</p>
          <p class="text-xs text-gray-500">总植物数</p>
        </div>
        <div class="card !p-3 text-center">
          <p class="text-2xl font-bold text-green-500">{{ healthyCount }}</p>
          <p class="text-xs text-gray-500">健康</p>
        </div>
        <div class="card !p-3 text-center">
          <p class="text-2xl font-bold text-red-500">{{ needAttentionCount }}</p>
          <p class="text-xs text-gray-500">需关注</p>
        </div>
      </div>

      <!-- 植物卡片 -->
      <div 
        v-for="plant in filteredPlants" 
        :key="plant.id"
        @click="$router.push(`/plants/${plant.id}`)"
        class="card !p-0 cursor-pointer hover:shadow-md transition-all animate-slide-up"
      >
        <div class="flex gap-4 p-4">
          <!-- 植物图片 -->
          <div class="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
            <img 
              :src="plant.image" 
              :alt="plant.name"
              class="w-full h-full object-cover"
            />
            <div class="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-full text-xs font-medium backdrop-blur-sm"
              :class="{
                'bg-green-400/90 text-white': plant.healthStatus === 'healthy',
                'bg-yellow-400/90 text-white': plant.healthStatus === 'subhealthy',
                'bg-red-400/90 text-white': plant.healthStatus === 'pest'
              }"
            >
              {{ healthStatusText(plant.healthStatus) }}
            </div>
          </div>

          <!-- 植物信息 -->
          <div class="flex-1 min-w-0 flex flex-col justify-between py-1">
            <div>
              <h3 class="font-bold text-lg text-gray-800 truncate">{{ plant.name }}</h3>
              <p class="text-sm text-gray-500 truncate">{{ plant.variety }} · {{ plant.family }}</p>
            </div>

            <div class="flex items-center gap-3 mt-2">
              <span class="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                💧 {{ plant.careSchedule.nextWatering > 0 ? `${plant.careSchedule.nextWatering}天后` : '今天浇水' }}
              </span>
              <span class="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium">
                📏 {{ plant.height }}cm
              </span>
            </div>
          </div>

          <!-- 箭头 -->
          <div class="flex items-center text-gray-300">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </div>

        <!-- 底部状态栏 -->
        <div class="px-4 pb-4 pt-0">
          <div class="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
            <span>🌱 {{ stageText(plant.currentStage) }} · 已种植{{ plant.daysSincePlanted }}天</span>
            <span>📍 {{ plant.environment.balconyOrientation }}</span>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredPlants.length === 0" class="text-center py-16">
        <div class="text-6xl mb-4">🌱</div>
        <p class="text-gray-500 mb-4">暂无植物，开始添加你的第一株植物吧！</p>
        <router-link to="/plants/add" class="btn-primary inline-block">添加植物</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { mockPlants } from '../data/mockData'

const plants = ref(mockPlants)
const searchQuery = ref('')
const activeFilter = ref('all')

const filters = ref([
  { label: '全部', value: 'all' },
  { label: '健康', value: 'healthy' },
  { label: '亚健康', value: 'subhealthy' },
  { label: '异常', value: 'pest' },
])

const filteredPlants = computed(() => {
  let result = plants.value

  if (activeFilter.value !== 'all') {
    result = result.filter(p => p.healthStatus === activeFilter.value)
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.variety.toLowerCase().includes(query)
    )
  }

  return result
})

const healthyCount = computed(() => plants.value.filter(p => p.healthStatus === 'healthy').length)
const needAttentionCount = computed(() => plants.value.filter(p => p.healthStatus !== 'healthy').length)

const healthStatusText = (status) => {
  const map = {
    healthy: '健康',
    subhealthy: '亚健康',
    pest: '异常'
  }
  return map[status] || status
}

const stageText = (stage) => {
  const map = {
    germination: '发芽期',
    growth: '生长期',
    flowering: '开花期',
    fruiting: '结果期',
    dormant: '休眠期'
  }
  return map[stage] || stage
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
</style>
