<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部标题栏 -->
    <div class="bg-white sticky top-0 z-40 px-5 pt-12 pb-4 shadow-sm">
      <div class="flex items-center justify-between mb-3">
        <h1 class="text-2xl font-bold text-gray-800">💬 社区</h1>
        <div class="flex gap-2">
          <router-link to="/groups" class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors active:scale-95 relative">
            👥
            <span class="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">2</span>
          </router-link>
        </div>
      </div>

      <!-- Tab 切换 -->
      <div class="flex gap-6 border-b border-gray-200 -mx-5 px-5">
        <button 
          v-for="tab in tabs" 
          :key="tab.value"
          @click="activeTab = tab.value"
          class="pb-3 text-sm font-medium transition-all duration-200 relative"
          :class="activeTab === tab.value ? 'tab-active' : 'tab-inactive'"
        >
          {{ tab.label }}
          <span v-if="activeTab === tab.value" class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full"></span>
        </button>
      </div>
    </div>

    <!-- 动态列表 -->
    <div class="px-5 py-4 space-y-4 pb-24">
      <!-- 发布按钮（悬浮） -->
      <router-link 
        to="/community/publish" 
        class="fixed bottom-24 right-5 w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center text-3xl shadow-lg hover:shadow-xl active:scale-95 transition-all z-30"
      >
        +
      </router-link>

      <!-- 帖子卡片 -->
      <div 
        v-for="(post, index) in posts" 
        :key="post.id"
        @click="$router.push(`/community/post/${post.id}`)"
        class="card !p-5 cursor-pointer hover:shadow-md transition-all animate-slide-up"
        :style="{ animationDelay: `${index * 100}ms` }"
      >
        <!-- 用户信息 -->
        <div class="flex items-start gap-3 mb-3">
          <img :src="post.author.avatar" :alt="post.author.nickname" class="w-11 h-11 rounded-full flex-shrink-0 ring-2 ring-primary-100" />
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-0.5">
              <span class="font-bold text-gray-800 text-sm">{{ post.author.nickname }}</span>
              <span class="px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">{{ post.author.level }}</span>
            </div>
            <p class="text-xs text-gray-400">{{ post.createdAt }}</p>
          </div>
          
          <!-- 帖子类型标签 -->
          <span 
            class="px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0"
            :class="{
              'bg-orange-100 text-orange-700': post.type === 'harvest_show',
              'bg-red-100 text-red-700': post.type === 'question',
              'bg-blue-100 text-blue-700': post.type === 'experience_share',
              'bg-green-100 text-green-700': post.type === 'diary'
            }"
          >
            {{ postTypeText(post.type) }}
          </span>
        </div>

        <!-- 帖子内容 -->
        <h3 class="font-bold text-gray-800 mb-2 leading-snug">{{ post.title }}</h3>
        <p class="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-3">{{ post.content }}</p>

        <!-- 图片预览 -->
        <div v-if="post.images && post.images.length > 0" class="grid gap-2 mb-3" :class="{
          'grid-cols-1': post.images.length === 1,
          'grid-cols-2': post.images.length === 2,
          'grid-cols-3': post.images.length >= 3
        }">
          <div 
            v-for="(img, idx) in post.images.slice(0, 3)" 
            :key="idx"
            class="aspect-square rounded-xl overflow-hidden bg-gray-100"
          >
            <img :src="img" alt="" class="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
          </div>
          <div 
            v-if="post.images.length > 3" 
            class="aspect-square rounded-xl overflow-hidden bg-black/60 relative flex items-center justify-center"
          >
            <img :src="post.images[3]" alt="" class="w-full h-full object-cover opacity-40" />
            <span class="absolute text-white font-bold text-lg">+{{ post.images.length - 3 }}</span>
          </div>
        </div>

        <!-- 标签 -->
        <div v-if="post.tags && post.tags.length > 0" class="flex flex-wrap gap-2 mb-3">
          <span 
            v-for="tag in post.tags" 
            :key="tag"
            class="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs hover:bg-primary-50 hover:text-primary-600 transition-colors cursor-pointer"
          >
            #{{ tag }}
          </span>
        </div>

        <!-- 互动栏 -->
        <div class="flex items-center justify-between pt-3 border-t border-gray-100 mt-3">
          <div class="flex items-center gap-6">
            <button 
              @click.stop="toggleLike(post)"
              class="flex items-center gap-1.5 transition-all active:scale-110"
              :class="post.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'"
            >
              <span class="text-base">{{ post.isLiked ? '❤️' : '🤍' }}</span>
              <span class="text-sm font-medium">{{ post.likes + (post.isLiked ? 1 : 0) }}</span>
            </button>
            
            <button 
              @click.stop="$router.push(`/community/post/${post.id}#comments`)"
              class="flex items-center gap-1.5 text-gray-400 hover:text-blue-500 transition-colors active:scale-110"
            >
              <span class="text-base">💬</span>
              <span class="text-sm font-medium">{{ post.comments }}</span>
            </button>
            
            <button 
              @click.stop="toggleCollect(post)"
              class="flex items-center gap-1.5 transition-all active:scale-110"
              :class="post.isCollected ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-400'"
            >
              <span class="text-base">{{ post.isCollected ? '⭐' : '☆' }}</span>
              <span class="text-sm font-medium hidden sm:inline">{{ post.collects + (post.isCollected ? 1 : 0) }}</span>
            </button>
          </div>

          <button class="text-gray-400 hover:text-gray-600 transition-colors active:scale-110">
            <span class="text-base">↗️</span>
          </button>
        </div>
      </div>

      <!-- 加载更多 -->
      <div class="text-center py-8">
        <button class="btn-secondary !py-3 !px-8 !text-sm">
          加载更多 ↓
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { mockPosts } from '../data/mockData'

const posts = ref(mockPosts)
const activeTab = ref('hot')

const tabs = ref([
  { label: '🔥 热门', value: 'hot' },
  { label: '⏰ 最新', value: 'latest' },
  { label: '❓ 求助', value: 'question' },
])

const postTypeText = (type) => {
  const map = {
    harvest_show: '🌟 成果展示',
    question: '❓ 求助提问',
    experience_share: '💡 经验分享',
    diary: '📝 种植日记'
  }
  return map[type] || type
}

const toggleLike = (post) => {
  post.isLiked = !post.isLiked
}

const toggleCollect = (post) => {
  post.isCollected = !post.isCollected
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
