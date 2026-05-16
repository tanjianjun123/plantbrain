<template>
  <div class="min-h-screen bg-gray-50" v-if="post">
    <!-- 顶部导航 -->
    <div class="bg-white sticky top-0 z-40 px-5 pt-12 pb-4 shadow-sm flex items-center gap-4">
      <button @click="$router.back()" class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors active:scale-95">
        <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
      <h1 class="text-lg font-bold text-gray-800">动态详情</h1>
    </div>

    <!-- 帖子内容 -->
    <div class="px-5 py-4 pb-32">
      <!-- 用户信息 -->
      <div class="flex items-start gap-3 mb-4">
        <img :src="post.author.avatar" :alt="post.author.nickname" class="w-12 h-12 rounded-full ring-2 ring-primary-100" />
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-0.5">
            <span class="font-bold text-gray-800">{{ post.author.nickname }}</span>
            <span class="px-2 py-0.5 bg-primary-100 text-primary-700 rounded text-xs font-medium">{{ post.author.level }}</span>
          </div>
          <p class="text-sm text-gray-500">{{ post.createdAt }}</p>
        </div>
        
        <!-- 关注按钮 -->
        <button 
          @click="isFollowing = !isFollowing"
          class="px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
          :class="isFollowing ? 'bg-gray-100 text-gray-600' : 'bg-primary-500 text-white'"
        >
          {{ isFollowing ? '已关注' : '+ 关注' }}
        </button>
      </div>

      <!-- 标题 -->
      <h2 class="text-xl font-bold text-gray-800 mb-3 leading-snug">{{ post.title }}</h2>

      <!-- 正文 -->
      <p class="text-base text-gray-700 leading-relaxed mb-4 whitespace-pre-line">{{ post.content }}</p>

      <!-- 图片展示 -->
      <div v-if="post.images && post.images.length > 0" class="mb-4 space-y-2">
        <div 
          v-for="(img, idx) in post.images" 
          :key="idx"
          class="rounded-2xl overflow-hidden bg-gray-100"
        >
          <img :src="img" alt="" class="w-full object-cover" />
        </div>
      </div>

      <!-- 标签 -->
      <div v-if="post.tags && post.tags.length > 0" class="flex flex-wrap gap-2 mb-6">
        <button 
          v-for="tag in post.tags" 
          :key="tag"
          class="px-3 py-1.5 bg-gray-100 hover:bg-primary-50 rounded-full text-sm text-gray-600 transition-colors"
        >
          #{{ tag }}
        </button>
      </div>

      <!-- 互动数据 -->
      <div class="flex items-center justify-around py-4 border-y border-gray-100 mb-6">
        <div class="text-center">
          <p class="font-bold text-xl text-gray-800">{{ post.likes + (isLiked ? 1 : 0) }}</p>
          <p class="text-xs text-gray-500 mt-1">点赞</p>
        </div>
        <div class="w-px h-10 bg-gray-200"></div>
        <div class="text-center">
          <p class="font-bold text-xl text-gray-800">{{ post.comments }}</p>
          <p class="text-xs text-gray-500 mt-1">评论</p>
        </div>
        <div class="w-px h-10 bg-gray-200"></div>
        <div class="text-center">
          <p class="font-bold text-xl text-gray-800">{{ post.collects + (isCollected ? 1 : 0) }}</p>
          <p class="text-xs text-gray-500 mt-1">收藏</p>
        </div>
      </div>

      <!-- 评论区域 -->
      <div id="comments">
        <h3 class="font-bold text-gray-800 mb-4">评论（{{ comments.length }}）</h3>

        <div class="space-y-4 mb-20">
          <div 
            v-for="comment in comments" 
            :key="comment.id"
            class="flex gap-3 animate-fade-in"
          >
            <img :src="comment.avatar" alt="" class="w-9 h-9 rounded-full flex-shrink-0" />
            <div class="flex-1 min-w-0">
              <div class="card !p-4">
                <div class="flex items-center gap-2 mb-1.5">
                  <span class="font-semibold text-sm text-gray-800">{{ comment.nickname }}</span>
                  <span class="text-xs text-gray-400">{{ comment.time }}</span>
                </div>
                <p class="text-sm text-gray-700 leading-relaxed">{{ comment.content }}</p>
              </div>
              
              <!-- 回复按钮 -->
              <div class="flex gap-4 mt-2 ml-2">
                <button class="text-xs text-gray-400 hover:text-primary-600 transition-colors">
                  👍 赞同
                </button>
                <button class="text-xs text-gray-400 hover:text-primary-600 transition-colors">
                  💬 回复
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部评论输入栏 -->
    <div class="fixed bottom-20 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 px-5 py-3 z-30 safe-area-bottom">
      <div class="flex gap-3 items-end">
        <div class="flex-1 relative">
          <textarea 
            v-model="commentInput"
            placeholder="写下你的评论..."
            rows="1"
            class="input-field !pr-12 !py-2.5 resize-none max-h-24"
          ></textarea>
        </div>
        
        <button 
          @click="submitComment"
          :disabled="!commentInput.trim()"
          class="w-11 h-11 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center shadow-plant active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
          </svg>
        </button>
      </div>
      
      <!-- 快捷操作 -->
      <div class="flex gap-4 mt-2 pl-2">
        <button 
          @click="toggleLike(post)"
          class="flex items-center gap-1 text-sm transition-all"
          :class="isLiked ? 'text-red-500' : 'text-gray-400'"
        >
          {{ isLiked ? '❤️' : '🤍' }} 点赞
        </button>
        <button 
          @click="toggleCollect(post)"
          class="flex items-center gap-1 text-sm transition-all"
          :class="isCollected ? 'text-yellow-500' : 'text-gray-400'"
        >
          {{ isCollected ? '⭐' : '☆' }} 收藏
        </button>
        <button class="flex items-center gap-1 text-gray-400 text-sm">
          ↗️ 分享
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { mockPosts } from '../data/mockData'

const route = useRoute()
const post = ref(null)
const isLiked = ref(false)
const isCollected = ref(false)
const isFollowing = ref(false)
const commentInput = ref('')

const comments = ref([
  {
    id: 'c1',
    nickname: '园艺达人',
    avatar: 'https://ui-avatars.com/api/?name=%E8%8A%82%E8%89%BA%E8%BE%BE%E4%BA%BA&background=10b981&color=fff&size=150&font-size=0.4&length=2',
    content: '太棒了！我也养蝴蝶兰，能分享一下你的配土比例吗？',
    time: '1小时前'
  },
  {
    id: 'c2',
    nickname: '新手小白',
    avatar: 'https://ui-avatars.com/api/?name=%E6%96%B0%E6%89%8B%E5%B0%8F%E7%99%BD&background=3b82f6&color=fff&size=150&font-size=0.4&length=2',
    content: '请问你用的什么肥料？我的总是不开花😢',
    time: '45分钟前'
  },
])

onMounted(() => {
  const postId = route.params.id
  post.value = mockPosts.find(p => p.id === postId)
})

const toggleLike = (item) => {
  isLiked.value = !isLiked.value
}

const toggleCollect = (item) => {
  isCollected.value = !isCollected.value
}

const submitComment = () => {
  if (!commentInput.value.trim()) return
  
  comments.value.unshift({
    id: Date.now().toString(),
    nickname: '我',
    avatar: '',
    content: commentInput.value,
    time: '刚刚'
  })
  
  commentInput.value = ''
}
</script>
