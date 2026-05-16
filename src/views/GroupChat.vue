<template>
  <div class="min-h-screen bg-gray-50 flex flex-col" v-if="group">
    <!-- 群聊顶部 -->
    <div class="bg-white sticky top-0 z-40 shadow-sm">
      <div class="px-5 pt-12 pb-3 flex items-center gap-3">
        <button @click="$router.back()" class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors active:scale-95">
          <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        
        <div class="flex-1 min-w-0">
          <h1 class="font-bold text-lg text-gray-800 truncate">{{ group.name }}</h1>
          <p class="text-xs text-green-500 flex items-center gap-1">
            <span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            {{ group.memberCount }}人在线
          </p>
        </div>

        <button class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
          ⋯
        </button>
      </div>

      <!-- 群公告（如果有） -->
      <div class="px-5 pb-2" v-if="showAnnouncement">
        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r-lg animate-fade-in">
          <p class="text-xs text-yellow-800 font-medium mb-1">📢 群公告</p>
          <p class="text-xs text-yellow-700">本周五晚8点线上分享会：薄荷越冬技巧，欢迎大家参加！</p>
          <button @click="showAnnouncement = false" class="text-xs text-yellow-600 mt-1 underline">收起</button>
        </div>
      </div>
    </div>

    <!-- 消息列表 -->
    <div 
      ref="messageContainer"
      class="flex-1 overflow-y-auto px-5 py-4 space-y-4 pb-32"
    >
      <!-- 时间分割线 -->
      <div class="flex items-center justify-center my-6">
        <span class="px-4 py-1.5 bg-gray-100 rounded-full text-xs text-gray-500">今天</span>
      </div>

      <!-- 系统消息 -->
      <div 
        v-for="msg in systemMessages" 
        :key="msg.id"
        class="text-center"
      >
        <span class="inline-block px-4 py-2 bg-gray-100 rounded-full text-xs text-gray-500 max-w-[80%]">
          {{ msg.content }}
        </span>
      </div>

      <!-- 聊天消息 -->
      <div 
        v-for="(msg, index) in chatMessages" 
        :key="msg.id"
        class="animate-fade-in"
        :style="{ animationDelay: `${index * 50}ms` }"
      >
        <!-- 他人消息 -->
        <div v-if="!msg.isMine" class="flex gap-3">
          <img :src="msg.avatar" alt="" class="w-9 h-9 rounded-full flex-shrink-0" />
          
          <div class="max-w-[75%]">
            <p class="text-xs text-gray-500 mb-1 ml-1">{{ msg.senderName }}</p>
            
            <div class="bg-white rounded-2xl rounded-tl-md shadow-sm p-3">
              <p class="text-sm text-gray-800 leading-relaxed">{{ msg.content }}</p>
              <p class="text-xs text-gray-400 mt-1.5 text-right">{{ msg.time }}</p>
            </div>
          </div>
        </div>

        <!-- 我的消息 -->
        <div v-else class="flex gap-3 justify-end">
          <div class="max-w-[75%]">
            <div class="bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl rounded-tr-md shadow-plant p-3">
              <p class="text-sm leading-relaxed">{{ msg.content }}</p>
              <p class="text-xs opacity-70 mt-1.5 text-right">{{ msg.time }} ✓✓</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 正在输入提示 -->
      <div v-if="isTyping" class="flex gap-3 animate-fade-in">
        <img src="https://ui-avatars.com/api/?name=%E5%9B%AD%E8%8D%AF%E8%80%81%E7%8E%8B&background=ef4444&color=fff&size=150&font-size=0.4&length=2" alt="" class="w-9 h-9 rounded-full" />
        <div class="bg-white rounded-2xl rounded-tl-md shadow-sm px-4 py-3">
          <div class="flex gap-1">
            <div class="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
            <div class="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
            <div class="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部输入区域 -->
    <div class="fixed bottom-20 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 safe-area-bottom z-30">
      <!-- 快捷功能栏 -->
      <div class="px-5 py-2 flex gap-4 overflow-x-auto scrollbar-hide border-b border-gray-50">
        <button class="flex-shrink-0 flex flex-col items-center gap-0.5 text-xs text-gray-500 hover:text-primary-600 transition-colors">
          <span class="text-xl">📷</span>
          <span>图片</span>
        </button>
        <button class="flex-shrink-0 flex flex-col items-center gap-0.5 text-xs text-gray-500 hover:text-primary-600 transition-colors">
          <span class="text-xl">🌿</span>
          <span>植物</span>
        </button>
        <button class="flex-shrink-0 flex flex-col items-center gap-0.5 text-xs text-gray-500 hover:text-primary-600 transition-colors">
          <span class="text-xl">📍</span>
          <span>位置</span>
        </button>
        <button class="flex-shrink-0 flex flex-col items-center gap-0.5 text-xs text-gray-500 hover:text-primary-600 transition-colors">
          <span class="text-xl">@</span>
          <span>@成员</span>
        </button>
      </div>

      <!-- 输入框区域 -->
      <div class="px-5 py-3 flex gap-3 items-end">
        <div class="flex-1 relative">
          <textarea 
            v-model="messageInput"
            @keydown.enter.exact.prevent="sendMessage"
            placeholder="输入消息..."
            rows="1"
            class="input-field !pr-12 !py-2.5 resize-none max-h-24"
          ></textarea>
          
          <!-- 表情按钮 -->
          <button class="absolute left-3 bottom-2.5 text-lg">😊</button>
        </div>
        
        <button 
          @click="sendMessage"
          :disabled="!messageInput.trim()"
          class="w-11 h-11 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center shadow-plant active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { mockGroups, mockChatMessages } from '../data/mockData'

