<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部标题 -->
    <div class="bg-white sticky top-0 z-40 px-5 pt-12 pb-4 shadow-sm flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-800">👥 我的群组</h1>
      <button class="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center text-xl shadow-plant active:scale-95">
        +
      </button>
    </div>

    <!-- 搜索框 -->
    <div class="px-5 py-4 bg-white border-b border-gray-100">
      <div class="relative">
        <input 
          type="text" 
          v-model="searchQuery"
          placeholder="搜索群组..."
          class="input-field !pl-10"
        />
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
      </div>
    </div>

    <!-- 群组分类标签 -->
    <div class="px-5 py-3 bg-white border-b border-gray-100">
      <div class="flex gap-2 overflow-x-auto scrollbar-hide">
        <button 
          v-for="category in categories" 
          :key="category.value"
          @click="activeCategory = category.value"
          class="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200"
          :class="activeCategory === category.value ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'"
        >
          {{ category.icon }} {{ category.label }}
        </button>
      </div>
    </div>

    <!-- 群组列表 -->
    <div class="px-5 py-4 space-y-3 pb-24">
      <div 
        v-for="group in filteredGroups" 
        :key="group.id"
        @click="$router.push(`/groups/${group.id}`)"
        class="card !p-5 cursor-pointer hover:shadow-md transition-all animate-slide-up"
      >
        <div class="flex items-start gap-4">
          <!-- 群头像 -->
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-3xl flex-shrink-0 shadow-sm">
            {{ group.avatar }}
          </div>

          <!-- 群信息 -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-1">
              <h3 class="font-bold text-gray-800 truncate">{{ group.name }}</h3>
              <span v-if="group.unreadCount > 0" class="px-2.5 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] text-center">
                {{ group.unreadCount }}
              </span>
            </div>
            
            <p class="text-xs text-gray-500 line-clamp-2 mb-2">{{ group.description }}</p>
            
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 text-xs text-gray-400">
                <span>👥 {{ group.memberCount }}人</span>
                <span>|</span>
                <span>{{ group.lastMessageTime }}</span>
              </div>
              
              <span class="text-xs text-gray-500 line-clamp-1 max-w-[150px]">
                {{ group.lastMessage }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 推荐群组 -->
      <div class="mt-8 mb-6">
        <h3 class="font-bold text-gray-800 mb-3">🔥 推荐加入</h3>
        
        <div class="space-y-3">
          <div 
            v-for="rec in recommendedGroups" 
            :key="rec.id"
            class="card !p-5 cursor-pointer hover:shadow-md transition-all"
          >
            <div class="flex items-start gap-4">
              <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-3xl flex-shrink-0">
                {{ rec.avatar }}
              </div>
              
              <div class="flex-1 min-w-0">
                <h3 class="font-bold text-gray-800 mb-1">{{ rec.name }}</h3>
                <p class="text-xs text-gray-500 line-clamp-2 mb-2">{{ rec.description }}</p>
                
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-400">👥 {{ rec.memberCount }}人</span>
                  <button class="px-4 py-1.5 bg-primary-500 text-white rounded-full text-xs font-semibold hover:bg-primary-600 active:scale-95 transition-all">
                    加入
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { mockGroups } from '../data/mockData'

const groups = ref(mockGroups)
const searchQuery = ref('')
const activeCategory = ref('all')

const categories = ref([
  { icon: '📋', label: '全部', value: 'all' },
  { icon: '🌿', label: '品种群', value: 'variety' },
  { icon: '🏙️', label: '地域群', value: 'location' },
  { icon: '❤️', label: '兴趣群', value: 'interest' },
])

const recommendedGroups = ref([
  {
    id: 'rg1',
    name: '月季花园',
    avatar: '🌹',
    description: '月季爱好者交流群，分享品种推荐、养护技巧和开花美图',
    memberCount: 567
  },
  {
    id: 'rg2',
    name: '阳台菜园',
    avatar: '🥬',
    description: '都市农夫聚集地，交流蔬菜种植经验，分享丰收喜悦',
    memberCount: 892
  },
])

const filteredGroups = computed(() => {
  let result = groups.value
  
  if (activeCategory.value !== 'all') {
    result = result.filter(g => g.category === activeCategory.value)
  }
  
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(g => g.name.toLowerCase().includes(query))
  }
  
  return result
})
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

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
