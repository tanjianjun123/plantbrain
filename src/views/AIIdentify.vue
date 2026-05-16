<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航 -->
    <div class="bg-white sticky top-0 z-40 px-5 pt-12 pb-4 shadow-sm flex items-center gap-4">
      <button @click="$router.back()" class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors active:scale-95">
        <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
      <h1 class="text-xl font-bold text-gray-800">📸 智能识别</h1>
    </div>

    <!-- 拍照/上传区域 -->
    <div v-if="!hasImage" class="px-5 py-8">
      <div class="card !p-8 text-center">
        <!-- 相机取景框 -->
        <div 
          @click="triggerUpload"
          class="w-72 h-72 mx-auto rounded-3xl bg-gradient-to-br from-gray-100 to-gray-50 border-3 border-dashed border-primary-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-all duration-300 group mb-6 relative overflow-hidden"
        >
          <!-- 网格辅助线 -->
          <div class="absolute inset-0 opacity-10">
            <div class="absolute top-1/2 left-0 right-0 h-px bg-gray-400"></div>
            <div class="absolute left-1/2 top-0 bottom-0 w-px bg-gray-400"></div>
            <div class="absolute inset-8 border-2 border-gray-400 rounded-2xl"></div>
          </div>

          <div class="relative z-10 text-center group-hover:scale-110 transition-transform duration-300">
            <div class="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-5xl mb-4 shadow-lg">
              📸
            </div>
            <p class="font-semibold text-gray-800 text-lg mb-1">点击拍照或上传</p>
            <p class="text-sm text-gray-500">支持识别病虫害、品种等问题</p>
          </div>
        </div>

        <input 
          ref="fileInput"
          type="file"
          accept="image/*"
          capture="environment"
          @change="handleFileChange"
          class="hidden"
        />

        <!-- 功能说明 -->
        <div class="grid grid-cols-3 gap-3 mt-6">
          <div class="text-center p-3 bg-red-50 rounded-xl">
            <span class="text-2xl block mb-1">🐛</span>
            <p class="text-xs font-medium text-red-700">病虫害</p>
          </div>
          <div class="text-center p-3 bg-green-50 rounded-xl">
            <span class="text-2xl block mb-1">🌿</span>
            <p class="text-xs font-medium text-green-700">品种识别</p>
          </div>
          <div class="text-center p-3 bg-blue-50 rounded-xl">
            <span class="text-2xl block mb-1">⚠️</span>
            <p class="text-xs font-medium text-blue-700">生长问题</p>
          </div>
        </div>

        <!-- 拍摄提示 -->
        <div class="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
          <p class="text-xs text-yellow-800 leading-relaxed">
            💡 <strong>拍摄技巧：</strong><br/>
            • 光线充足，避免阴影<br/>
            • 靠近病灶部位拍摄<br/>
            • 保持画面清晰稳定
          </p>
        </div>
      </div>
    </div>

    <!-- 图片预览和识别结果 -->
    <div v-else class="px-5 py-4 pb-32 animate-fade-in">
      <!-- 上传的图片 -->
      <div class="card !p-0 !overflow-hidden mb-4">
        <div class="relative">
          <img :src="previewImage" alt="上传的图片" class="w-full aspect-square object-cover" />
          
          <!-- 重新上传按钮 -->
          <button 
            @click="resetImage"
            class="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors active:scale-95"
          >
            🔄
          </button>

          <!-- 加载动画 -->
          <div v-if="isAnalyzing" class="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
            <div class="bg-white rounded-3xl p-8 text-center shadow-2xl animate-bounce-in">
              <div class="text-5xl mb-4">🔍</div>
              <p class="font-bold text-gray-800 mb-2">AI 正在分析...</p>
              <p class="text-sm text-gray-500">请稍候，通常需要2-3秒</p>
              
              <!-- 进度条 -->
              <div class="mt-4 w-48 mx-auto h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-1000 ease-out"
                  :style="{ width: progress + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 识别结果 -->
      <div v-if="recognitionResult && !isAnalyzing" class="space-y-4 animate-slide-up">
        <!-- 诊断结论 -->
        <div class="card !p-5 !bg-gradient-to-br !from-red-50 !to-white border-l-4 border-l-red-400">
          <div class="flex items-start justify-between mb-3">
            <h3 class="font-bold text-lg text-gray-800 flex items-center gap-2">
              🔬 诊断结果
            </h3>
            <span class="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-bold">
              {{ recognitionResult.confidence }}%
            </span>
          </div>
          
          <p class="text-2xl font-bold text-gray-800 mb-2">{{ recognitionResult.name }}</p>
          <p class="text-sm text-gray-600 leading-relaxed">{{ recognitionResult.scientificName }}</p>

          <!-- 其他可能 -->
          <div class="mt-4 pt-4 border-t border-red-100">
            <p class="text-xs text-gray-500 mb-2">其他可能性：</p>
            <div class="space-y-1.5">
              <div 
                v-for="alt in recognitionResult.alternatives" 
                :key="alt.name"
                class="flex items-center justify-between text-sm"
              >
                <span class="text-gray-700">{{ alt.name }}</span>
                <span class="text-gray-400">{{ alt.confidence }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 病害科普 -->
        <div class="card !p-5">
          <h3 class="font-bold text-gray-800 mb-3 flex items-center gap-2">
            📖 什么是{{ recognitionResult.name }}？
          </h3>
          <p class="text-sm text-gray-600 leading-relaxed">{{ recognitionResult.description }}</p>
        </div>

        <!-- 解决方案 -->
        <div class="card !p-5 !bg-gradient-to-br !from-green-50 !to-white">
          <h3 class="font-bold text-green-800 mb-3 flex items-center gap-2">
            🛠️ 解决方案
          </h3>
          
          <div class="space-y-3">
            <div 
              v-for="(step, index) in recognitionResult.solution.steps" 
              :key="index"
              class="flex gap-3"
            >
              <div class="w-7 h-7 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                {{ index + 1 }}
              </div>
              <div class="flex-1">
                <p class="font-medium text-gray-800 text-sm mb-1">{{ step.title }}</p>
                <p class="text-xs text-gray-600 leading-relaxed">{{ step.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 预防措施 -->
        <div class="card !p-5">
          <h3 class="font-bold text-gray-800 mb-3 flex items-center gap-2">
            ℹ️ 预防措施
          </h3>
          <ul class="space-y-2">
            <li 
              v-for="(tip, idx) in recognitionResult.prevention" 
              :key="idx"
              class="flex items-start gap-2 text-sm text-gray-600"
            >
              <span class="text-primary-500 mt-0.5">•</span>
              <span>{{ tip }}</span>
            </li>
          </ul>
        </div>

        <!-- 反馈按钮 -->
        <div class="grid grid-cols-3 gap-3">
          <button 
            @click="submitFeedback('accurate')"
            class="btn-secondary !py-3 flex items-center justify-center gap-2"
          >
            👍 准确
          </button>
          <button 
            @click="submitFeedback('inaccurate')"
            class="btn-secondary !py-3 flex items-center justify-center gap-2"
          >
            👎 不准
          </button>
          <button 
            @click="$router.push('/ai/chat')"
            class="btn-primary !py-3 flex items-center justify-center gap-2"
          >
            💬 咨询AI
          </button>
        </div>
      </div>
    </div>

    <!-- 底部操作栏（有图片时显示） -->
    <div v-if="hasImage && !isAnalyzing" class="fixed bottom-20 left-0 right-0 max-w-md mx-auto px-5 z-30">
      <div class="card !p-4 flex gap-3 shadow-lg">
        <button 
          @click="resetImage"
          class="flex-1 btn-secondary !py-3 !text-sm"
        >
          🔄 重新拍照
        </button>
        <button 
          @click="analyzeImage"
          class="flex-1 btn-primary !py-3 !text-sm"
        >
          🔍 开始识别
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const fileInput = ref(null)
const hasImage = ref(false)
const previewImage = ref('')
const isAnalyzing = ref(false)
const progress = ref(0)
const recognitionResult = ref(null)

// 模拟识别结果数据
const mockRecognitionData = {
  name: '白粉病',
  scientificName: 'Powdery Mildew',
  confidence: 87,
  description: '白粉病是由真菌引起的常见植物病害，主要危害叶片、嫩梢等部位。发病初期在叶片表面出现白色粉状小斑点，后期逐渐扩大连成片，严重时导致叶片枯黄脱落。该病在温暖干燥的环境下容易发生，通风不良会加重病情。',
  alternatives: [
    { name: '粉蚧危害', confidence: 8 },
    { name: '灰尘污染', confidence: 5 },
  ],
  solution: {
    steps: [
      {
        title: '隔离病株',
        description: '立即将患病植物移至通风处，远离其他健康植物，防止病菌传播扩散。'
      },
      {
        title: '摘除病叶',
        description: '用消毒过的剪刀剪掉严重感染的叶片，不要堆肥，建议密封后丢弃或焚烧处理。'
      },
      {
        title: '药剂治疗（轻度）',
        description: '可使用小苏打溶液（1升水+5克小苏打）喷洒叶片正反面，每3天一次，连续2-3次。'
      },
      {
        title: '药剂治疗（重度）',
        description: '使用专用杀菌剂如代森锰锌、甲基托布津等，按说明书稀释后喷洒，注意轮换用药避免抗药性。'
      }
    ]
  },
  prevention: [
    '保持良好的通风环境，避免植株过密',
    '浇水时避免淋湿叶片，尽量从根部浇灌',
    '增加钾肥施用，提高植物抗病能力',
    '定期检查，早发现早治疗',
    '冬季休眠期彻底清理枯枝落叶'
  ]
}

const triggerUpload = () => {
  fileInput.value?.click()
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      previewImage.value = e.target.result
      hasImage.value = true
      // 自动开始分析
      analyzeImage()
    }
    reader.readAsDataURL(file)
  }
}

const resetImage = () => {
  hasImage.value = false
  previewImage.value = ''
  recognitionResult.value = null
  isAnalyzing.value = false
  progress.value = 0
}

const analyzeImage = () => {
  if (!hasImage.value) return
  
  isAnalyzing.value = true
  recognitionResult.value = null
  progress.value = 0
  
  // 模拟进度条动画
  const interval = setInterval(() => {
    if (progress.value < 90) {
      progress.value += Math.random() * 15
    } else {
      clearInterval(interval)
    }
  }, 300)
  
  // 模拟API调用延迟
  setTimeout(() => {
    clearInterval(interval)
    progress.value = 100
    
    setTimeout(() => {
      isAnalyzing.value = false
      recognitionResult.value = mockRecognitionData
    }, 500)
  }, 2500)
}

const submitFeedback = (type) => {
  alert(type === 'accurate' ? '✅ 感谢您的反馈！这将帮助我们改进识别准确度' : '❌ 感谢反馈！我们会持续优化算法')
}
</script>
