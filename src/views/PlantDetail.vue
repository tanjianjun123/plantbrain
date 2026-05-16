<template>
  <div class="min-h-screen bg-gray-50" v-if="plant">
    <!-- 顶部图片区域 -->
    <div class="relative h-80 overflow-hidden">
      <img 
        :src="plant.image" 
        :alt="plant.name"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      
      <!-- 返回按钮 -->
      <button 
        @click="$router.back()"
        class="absolute top-12 left-5 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors active:scale-95"
      >
        <svg class="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>

      <!-- 操作按钮组 -->
      <div class="absolute top-12 right-5 flex gap-2">
        <button class="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors">
          ⋮
        </button>
      </div>

      <!-- 植物名称 -->
      <div class="absolute bottom-6 left-5 right-5 text-white">
        <div class="flex items-center gap-2 mb-2">
          <h1 class="text-3xl font-bold">{{ plant.name }}</h1>
          <span class="px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
            :class="{
              'bg-green-400/90': plant.healthStatus === 'healthy',
              'bg-yellow-400/90': plant.healthStatus === 'subhealthy',
              'bg-red-400/90': plant.healthStatus === 'pest'
            }"
          >
            {{ healthStatusText(plant.healthStatus) }}
          </span>
        </div>
        <p class="text-white/90 text-sm">{{ plant.variety }} · {{ plant.scientificName }}</p>
      </div>
    </div>

    <!-- 关键指标卡片 -->
    <div class="px-5 -mt-6 relative z-10">
      <div class="card !p-5 grid grid-cols-4 gap-4">
        <div class="text-center">
          <p class="text-2xl font-bold text-primary-600">{{ plant.daysSincePlanted }}</p>
          <p class="text-xs text-gray-500 mt-1">养护天数</p>
        </div>
        <div class="text-center border-l border-gray-100">
          <p class="text-2xl font-bold text-blue-500">
            {{ plant.careSchedule.nextWatering > 0 ? `${plant.careSchedule.nextWatering}天` : '今天' }}
          </p>
          <p class="text-xs text-gray-500 mt-1">下次浇水</p>
        </div>
        <div class="text-center border-l border-gray-100">
          <p class="text-2xl font-bold text-green-500">{{ plant.height }}cm</p>
          <p class="text-xs text-gray-500 mt-1">当前高度</p>
        </div>
        <div class="text-center border-l border-gray-100">
          <p class="text-2xl font-bold text-purple-500">{{ plant.stats.totalWaterings }}</p>
          <p class="text-xs text-gray-500 mt-1">浇水次数</p>
        </div>
      </div>
    </div>

    <!-- Tab 导航 -->
    <div class="px-5 mt-6 sticky top-0 bg-gray-50 z-30">
      <div class="flex gap-8 border-b border-gray-200">
        <button 
          v-for="tab in tabs" 
          :key="tab.key"
          @click="activeTab = tab.key"
          class="pb-3 text-sm font-medium transition-all duration-200 relative"
          :class="activeTab === tab.key ? 'tab-active' : 'tab-inactive'"
        >
          {{ tab.label }}
          <span 
            v-if="activeTab === tab.key" 
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full"
          ></span>
        </button>
      </div>
    </div>

    <!-- Tab 内容 -->
    <div class="px-5 py-4 pb-24">
      <!-- 概览 Tab -->
      <div v-show="activeTab === 'overview'" class="space-y-4 animate-fade-in">
        <!-- 基本信息 -->
        <div class="card !p-5">
          <h3 class="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>📋</span> 基本信息
          </h3>
          <div class="space-y-3">
            <div class="flex justify-between items-center py-2 border-b border-gray-50">
              <span class="text-gray-500 text-sm">品种</span>
              <span class="text-gray-800 font-medium text-sm">{{ plant.variety }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-50">
              <span class="text-gray-500 text-sm">科属</span>
              <span class="text-gray-800 font-medium text-sm">{{ plant.family }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-50">
              <span class="text-gray-500 text-sm">种植日期</span>
              <span class="text-gray-800 font-medium text-sm">{{ plant.plantedDate }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-50">
              <span class="text-gray-500 text-sm">当前阶段</span>
              <span class="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium">
                {{ stageText(plant.currentStage) }}
              </span>
            </div>
            <div class="flex justify-between items-center py-2">
              <span class="text-gray-500 text-sm">生长速度</span>
              <span class="text-green-600 font-medium text-sm">{{ plant.stats.growthRate }}</span>
            </div>
          </div>
        </div>

        <!-- 环境信息 -->
        <div class="card !p-5">
          <h3 class="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>🏠</span> 环境信息
          </h3>
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-3">
              <p class="text-xs text-orange-600 mb-1">阳台朝向</p>
              <p class="font-semibold text-gray-800">{{ plant.environment.balconyOrientation }}</p>
            </div>
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3">
              <p class="text-xs text-blue-600 mb-1">摆放位置</p>
              <p class="font-semibold text-gray-800 text-sm">{{ plant.environment.position }}</p>
            </div>
            <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3">
              <p class="text-xs text-green-600 mb-1">盆器类型</p>
              <p class="font-semibold text-gray-800">{{ plant.environment.potType }}</p>
            </div>
            <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3">
              <p class="text-xs text-purple-600 mb-1">浇水周期</p>
              <p class="font-semibold text-gray-800">每{{ plant.careSchedule.waterCycle }}天</p>
            </div>
          </div>
        </div>

        <!-- 快捷操作 -->
        <div class="grid grid-cols-2 gap-3">
          <button @click="showCareRecordModal = true" class="card !p-4 flex items-center gap-3 hover:shadow-md transition-all active:scale-95">
            <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl">💧</div>
            <div class="text-left">
              <p class="font-semibold text-gray-800 text-sm">记录浇水</p>
              <p class="text-xs text-gray-500">上次: {{ plant.careSchedule.lastWatered }}</p>
            </div>
          </button>
          <router-link :to="`/care/${plant.id}/scheme`" class="card !p-4 flex items-center gap-3 hover:shadow-md transition-all active:scale-95">
            <div class="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-2xl">📋</div>
            <div class="text-left">
              <p class="font-semibold text-gray-800 text-sm">养护方案</p>
              <p class="text-xs text-gray-500">查看详细方案</p>
            </div>
          </router-link>
        </div>
      </div>

      <!-- 养护记录 Tab -->
      <div v-show="activeTab === 'care'" class="space-y-3 animate-fade-in">
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-bold text-gray-800">最近护理</h3>
          <button class="text-primary-600 text-sm font-medium">查看全部 →</button>
        </div>

        <div 
          v-for="record in careRecords.filter(r => r.plantId === plant.id)" 
          :key="record.id"
          class="card !p-4 flex items-start gap-3"
        >
          <div class="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-lg"
            :class="{
              'bg-blue-100': record.type === 'watering',
              'bg-green-100': record.type === 'fertilizing',
              'bg-red-100': record.type === 'pest_control',
              'bg-yellow-100': record.type === 'pruning'
            }"
          >
            {{ careTypeIcon(record.type) }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-1">
              <p class="font-semibold text-gray-800 text-sm">{{ careTypeName(record.type) }}</p>
              <span class="text-xs text-gray-400">{{ record.date }} {{ record.time }}</span>
            </div>
            <p class="text-sm text-gray-600">{{ record.note || '无备注' }}</p>
          </div>
        </div>

        <div v-if="careRecords.filter(r => r.plantId === plant.id).length === 0" class="text-center py-8 text-gray-400">
          <p class="text-4xl mb-2">📝</p>
          <p>暂无养护记录</p>
        </div>
      </div>

      <!-- 生长轨迹 Tab -->
      <div v-show="activeTab === 'growth'" class="animate-fade-in">
        <div class="card !p-5 text-center">
          <div class="text-6xl mb-4">📸</div>
          <h3 class="font-bold text-gray-800 mb-2">照片时间轴</h3>
          <p class="text-sm text-gray-500 mb-4">记录植物的生长变化，见证每一个精彩瞬间</p>
          
          <div class="grid grid-cols-3 gap-3 mt-6">
            <div class="aspect-square rounded-xl overflow-hidden bg-gray-100">
              <img src="https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=200&h=200&fit=crop" alt="" class="w-full h-full object-cover opacity-60" />
              <div class="relative -mt-8 pt-16 bg-gradient-to-t from-black/60 to-transparent h-full">
                <p class="text-white text-xs font-medium px-2 pb-2">Day 1</p>
              </div>
            </div>
            <div class="aspect-square rounded-xl overflow-hidden bg-gray-100">
              <img src="https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=200&h=200&fit=crop" alt="" class="w-full h-full object-cover opacity-75" />
              <div class="relative -mt-8 pt-16 bg-gradient-to-t from-black/60 to-transparent h-full">
                <p class="text-white text-xs font-medium px-2 pb-2">Day 30</p>
              </div>
            </div>
            <div class="aspect-square rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
              <div class="text-center">
                <p class="text-3xl text-gray-300 mb-1">+</p>
                <p class="text-xs text-gray-400">添加新照片</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部悬浮操作栏 -->
    <div class="fixed bottom-20 left-0 right-0 max-w-md mx-auto px-5 z-30">
      <div class="card !p-4 flex gap-3 shadow-lg">
        <button 
          @click="quickRecord('watering')"
          class="flex-1 btn-primary !py-3 !text-sm flex items-center justify-center gap-2"
        >
          💧 快速浇水
        </button>
        <button 
          @click="showCareRecordModal = true"
          class="flex-1 btn-secondary !py-3 !text-sm flex items-center justify-center gap-2"
        >
          📝 详细记录
        </button>
      </div>
    </div>

    <!-- 护理记录弹窗 (简化版) -->
    <div v-if="showCareRecordModal" class="fixed inset-0 bg-black/50 z-50 flex items-end justify-center" @click.self="showCareRecordModal = false">
      <div class="bg-white rounded-t-3xl w-full max-w-md animate-slide-up max-h-[80vh] overflow-y-auto">
        <div class="sticky top-0 bg-white px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 class="font-bold text-lg text-gray-800">记录护理</h3>
          <button @click="showCareRecordModal = false" class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">×</button>
        </div>
        
        <div class="p-5 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">护理类型</label>
            <div class="grid grid-cols-3 gap-2">
              <button 
                v-for="type in careTypes" 
                :key="type.value"
                @click="selectedCareType = type.value"
                class="px-4 py-3 rounded-xl text-center transition-all duration-200"
                :class="selectedCareType === type.value ? 'bg-primary-500 text-white shadow-plant' : 'bg-gray-100 text-gray-700'"
              >
                <span class="block text-xl mb-1">{{ type.icon }}</span>
                <span class="text-xs font-medium">{{ type.label }}</span>
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">备注（选填）</label>
            <textarea 
              v-model="careNote"
              placeholder="记录一下这次护理的情况..."
              class="input-field !min-h-[100px] resize-none"
              rows="3"
            ></textarea>
          </div>

          <button 
            @click="submitCareRecord"
            class="w-full btn-primary !py-4"
          >
            保存记录
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { mockPlants, mockCareRecords } from '../data/mockData'

const route = useRoute()
const plant = ref(null)
const plants = ref(mockPlants)
const careRecords = ref(mockCareRecords)
const activeTab = ref('overview')
const showCareRecordModal = ref(false)
const selectedCareType = ref('watering')
const careNote = ref('')

const tabs = ref([
  { key: 'overview', label: '概览' },
  { key: 'care', label: '护理记录' },
  { key: 'growth', label: '生长轨迹' },
])

const careTypes = ref([
  { icon: '💧', label: '浇水', value: 'watering' },
  { icon: '🌱', label: '施肥', value: 'fertilizing' },
  { icon: '✂️', label: '修剪', value: 'pruning' },
  { icon: '🪴', label: '换盆', value: 'repotting' },
  { icon: '🐛', label: '除虫', value: 'pest_control' },
  { icon: '📝', label: '其他', value: 'other' },
])

onMounted(() => {
  const plantId = route.params.id
  plant.value = plants.value.find(p => p.id === plantId)
})

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

const careTypeIcon = (type) => {
  const map = {
    watering: '💧',
    fertilizing: '🌱',
    pruning: '✂️',
    repotting: '🪴',
    pest_control: '🐛',
    other: '📝'
  }
  return map[type] || '📝'
}

const careTypeName = (type) => {
  const map = {
    watering: '浇水',
    fertilizing: '施肥',
    pruning: '修剪',
    repotting: '换盆',
    pest_control: '病虫害防治',
    other: '其他护理'
  }
  return map[type] || '其他'
}

const quickRecord = (type) => {
  selectedCareType.value = type
  submitCareRecord()
}

const submitCareRecord = () => {
  const now = new Date()
  const newRecord = {
    id: Date.now().toString(),
    plantId: plant.value.id,
    type: selectedCareType.value,
    date: now.toISOString().split('T')[0],
    time: now.toTimeString().split(' ')[0].substring(0, 5),
    note: careNote.value
  }
  
  careRecords.value.unshift(newRecord)
  
  // 更新植物统计数据
  if (selectedCareType.value === 'watering') {
    plant.value.stats.totalWaterings++
    plant.value.careSchedule.lastWatered = newRecord.date
  } else if (selectedCareType.value === 'fertilizing') {
    plant.value.stats.totalFertilizings++
  }

  // 显示成功提示
  alert(`✅ ${careTypeName(selectedCareType.value)}记录成功！`)
  
  // 重置表单
  showCareRecordModal.value = false
  careNote.value = ''
}
</script>