const route = useRoute()
const group = ref(null)
const messageContainer = ref(null)
const messageInput = ref('')
const isTyping = ref(false)
const showAnnouncement = ref(true)

const chatMessages = ref(mockChatMessages)

const systemMessages = ref([
  { id: 'sys1', content: '"小红" 加入了群聊' }
])

onMounted(() => {
  const groupId = route.params.id
  group.value = mockGroups.find(g => g.id === groupId)
  
  scrollToBottom()
})

const sendMessage = async () => {
  if (!messageInput.value.trim()) return
  
  const newMessage = {
    id: Date.now().toString(),
    senderId: 'me',
    senderName: '我',
    avatar: '',
    content: messageInput.value,
    time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    isMine: true,
    type: 'text'
  }
  
  chatMessages.value.push(newMessage)
  messageInput.value = ''
  
  await nextTick()
  scrollToBottom()

  // 模拟他人回复
  setTimeout(() => {
    isTyping.value = true
    scrollToBottom()
    
    setTimeout(() => {
      isTyping.value = false
      
      const replyMessage = {
        id: (Date.now() + 1).toString(),
        senderId: 'u2',
        senderName: '园丁老王',
        avatar: 'https://ui-avatars.com/api/?name=%E5%9B%AD%E8%8D%AF%E8%80%81%E7%8E%8B&background=ef4444&color=fff&size=150&font-size=0.4&length=2',
        content: getAutoReply(),
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        isMine: false,
        type: 'text'
      }
      
      chatMessages.value.push(replyMessage)
      
      nextTick(() => {
        scrollToBottom()
      })
    }, 1500)
  }, 500)
}

const getAutoReply = () => {
  const replies = [
    '说得对！我也是这么养的 👍',
    '这个方法不错，我试试看！',
    '谢谢分享！学到了 🌱',
    '我有同样的经历，确实是这样',
    '太有用了！收藏了 ⭐'
  ]
  return replies[Math.floor(Math.random() * replies.length)]
}

const scrollToBottom = () => {
  if (messageContainer.value) {
    setTimeout(() => {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight
    }, 50)
  }
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

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.animate-bounce {
  animation: bounce 1s ease infinite;
}
</style>
