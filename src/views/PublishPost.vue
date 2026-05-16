<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航 -->
    <div class="bg-white sticky top-0 z-40 px-5 pt-12 pb-4 shadow-sm flex items-center justify-between">
      <button @click="$router.back()" class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors active:scale-95">
        <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
      <h1 class="text-lg font-bold text-gray-800">发布动态</h1>
      <button 
        @click="publishPost"
        :disabled="!canPublish"
        class="px-4 py-2 rounded-full text-sm font-semibold transition-all"
        :class="canPublish ? 'bg-primary-500 text-white active:scale-95' : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
      >
        发布
      </button>
    </div>

    <!-- 编辑器区域 -->
    <div class="px-5 py-4 pb-32 space-y-5">
      <!-- 选择帖子类型 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">选择类型</label>
        <div class="grid grid-cols-5 gap-2">
          <button 
            v-for="type in postTypes" 
            :key="type.value"
            @click="form.type = type.value"
            class="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all duration-200"
            :class="form.type === type.value ? 'bg-primary-50 ring-2 ring-primary-500' : 'bg-gray-50 hover:bg-gray-100'"
          >
            <span class="text-2xl">{{ type.icon }}</span>
            <span class="text-xs font-medium text-gray-700">{{ type.label }}</span>
          </button>
        </div>
      </div>

      <!-- 标题输入 -->
      <div v-if="form.type === 'question' || form.type === 'harvest_show'">
        <label class="block text-sm font-medium text-gray-700 mb-2">标题 *</label>
        <input 
          type="text" 
          v-model="form.title"
          placeholder="请输入标题（50字以内）"
          maxlength="50"
          class="input-field"
        />
        <p class="text-xs text-gray-400 mt-1 text-right">{{ form.title.length }}/50</p>
      </div>

      <!-- 正文输入 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">正文内容 *</label>
        <textarea 
          v-model="form.content"
          placeholder="分享你的种植经验、提问或展示成果..."
          maxlength="2000"
          rows="8"
          class="input-field resize-none !min-h-[200px]"
        ></textarea>
        <p class="text-xs text-gray-400 mt-1 text-right">{{ form.content.length }}/2000</p>
      </div>

      <!-- 图片上传 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">
          图片（选填，最多9张）
        </label>
        
        <div class="grid grid-cols-3 gap-3">
          <!-- 已上传的图片 -->
          <div 
            v-for="(img, index) in form.images" 
            :key="index"
            class="aspect-square relative rounded-xl overflow-hidden bg-gray-100 group"
          >
            <img :src="img" alt="" class="w-full h-full object-cover" />
            <button 
              @click="removeImage(index)"
              class="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-sm"
            >
              ×
            </button>
          </div>

          <!-- 上传按钮 -->
          <button 
            v-if="form.images.length < 9"
            @click="triggerImageUpload"
            class="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-primary-400 hover:bg-primary-50 transition-all flex flex-col items-center justify-center gap-1"
          >
            <span class="text-3xl text-gray-300">+</span>
            <span class="text-xs text-gray-400">添加图片</span>
          </button>
        </div>

        <input 
          ref="imageInput"
          type="file"
          accept="image/*"
          multiple
          class="hidden"
          @change="handleImageSelect"
        />
      </div>

      <!-- 关联植物 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">关联植物（选填）</label>
        <button class="w-full card !p-4 flex items-center gap-3 !border-dashed !border-2 !border-gray-300 hover:!border-primary-400 transition-all">
          <span class="text-2xl">🌿</span>
          <span class="text-sm text-gray-600">选择要关联的植物档案</span>
          <svg class="w-4 h-4 ml-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>

      <!-- 添加话题标签 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">话题标签（选填）</label>
        <div class="flex flex-wrap gap-2 mb-2">
          <span 
            v-for="(tag, index) in form.tags" 
            :key="index"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
          >
            #{{ tag }}
            <button @click="removeTag(index)" class="hover:text-red-500">×</button>
          </span>
        </div>
        <input 
          type="text" 
          v-model="tagInput"
          @keydown.enter.prevent="addTag"
          placeholder="输入话题后按回车添加，如：薄荷、新手求助..."
          class="input-field !text-sm"
        />
        <div class="flex gap-2 mt-2 overflow-x-auto scrollbar-hide pb-1">
          <button 
            v-for="hotTag in hotTags" 
            :key="hotTag"
            @click="addTag(hotTag)"
            class="flex-shrink-0 px-3 py-1.5 bg-gray-100 hover:bg-primary-50 hover:text-primary-600 rounded-full text-xs font-medium text-gray-600 transition-colors"
          >
            #{{ hotTag }}
          </button>
        </div>
      </div>

      <!-- 可见范围 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">可见范围</label>
        <div class="grid grid-cols-3 gap-2">
          <button 
            v-for="scope in visibilityScopes" 
            :key="scope.value"
            @click="form.visibility = scope.value"
            class="px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
            :class="form.visibility === scope.value ? 'bg-primary-500 text-white shadow-plant' : 'bg-gray-100 text-gray-600'"
          >
            {{ scope.label }}
          </button>
        </div>
      </div>

      <!-- 发布提示 -->
      <div class="card !p-4 !bg-gradient-to-r !from-yellow-50 !to-orange-50">
        <p class="text-xs text-orange-800 leading-relaxed">
          ⚠️ <strong>发布须知：</strong><br/>
          • 请遵守社区规范，发布优质内容<br/>
          • 禁止广告、刷屏、违规信息<br/>
          • 内容将经过AI+人工审核后展示<br/>
          • 违规内容将被隐藏或删除
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const imageInput = ref(null)
const tagInput = ref('')

