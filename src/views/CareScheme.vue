<template>
  <div class="min-h-screen bg-gray-50" v-if="scheme">
    <!-- 顶部植物信息 -->
    <div class="bg-gradient-to-br from-primary-500 to-primary-600 px-5 pt-12 pb-8 text-white">
      <button @click="$router.back()" class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 hover:bg-white/30 transition-colors active:scale-95">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>

      <div class="flex items-center gap-4 mb-2">
        <h1 class="text-2xl font-bold">{{ scheme.plantName }}</h1>
        <span class="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">🌿 生长期</span>
      </div>
      <p class="text-white/80 text-sm">📊 置信度 92% · 🕐 更新于 {{ scheme.generatedAt }}</p>
    </div>

    <!-- 核心养护指标仪表盘 -->
    <div class="px-5 -mt-4">
      <div class="card !p-5 !bg-gradient-to-br !from-primary-50 !to-white shadow-plant">
        <div class="flex items-center gap-2 mb-4">
          <span class="text-xl">🎯</span>
          <h3 class="font-bold text-gray-800">今日养护重点</h3>
        </div>

        <div class="grid grid-cols-3 gap-4">
          <!-- 浇水指示器 -->
          <div class="text-center">
            <div class="relative w-20 h-20 mx-auto mb-2">
              <svg class="w-20 h-20 transform -rotate-90">
                <circle cx="40" cy="40" r="32" stroke="#e5e7eb" stroke-width="6" fill="none"/>
                <circle 
                  cx="40" cy="40" r="32" 
                  stroke="#3b82f6" stroke-width="6" fill="none"
                  stroke-linecap="round"
                  :stroke-dasharray="`${wateringProgress * 2.01} 201`"
                  class="transition-all duration-500"
                />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-2xl">💧</span>
              </div>
            </div>
            <p class="text-sm font-semibold text-gray-800">{{ wateringStatus }}</p>
            <p class="text-xs text-gray-500">{{ wateringTip }}</p>
          </div>

          <!-- 施肥指示器 -->
          <div class="text-center">
            <div class="relative w-20 h-20 mx-auto mb-2">
              <svg class="w-20 h-20 transform -rotate-90">
                <circle cx="40" cy="40" r="32" stroke="#e5e7eb" stroke-width="6" fill="none"/>
                <circle 
                  cx="40" cy="40" r="32" 
                  stroke="#22c55e" stroke-width="6" fill="none"
                  stroke-linecap="round"
                  :stroke-dasharray="`${fertilizingProgress * 2.01} 201`"
                  class="transition-all duration-500"
                />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-2xl">🌱</span>
              </div>
            </div>
            <p class="text-sm font-semibold text-gray-800">{{ fertilizingStatus }}</p>
            <p class="text-xs text-gray-500">{{ fertilizingTip }}</p>
          </div>

          <!-- 光照指示器 -->
          <div class="text-center">
            <div class="relative w-20 h-20 mx-auto mb-2">
              <svg class="w-20 h-20 transform -rotate-90">
                <circle cx="40" cy="40" r="32" stroke="#e5e7eb" stroke-width="6" fill="none"/>
                <circle 
                  cx="40" cy="40" r="32" 
                  stroke="#f59e0b" stroke-width="6" fill="none"
                  stroke-linecap="round"
                  :stroke-dasharray="`${lightProgress * 2.01} 201`"
                  class="transition-all duration-500"
                />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-2xl">☀️</span>
              </div>
            </div>
            <p class="text-sm font-semibold text-gray-800">{{ lightStatus }}</p>
            <p class="text-xs text-gray-500">{{ lightTip }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 生育期轨迹图 -->
    <div class="px-5 py-6">
      <div class="card !p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-gray-800 flex items-center gap-2">
            <span>📈</span> 生育期轨迹
          </h3>
          <span class="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
            🌿 当前：生长期
          </span>
        </div>

        <!-- 时间轴 -->
        <div class="relative">
          <!-- 连接线 -->
          <div class="absolute top-6 left-3 right-3 h-1.5 bg-gray-200 rounded-full"></div>

          <!-- 进度填充 -->
          <div 
            class="absolute top-6 left-3 h-1.5 bg-gradient-to-r from-green-400 via-primary-400 to-primary-500 rounded-full transition-all duration-700"
            :style="{ width: progressWidth }"
          ></div>

          <!-- 阶段节点 -->
          <div class="flex justify-between relative">
            <div 
              v-for="(stage, index) in growthStages" 
              :key="index"
              class="flex flex-col items-center"
            >
              <!-- 节点图标 -->
              <div 
                class="w-14 h-14 rounded-full flex items-center justify-center text-xl relative z-10 transition-all duration-300 shadow-lg"
                :class="getStageClass(stage.status)"
              >
                <span class="text-2xl">{{ stage.icon }}</span>
                <!-- 状态标记 -->
                <div 
                  v-if="stage.status === 'current'"
                  class="absolute -top-1 -right-1 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center animate-pulse"
                >
                  <span class="w-2 h-2 bg-white rounded-full"></span>
                </div>
                <div 
                  v-if="stage.status === 'completed'"
                  class="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                >
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
              </div>

              <!-- 阶段名称 -->
              <p 
                class="mt-2 text-xs font-semibold text-center leading-tight"
                :class="getStageTextClass(stage.status)"
              >
                {{ stage.name }}
              </p>

              <!-- 日期 -->
              <p 
                class="text-xs mt-0.5"
                :class="stage.status === 'future' ? 'text-gray-400' : 'text-gray-500'"
              >
                {{ stage.date || '—' }}
              </p>
            </div>
          </div>
        </div>

        <!-- 阶段切换器 -->
        <div class="mt-6 p-4 bg-gradient-to-r from-primary-50 to-green-50 rounded-2xl">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center text-2xl">
                {{ currentStageInfo.icon }}
              </div>
              <div>
                <p class="font-bold text-gray-800">{{ currentStageInfo.name }}</p>
                <p class="text-xs text-gray-500">已进行 {{ currentStageInfo.daysInStage }} 天</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-xs text-gray-400">预计下阶段</p>
              <p class="font-semibold text-primary-600">{{ currentStageInfo.nextStage }}</p>
              <p class="text-xs text-gray-400">{{ currentStageInfo.daysToNext }}天后</p>
            </div>
          </div>

          <!-- 阶段进度 -->
          <div class="mt-4">
            <div class="flex justify-between text-xs text-gray-500 mb-1.5">
              <span>🌱 发芽期</span>
              <span>🌸 开花期</span>
            </div>
            <div class="h-3 bg-white rounded-full overflow-hidden shadow-inner">
              <div 
                class="h-full bg-gradient-to-r from-green-400 via-primary-400 to-primary-500 rounded-full transition-all duration-700 relative"
                :style="{ width: overallProgress }"
              >
                <div class="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-lg border-2 border-primary-400"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 养护指南卡片 -->
    <div class="px-5 pb-8 space-y-4">
      <h3 class="font-bold text-gray-800 flex items-center gap-2">
        <span>📋</span> 养护指南
      </h3>

      <!-- 浇水指南 -->
      <div class="card !overflow-hidden">
        <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="text-3xl">💧</span>
              <div>
                <h4 class="font-bold text-lg">浇水指南</h4>
                <p class="text-blue-100 text-xs">Watering Guide</p>
              </div>
            </div>
            <div class="px-3 py-1 bg-white/20 rounded-full text-sm">
              {{ wateringSchedule }}
            </div>
          </div>
        </div>
        <div class="p-4 space-y-3">
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">1</div>
            <div>
              <p class="font-medium text-gray-800 text-sm">浇水频率</p>
              <p class="text-gray-600 text-xs mt-0.5">{{ wateringFrequency }}</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">2</div>
            <div>
              <p class="font-medium text-gray-800 text-sm">浇水方法</p>
              <p class="text-gray-600 text-xs mt-0.5">{{ wateringMethod }}</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">3</div>
            <div>
              <p class="font-medium text-gray-800 text-sm">最佳时间</p>
              <p class="text-gray-600 text-xs mt-0.5">{{ wateringTime }}</p>
            </div>
          </div>
        </div>
        <div class="px-4 pb-4">
          <button class="w-full py-2.5 bg-blue-50 hover:bg-blue-100 rounded-xl text-blue-700 text-sm font-medium transition-colors flex items-center justify-center gap-2">
            <span>🔔</span> 设置浇水提醒
          </button>
        </div>
      </div>

      <!-- 施肥指南 -->
      <div class="card !overflow-hidden">
        <div class="bg-gradient-to-r from-green-500 to-green-600 p-4 text-white">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="text-3xl">🌱</span>
              <div>
                <h4 class="font-bold text-lg">施肥建议</h4>
                <p class="text-green-100 text-xs">Fertilizing Guide</p>
              </div>
            </div>
            <div class="px-3 py-1 bg-white/20 rounded-full text-sm">
              {{ fertilizingSchedule }}
            </div>
          </div>
        </div>
        <div class="p-4 space-y-3">
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600 font-bold text-sm flex-shrink-0">1</div>
            <div>
              <p class="font-medium text-gray-800 text-sm">当前阶段用肥</p>
              <p class="text-gray-600 text-xs mt-0.5">{{ currentFertilizer }}</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600 font-bold text-sm flex-shrink-0">2</div>
            <div>
              <p class="font-medium text-gray-800 text-sm">施肥频率</p>
              <p class="text-gray-600 text-xs mt-0.5">{{ fertilizingFrequency }}</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600 font-bold text-sm flex-shrink-0">3</div>
            <div>
              <p class="font-medium text-gray-800 text-sm">注意事项</p>
              <p class="text-gray-600 text-xs mt-0.5">{{ fertilizingNote }}</p>
            </div>
          </div>
        </div>
        <div class="px-4 pb-4">
          <button class="w-full py-2.5 bg-green-50 hover:bg-green-100 rounded-xl text-green-700 text-sm font-medium transition-colors flex items-center justify-center gap-2">
            <span>🔔</span> 设置施肥提醒
          </button>
        </div>
      </div>

      <!-- 光照与温度 -->
      <div class="grid grid-cols-1 gap-4">
        <!-- 光照需求 -->
        <div class="card !p-4">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center text-2xl">
              ☀️
            </div>
            <div>
              <h4 class="font-bold text-gray-800">光照需求</h4>
              <p class="text-xs text-gray-500">Lighting Requirements</p>
            </div>
            <span class="ml-auto px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              {{ lightLevel }}
            </span>
          </div>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">每日时长</span>
              <span class="text-sm font-medium text-gray-800">{{ lightDuration }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">您的环境</span>
              <span class="text-sm font-medium text-primary-600">{{ userEnvironment }}</span>
            </div>
          </div>
        </div>

        <!-- 温度适宜 -->
        <div class="card !p-4">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center text-2xl">
              🌡️
            </div>
            <div>
              <h4 class="font-bold text-gray-800">温度适宜</h4>
              <p class="text-xs text-gray-500">Temperature Range</p>
            </div>
            <span class="ml-auto px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
              {{ tempRange }}
            </span>
          </div>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">适宜范围</span>
              <span class="text-sm font-medium text-gray-800">{{ optimalTemp }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">注意事项</span>
              <span class="text-sm font-medium text-orange-600">{{ tempNote }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 快速操作 -->
      <div class="card !p-5 !bg-gradient-to-br !from-purple-50 !to-pink-50">
        <h3 class="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <span>⚡</span> 快速操作
        </h3>
        <div class="grid grid-cols-4 gap-2">
          <button class="flex flex-col items-center gap-1 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95">
            <span class="text-2xl">📅</span>
            <span class="text-xs text-gray-600">日历</span>
          </button>
          <button class="flex flex-col items-center gap-1 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95">
            <span class="text-2xl">📤</span>
            <span class="text-xs text-gray-600">分享</span>
          </button>
          <button class="flex flex-col items-center gap-1 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95">
            <span class="text-2xl">⭐</span>
            <span class="text-xs text-gray-600">收藏</span>
          </button>
          <button class="flex flex-col items-center gap-1 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95">
            <span class="text-2xl">🔄</span>
            <span class="text-xs text-gray-600">刷新</span>
          </button>
        </div>
      </div>

      <!-- AI智能总结 -->
      <div class="card !p-5 !bg-gradient-to-r !from-blue-50 !to-cyan-50 !border-l-4 !border-l-blue-500">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl flex-shrink-0">
            🤖
          </div>
          <div>
            <h4 class="font-semibold text-gray-800 mb-1">AI 智能总结</h4>
            <p class="text-sm text-gray-600 leading-relaxed">{{ scheme.aiSummary }}</p>
          </div>
        </div>
      </div>

      <!-- 免责声明 -->
      <div class="text-center py-4 text-xs text-gray-400 leading-relaxed">
        <p>💡 以上养护建议基于AI算法和植物品种数据库生成，仅供参考。</p>
        <p>实际养护请结合您的具体环境灵活调整。</p>
        <p class="mt-1">如有疑问，可咨询AI助手 🌱</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { mockCareScheme } from '../data/mockData'

const route = useRoute()
const scheme = ref(null)

onMounted(() => {
  scheme.value = mockCareScheme
})

// 仪表盘数据
const wateringProgress = ref(65)
const wateringStatus = ref('适中')
const wateringTip = ref('土壤微润')

const fertilizingProgress = ref(30)
const fertilizingStatus = ref('3天后')
const fertilizingTip = ref('下次施肥')

const lightProgress = ref(85)
const lightStatus = ref('充足')
const lightTip = ref('散射光')

// 生育期阶段数据
const growthStages = ref([
  { name: '发芽期', icon: '🌱', date: '03-15', duration: '14天', status: 'completed' },
  { name: '生长期', icon: '🌿', date: '03-29', duration: '30天', status: 'current' },
  { name: '开花期', icon: '🌸', date: null, duration: '约30天', status: 'future' },
  { name: '结果期', icon: '🫐', date: null, duration: '约45天', status: 'future' },
  { name: '休眠期', icon: '❄️', date: null, duration: '冬季', status: 'future' }
])

const currentStageInfo = ref({
  icon: '🌿',
  name: '生长期',
  daysInStage: 32,
  nextStage: '开花期',
  daysToNext: 28
})

// 进度计算
const progressWidth = computed(() => {
  const completedCount = growthStages.value.filter(s => s.status === 'completed').length
  const spacing = 100 / (growthStages.value.length - 1)
  return `${(completedCount + 0.35) * spacing}%`
})

const overallProgress = computed(() => {
  const stages = growthStages.value
  const completedCount = stages.filter(s => s.status === 'completed').length
  const baseProgress = (completedCount / (stages.length - 1)) * 100
  return `${Math.min(baseProgress + 12, 92)}%`
})

const getStageClass = (status) => {
  if (status === 'completed') return 'bg-green-100 border-2 border-green-400'
  if (status === 'current') return 'bg-primary-100 border-2 border-primary-500 scale-110'
  return 'bg-gray-100 border-2 border-gray-300'
}

const getStageTextClass = (status) => {
  if (status === 'completed') return 'text-green-600'
  if (status === 'current') return 'text-primary-600 font-bold'
  return 'text-gray-400'
}

// 养护指南数据
const wateringSchedule = ref('每2-3天')
const wateringFrequency = ref('根据土壤干湿度调整，一般夏季2-3天一次，冬季5-7天一次')
const wateringMethod = ref('见干见湿，浇透至盆底流出水，避免积水')
const wateringTime = ref('早晨或傍晚最佳，避免中午高温时段')

const fertilizingSchedule = ref('每2周')
const currentFertilizer = ref('生长期以氮肥为主 (N:P:K = 3:1:2)')
const fertilizingFrequency = ref('每2周施一次稀薄液肥，休眠期停肥')
const fertilizingNote = ref('薄肥勤施，宁少勿多，避免直接接触叶片')

const lightLevel = ref('适中')
const lightDuration = ref('每天4-6小时散射光')
const userEnvironment = ref('南向阳台 ✓ 光照充足')

const tempRange = ref('15-25°C')
const optimalTemp = ref('15-25°C')
const tempNote = ref('低于5°C需保暖')
</script>
