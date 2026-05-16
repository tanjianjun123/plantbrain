<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航 -->
    <div class="bg-white sticky top-0 z-40 px-5 pt-12 pb-4 shadow-sm flex items-center gap-4">
      <button @click="$router.back()" class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors active:scale-95">
        <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
      <h1 class="text-xl font-bold text-gray-800">添加植物</h1>
    </div>

    <!-- 添加方式选择 -->
    <div class="px-5 py-6 space-y-4">
      <p class="text-sm text-gray-500 mb-4">选择添加方式</p>
      
      <div class="grid grid-cols-3 gap-3">
        <button 
          v-for="method in addMethods" 
          :key="method.value"
          @click="addMethod = method.value"
          class="card !p-4 flex flex-col items-center gap-2 transition-all duration-200 cursor-pointer"
          :class="addMethod === method.value ? 'ring-2 ring-primary-500 bg-primary-50' : 'hover:shadow-md'"
        >
          <span class="text-4xl">{{ method.icon }}</span>
          <span class="text-xs font-medium text-gray-700">{{ method.label }}</span>
        </button>
      </div>

      <!-- 拍照识别区域 -->
      <div v-if="addMethod === 'camera'" class="card !p-6 text-center animate-fade-in">
        <div class="w-48 h-48 mx-auto rounded-3xl bg-gradient-to-br from-primary-100 to-primary-50 border-2 border-dashed border-primary-300 flex items-center justify-center mb-4 cursor-pointer hover:border-primary-500 transition-colors group">
          <div class="text-center">
            <div class="text-6xl mb-2 group-hover:scale-110 transition-transform">📸</div>
            <p class="text-sm text-primary-700 font-medium">点击拍照识别</p>
            <p class="text-xs text-primary-600 mt-1">AI自动识别植物品种</p>
          </div>
        </div>
        <p class="text-xs text-gray-400 mt-3">支持常见阳台植物品种，识别准确率>90%</p>
      </div>

      <!-- 表单区域 -->
      <div v-if="addMethod === 'manual' || addMethod === 'search'" class="space-y-4 animate-fade-in">
        <!-- 品种搜索/选择 -->
        <div v-if="addMethod === 'search'" class="relative">
          <label class="block text-sm font-medium text-gray-700 mb-2">搜索品种</label>
          <input 
            type="text" 
            v-model="form.variety"
            placeholder="输入植物名称，如：薄荷、绿萝..."
            class="input-field !pl-10"
          />
          <span class="absolute left-3 top-9 text-gray-400">🔍</span>
          
          <!-- 搜索建议 -->
          <div v-if="form.variety && searchSuggestions.length > 0" class="mt-2 card !p-2 !shadow-lg max-h-48 overflow-y-auto">
            <button 
              v-for="item in searchSuggestions" 
              :key="item"
              @click="selectVariety(item)"
              class="w-full px-4 py-2.5 text-left rounded-xl hover:bg-primary-50 transition-colors text-sm text-gray-700"
            >
              {{ item }}
            </button>
          </div>
        </div>

        <div v-else>
          <label class="block text-sm font-medium text-gray-700 mb-2">植物名称 *</label>
          <input 
            type="text" 
            v-model="form.name"
            placeholder="给植物起个名字，如：小薄荷"
            class="input-field"
          />
        </div>

        <!-- 昵称 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">昵称（别名）*</label>
          <input 
            type="text" 
            v-model="form.nickname"
            placeholder="如：我家的小可爱"
            class="input-field"
          />
        </div>

        <!-- 种植日期 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">种植日期 *</label>
          <input 
            type="date" 
            v-model="form.plantedDate"
            class="input-field"
          />
        </div>

        <!-- 来源 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">来源</label>
          <div class="grid grid-cols-4 gap-2">
            <button 
              v-for="source in sources" 
              :key="source.value"
              @click="form.source = source.value"
              class="px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200"
              :class="form.source === source.value ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'"
            >
              {{ source.label }}
            </button>
          </div>
        </div>

        <!-- 环境信息 -->
        <div class="card !p-5 !bg-gradient-to-br !from-orange-50 !to-white">
          <h3 class="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span>🏠</span> 环境信息
          </h3>
          
          <div class="space-y-3">
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1.5">阳台朝向</label>
              <select v-model="form.balconyOrientation" class="input-field !text-sm">
                <option value="">请选择</option>
                <option value="东向">东向 🌅</option>
                <option value="南向">南向 ☀️</option>
                <option value="西向">西向 🌇</option>
                <option value="北向">北向 🌑</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1.5">摆放位置</label>
              <input 
                type="text" 
                v-model="form.position"
                placeholder="如：阳台左侧花架、客厅窗台..."
                class="input-field !text-sm"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1.5">盆器类型</label>
                <select v-model="form.potType" class="input-field !text-sm">
                  <option value="">选择盆器</option>
                  <option value="塑料盆">塑料盆</option>
                  <option value="陶瓷盆">陶瓷盆</option>
                  <option value="粗陶盆">粗陶盆</option>
                  <option value="加仑盆">加仑盆</option>
                  <option value="种植箱">种植箱</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1.5">备注</label>
                <input 
                  type="text" 
                  v-model="form.notes"
                  placeholder="其他信息..."
                  class="input-field !text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 提交按钮 -->
        <button 
          @click="submitForm"
          :disabled="!isFormValid"
          class="w-full btn-primary !py-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          🌱 添加到我的花园
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const addMethod = ref('manual')

const addMethods = ref([
  { icon: '✏️', label: '手动输入', value: 'manual' },
  { icon: '📸', label: '拍照识别', value: 'camera' },
  { icon: '🔍', label: '品种库', value: 'search' },
])

const form = ref({
  name: '',
  nickname: '',
  variety: '',
  plantedDate: new Date().toISOString().split('T')[0],
  source: 'purchase',
  balconyOrientation: '',
  position: '',
  potType: '',
  notes: ''
})

const sources = ref([
  { label: '种子', value: 'seed' },
  { label: '扦插', value: 'cutting' },
  { label: '购买', value: 'purchase' },
  { label: '赠送', value: 'gift' },
])

const searchSuggestions = ref(['薄荷', '绿萝', '多肉', '月季', '番茄', '蝴蝶兰', '吊兰', '芦荟', '仙人掌', '文竹'])

const isFormValid = computed(() => {
  return form.value.name.trim() !== '' && form.value.plantedDate !== ''
})

const selectVariety = (variety) => {
  form.value.name = variety
  form.value.variety = variety
}

const submitForm = () => {
  if (!isFormValid.value) {
    alert('请填写必填项')
    return
  }

  // 模拟保存成功
  alert(`✅ 成功添加「${form.value.nickname || form.value.name}」！\n\n接下来可以：\n• 查看个性化养护方案\n• 设置浇水提醒\n• 记录生长变化`)
  
  router.push('/plants')
}
</script>