const form = ref({
  type: 'experience_share',
  title: '',
  content: '',
  images: [],
  tags: [],
  visibility: 'public'
})

const postTypes = ref([
  { icon: '💡', label: '经验', value: 'experience_share' },
  { icon: '❓', label: '求助', value: 'question' },
  { icon: '🌟', label: '成果', value: 'harvest_show' },
  { icon: '📝', label: '日记', value: 'diary' },
  { icon: '🆘', label: '紧急', value: 'help' },
])

const visibilityScopes = ref([
  { label: '公开', value: 'public' },
  { label: '关注者', value: 'followers' },
  { label: '群组', value: 'group' },
])

const hotTags = ref(['薄荷', '多肉', '月季', '新手', '病虫害', '阳台菜园', '爆盆', '成就感'])

const canPublish = computed(() => {
  return form.value.content.trim().length > 0 && (form.value.type !== 'question' || form.value.title.trim().length > 0)
})

const triggerImageUpload = () => {
  imageInput.value?.click()
}

const handleImageSelect = (event) => {
  const files = Array.from(event.target.files)
  
  files.forEach(file => {
    if (form.value.images.length >= 9) return
    
    const reader = new FileReader()
    reader.onload = (e) => {
      form.value.images.push(e.target.result)
    }
    reader.readAsDataURL(file)
  })
}

const removeImage = (index) => {
  form.value.images.splice(index, 1)
}

const addTag = (tagText) => {
  const tag = tagText.trim() || tagInput.value.trim()
  if (!tag) return
  
  // 去重
  const normalizedTag = tag.replace(/^#/, '')
  if (!form.value.tags.includes(normalizedTag) && form.value.tags.length < 5) {
    form.value.tags.push(normalizedTag)
  }
  
  tagInput.value = ''
}

const removeTag = (index) => {
  form.value.tags.splice(index, 1)
}

const publishPost = () => {
  if (!canPublish.value) return
  
  alert('✅ 动态发布成功！\n\n您的动态将在审核后展示给其他用户。\n感谢分享！')
  router.back()
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
</style>
