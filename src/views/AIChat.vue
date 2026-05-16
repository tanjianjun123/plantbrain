<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- 顶部标题栏 -->
    <div class="bg-white sticky top-0 z-40 px-5 pt-12 pb-4 shadow-sm">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-xl shadow-plant">
            🤖
          </div>
          <div>
            <h1 class="text-lg font-bold text-gray-800">AI 植物助手</h1>
            <p class="text-xs text-green-500 flex items-center gap-1">
              <span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              在线
            </p>
          </div>
        </div>
        <button @click="showHistory = !showHistory" class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors active:scale-95">
          🕐
        </button>
      </div>
    </div>

    <!-- 对话消息区域 -->
    <div class="flex-1 overflow-y-auto px-5 py-4 space-y-4 pb-32" ref="chatContainer">
      <!-- 欢迎消息 -->
      <div v-for="(msg, index) in conversations" :key="index" class="animate-fade-in" :style="{ animationDelay: `${index * 100}ms` }">
        <!-- AI 消息 -->
        <div v-if="msg.role === 'assistant'" class="flex gap-3">
          <div class="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-base flex-shrink-0 shadow-sm">
            🤖
          </div>
          <div class="max-w-[80%]">
            <div class="bg-white rounded-2xl rounded-tl-md shadow-sm p-4">
              <p class="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{{ msg.content }}</p>
              
              <!-- 快捷建议按钮 -->
              <div v-if="index === 0 && showQuickActions" class="mt-3 pt-3 border-t border-gray-100 space-y-2">
                <button 
                  v-for="action in quickActions" 
                  :key="action.text"
                  @click="sendQuickMessage(action.text)"
                  class="w-full px-3 py-2.5 bg-primary-50 hover:bg-primary-100 rounded-xl text-left text-xs font-medium text-primary-700 transition-colors flex items-center gap-2"
                >
                  <span>{{ action.icon }}</span>
                  {{ action.label }}
                </button>
              </div>
            </div>
            <p class="text-xs text-gray-400 mt-1.5 ml-2">{{ msg.time }}</p>
          </div>
        </div>

        <!-- 用户消息 -->
        <div v-else class="flex gap-3 justify-end">
          <div class="max-w-[80%]">
            <div class="bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl rounded-tr-md p-4 shadow-plant">
              <p class="text-sm leading-relaxed">{{ msg.content }}</p>
            </div>
            <p class="text-xs text-gray-400 mt-1.5 mr-2 text-right">{{ msg.time }}</p>
          </div>
        </div>
      </div>

      <!-- 加载动画 -->
      <div v-if="isLoading" class="flex gap-3 animate-fade-in">
        <div class="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-base flex-shrink-0">
          🤖
        </div>
        <div class="bg-white rounded-2xl rounded-tl-md shadow-sm p-4">
          <div class="flex gap-1.5">
            <div class="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
            <div class="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
            <div class="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
          </div>
        </div>
      </div>

      <!-- 空状态提示 -->
      <div v-if="conversations.length <= 1" class="text-center py-8">
        <div class="text-6xl mb-4">🌱</div>
        <h3 class="font-bold text-gray-800 mb-2">有什么可以帮您的？</h3>
        <p class="text-sm text-gray-500 mb-6">试试问我关于植物养护的问题</p>
        
        <div class="grid grid-cols-2 gap-3 max-w-xs mx-auto">
          <button 
            v-for="suggestion in suggestions" 
            :key="suggestion"
            @click="sendMessage(suggestion)"
            class="px-4 py-3 bg-white rounded-xl shadow-sm text-sm text-gray-700 hover:shadow-md active:scale-95 transition-all"
          >
            {{ suggestion }}
          </button>
        </div>
      </div>
    </div>

    <!-- 底部输入区域 -->
    <div class="fixed bottom-20 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 px-5 py-4 z-30 safe-area-bottom">
      <!-- 功能按钮 -->
      <div class="flex gap-2 mb-3 overflow-x-auto scrollbar-hide">
        <router-link to="/ai/identify" class="flex-shrink-0 px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-full text-xs font-medium text-blue-600 flex items-center gap-1.5 transition-colors">
          📸 拍照识别
        </router-link>
        <button class="flex-shrink-0 px-4 py-2 bg-purple-50 hover:bg-purple-100 rounded-full text-xs font-medium text-purple-600 flex items-center gap-1.5 transition-colors">
          🎤 语音输入
        </button>
        <button class="flex-shrink-0 px-4 py-2 bg-orange-50 hover:bg-orange-100 rounded-full text-xs font-medium text-orange-600 flex items-center gap-1.5 transition-colors">
          📚 知识库
        </button>
      </div>

      <!-- 输入框 -->
      <div class="flex gap-2 items-end">
        <div class="flex-1 relative">
          <textarea 
            v-model="messageInput"
            @keydown.enter.exact.prevent="sendMessage(messageInput)"
            placeholder="输入您的问题..."
            rows="1"
            class="input-field !pr-12 !py-3 resize-none max-h-24"
            :class="{ '!pr-24': messageInput.length > 0 }"
          ></textarea>
          
          <!-- 字数统计 -->
          <span v-if="messageInput.length > 0" class="absolute right-12 bottom-3 text-xs text-gray-400">
            {{ messageInput.length }}/500
          </span>
        </div>
        
        <button 
          @click="sendMessage(messageInput)"
          :disabled="!messageInput.trim() || isLoading"
          class="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center shadow-plant hover:shadow-plant-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 历史记录侧边栏 -->
    <transition name="slide-left">
      <div v-if="showHistory" class="fixed inset-0 z-50 bg-black/50" @click.self="showHistory = false">
        <div class="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl animate-slide-up">
          <div class="sticky top-0 bg-white px-5 pt-12 pb-4 border-b border-gray-100 flex items-center justify-between">
            <h3 class="font-bold text-lg text-gray-800">历史记录</h3>
            <button @click="showHistory = false" class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">×</button>
          </div>
          
          <div class="p-5 space-y-3 overflow-y-auto" style="height: calc(100vh - 88px)">
            <div 
              v-for="(item, idx) in historyList" 
              :key="idx"
              class="card !p-4 cursor-pointer hover:shadow-md transition-all"
            >
              <p class="text-sm text-gray-700 line-clamp-2 mb-2">{{ item.question }}</p>
              <p class="text-xs text-gray-400">{{ item.date }}</p>
            </div>
            
            <div v-if="historyList.length === 0" class="text-center py-12 text-gray-400">
              <p class="text-4xl mb-2">📝</p>
              <p>暂无历史记录</p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { mockAIConversations } from '../data/mockData'

