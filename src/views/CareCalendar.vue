<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部标题 -->
    <div class="bg-white sticky top-0 z-40 px-5 pt-12 pb-4 shadow-sm">
      <h1 class="text-2xl font-bold text-gray-800 mb-1">📅 养护日历</h1>
      <p class="text-sm text-gray-500">管理所有植物的护理计划</p>
    </div>

    <!-- 日期选择器 -->
    <div class="px-5 py-4 bg-white border-b border-gray-100">
      <div class="flex items-center justify-between mb-3">
        <button @click="prevMonth" class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
          ‹
        </button>
        <h2 class="text-lg font-bold text-gray-800">{{ currentYear }}年{{ currentMonth + 1 }}月</h2>
        <button @click="nextMonth" class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
          ›
        </button>
      </div>

      <!-- 星期头 -->
      <div class="grid grid-cols-7 gap-1 mb-2">
        <div v-for="day in weekDays" :key="day" class="text-center text-xs font-medium text-gray-400 py-2">
          {{ day }}
        </div>
      </div>

      <!-- 日历网格 -->
      <div class="grid grid-cols-7 gap-1">
        <div 
          v-for="(day, index) in calendarDays" 
          :key="index"
          class="aspect-square relative rounded-xl flex items-center justify-center text-sm transition-all duration-200 cursor-pointer"
          :class="{
            'text-gray-300': !day.isCurrentMonth,
            'bg-primary-500 text-white font-bold shadow-plant': day.isToday,
            'hover:bg-gray-100': day.isCurrentMonth && !day.isToday,
            'font-medium text-gray-700': day.isCurrentMonth && !day.isToday && !day.hasTask,
            'ring-2 ring-primary-200 ring-offset-1': day.hasTask && !day.isToday
          }"
          @click="selectDate(day)"
        >
          {{ day.day }}
          <!-- 任务标记点 -->
          <span 
            v-if="day.hasTask && !day.isToday" 
            class="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-primary-500"
          ></span>
        </div>
      </div>
    </div>

    <!-- 今日概览卡片 -->
    <div class="px-5 py-4">
      <div class="card !p-5 !bg-gradient-to-r !from-primary-500 !to-primary-600 !text-white">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-bold text-lg">今日待办</h3>
          <span class="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">{{ todayTasks.length }}项任务</span>
        </div>
        
        <div class="space-y-2">
          <div 
            v-for="task in todayTasks.slice(0, 3)" 
            :key="task.id"
            class="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3"
          >
            <span class="text-2xl">{{ task.icon }}</span>
            <div class="flex-1 min-w-0">
              <p class="font-medium text-sm truncate">{{ task.title }}</p>
              <p class="text-xs opacity-80 truncate">{{ task.plantName }}</p>
            </div>
            <button class="px-3 py-1 bg-white text-primary-600 rounded-lg text-xs font-semibold hover:bg-white/90 active:scale-95 transition-all">
              完成
            </button>
          </div>
        </div>

        <div class="mt-3 pt-3 border-t border-white/20 flex items-center justify-between text-sm">
          <span>本周完成率</span>
          <span class="font-bold">12/15 (80%) 🔥</span>
        </div>
      </div>
    </div>

    <!-- 待办任务列表 -->
    <div class="px-5 pb-8">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-bold text-gray-800">📋 任务列表</h3>
        <div class="flex gap-2">
          <button 
            v-for="filter in taskFilters" 
            :key="filter.value"
            @click="activeFilter = filter.value"
            class="px-3 py-1 rounded-full text-xs font-medium transition-all duration-200"
            :class="activeFilter === filter.value ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'"
          >
            {{ filter.label }}
          </button>
        </div>
      </div>

      <div class="space-y-3">
        <div 
          v-for="task in filteredTasks" 
          :key="task.id"
          class="card !p-4 animate-slide-up"
          :class="{ 'border-l-4 border-l-red-400': task.overdue }"
        >
          <div class="flex items-start gap-3">
            <div class="w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center text-2xl"
              :class="{
                'bg-blue-100': task.type === 'watering',
                'bg-green-100': task.type === 'fertilizing',
                'bg-yellow-100': task.type === 'check',
                'bg-red-100': task.overdue
              }"
            >
              {{ task.icon }}
            </div>
            
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between mb-1">
                <div>
                  <h4 class="font-semibold text-gray-800 text-sm">{{ task.title }}</h4>
                  <p class="text-xs text-gray-500 mt-0.5">{{ task.plantName }}</p>
                </div>
                <span 
                  class="px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-2"
                  :class="task.overdue ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'"
                >
                  {{ task.dueTime }}
                </span>
              </div>
              
              <div class="flex items-center gap-2 mt-2">
                <router-link 
                  :to="`/plants/${task.plantId}`" 
                  class="text-xs text-primary-600 hover:underline"
                >
                  查看植物 →
                </router-link>
                <button class="text-xs text-gray-400 hover:text-gray-600">推迟</button>
                <button class="text-xs text-gray-400 hover:text-gray-600">忽略</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 即将到期提醒 -->
      <div class="mt-6 card !p-5 !bg-gradient-to-br !from-yellow-50 !to-orange-50">
        <h3 class="font-semibold text-orange-800 mb-3 flex items-center gap-2">
          ⏰ 即将到期（3天内）
        </h3>
        <div class="space-y-2">
          <div 
            v-for="task in upcomingTasks" 
            :key="task.id"
            class="flex items-center gap-3 py-2"
          >
            <span class="text-lg">{{ task.icon }}</span>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-700 truncate">{{ task.plantName }} - {{ task.title }}</p>
            </div>
            <span class="text-xs font-medium text-orange-600">{{ task.dueTime }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { mockTodayTasks } from '../data/mockData'

const todayTasks = ref(mockTodayTasks)
const activeFilter = ref('all')
const currentYear = ref(new Date().getFullYear())
const currentMonth = ref(new Date().getMonth())
const selectedDate = ref(new Date())

const weekDays = ['日', '一', '二', '三', '四', '五', '六']

const taskFilters = ref([
  { label: '全部', value: 'all' },
  { label: '今天', value: 'today' },
  { label: '逾期', value: 'overdue' },
])

// 生成日历数据
const calendarDays = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()
  
  const days = []
  const today = new Date()
  
  // 上个月的日期
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      isToday: false,
      hasTask: false
    })
  }
  
  // 当前月的日期
  for (let i = 1; i <= daysInMonth; i++) {
    const isToday = year === today.getFullYear() && month === today.getMonth() && i === today.getDate()
    days.push({
      day: i,
      isCurrentMonth: true,
      isToday: isToday,
      hasTask: Math.random() > 0.7 // 模拟有任务的日期
    })
  }
  
  // 下个月的日期（补齐6行）
  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      day: i,
      isCurrentMonth: false,
      isToday: false,
      hasTask: false
    })
  }
  
  return days
})

const filteredTasks = computed(() => {
  if (activeFilter.value === 'all') return todayTasks.value
  if (activeFilter.value === 'today') return todayTasks.value.filter(t => t.dueTime === '今天')
  if (activeFilter.value === 'overdue') return todayTasks.value.filter(t => t.overdue)
  return todayTasks.value
})

const upcomingTasks = computed(() => {
  return todayTasks.value.filter(t => !t.overdue && t.dueTime !== '今天').slice(0, 3)
})

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

const selectDate = (day) => {
  if (day.isCurrentMonth) {
    selectedDate.value = new Date(currentYear.value, currentMonth.value, day.day)
  }
}
</script>