const conversations = ref(mockAIConversations)
const messageInput = ref('')
const isLoading = ref(false)
const showHistory = ref(false)
const showQuickActions = ref(true)
const chatContainer = ref(null)

const quickActions = ref([
  { icon: '💧', label: '薄荷怎么浇水？', text: '薄荷怎么浇水？' },
  { icon: '🐛', label: '叶片有白点是什么病？', text: '我的植物叶片上有白色斑点，这是什么病？' },
  { icon: '🌱', label: '多肉怎么度夏？', text: '多肉植物夏天怎么养护？' },
  { icon: '📍', label: '北阳台适合种什么？', text: '北向阳台适合种植什么植物？' },
])

const suggestions = ref([
  '薄荷怎么养？',
  '叶子发黄怎么办？',
  '多久浇一次水？',
  '如何防治蚜虫？',
])

const historyList = ref([
  { question: '绿萝叶子发黄怎么办？', date: '今天 14:30' },
  { question: '多肉植物的浇水频率？', date: '昨天 09:15' },
  { question: '月季花的施肥方法', date: '3天前' },
])

// 模拟AI回复的数据库
const aiResponses = {
  '薄荷怎么养？': `好的！薄荷是非常好养的香草植物，我来为您详细介绍：

🌿 **基本养护要点：**

**1. 光照**
• 喜欢充足的散射光
• 南向或东向阳台最佳
• 夏季正午适当遮阴

**2. 浇水（关键！）**
• 遵循"见干见湿"原则
• 一般每2-3天浇一次
• 用手指插入土壤2cm检查，干燥再浇

**3. 土壤与盆器**
• 使用疏松透气的营养土
• 盆底必须有排水孔
• 可以垫陶粒增加排水性

**4. 施肥**
• 生长期（春夏季）每2周施一次薄肥
• 以氮肥为主促进生长
• 休眠期停止施肥

💡 **小贴士：**
薄荷长势旺盛，可以定期修剪打顶，这样会让它长得更茂盛！

还有什么问题吗？😊`,

  'default': `感谢您的提问！这是一个很好的问题。

基于我的知识库，我为您分析如下：

🔍 **可能的原因：**
1. 浇水不当（过多或过少）
2. 光照不足或过强
3. 营养缺乏
4. 病虫害影响

💡 **建议方案：**
1. 先检查土壤湿度
2. 观察光照环境
3. 如有照片可以拍照让我帮您诊断

您可以提供更多细节吗？比如：
• 植物品种名称？
• 目前的症状具体表现？
• 养护环境是怎样的？

我会给您更精准的建议！🌱`
}

const sendMessage = async (message) => {
  if (!message || !message.trim() || isLoading.value) return
  
  const userMessage = {
    role: 'user',
    content: message,
    time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }
  
  conversations.value.push(userMessage)
  messageInput.value = ''
  showQuickActions.value = false
  isLoading.value = true
  
  // 滚动到底部
  await nextTick()
  scrollToBottom()
  
  // 模拟AI思考延迟
  setTimeout(() => {
    const response = aiResponses[message] || aiResponses['default']
    
    const aiMessage = {
      role: 'assistant',
      content: response,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }
    
    conversations.value.push(aiMessage)
    isLoading.value = false
    
    // 再次滚动到底部
    nextTick(() => {
      scrollToBottom()
    })
  }, 1500)
}

const sendQuickMessage = (text) => {
  sendMessage(text)
}

const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

onMounted(() => {
  scrollToBottom()
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

.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease;
}

.slide-left-enter-from,
.slide-left-leave-to {
  opacity: 0;
}

.slide-left-enter-from .absolute,
.slide-left-leave-to .absolute {
  transform: translateX(100%);
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
