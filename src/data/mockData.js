// Mock 数据 - 模拟后端API响应

export const mockPlants = [
  {
    id: '1',
    name: '小薄荷',
    variety: '留兰香薄荷',
    scientificName: 'Mentha spicata',
    family: '唇形科',
    image: 'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=400&h=400&fit=crop',
    currentStage: 'growth',
    healthStatus: 'healthy',
    height: 25,
    plantedDate: '2024-03-15',
    daysSincePlanted: 62,
    environment: {
      balconyOrientation: '南向',
      position: '阳台左侧花架',
      potType: '陶瓷盆'
    },
    careSchedule: {
      nextWatering: 1,
      lastWatered: '2024-05-14',
      nextFertilizing: 5,
      waterCycle: 2
    },
    stats: {
      totalWaterings: 28,
      totalFertilizings: 4,
      growthRate: '+3.2cm/月'
    }
  },
  {
    id: '2',
    name: '绿萝宝宝',
    variety: '黄金葛',
    scientificName: 'Epipremnum aureum',
    family: '天南星科',
    image: 'https://images.unsplash.com/photo-1593482892290-7b028c970c08?w=400&h=400&fit=crop',
    currentStage: 'growth',
    healthStatus: 'subhealthy',
    height: 45,
    plantedDate: '2024-02-01',
    daysSincePlanted: 105,
    environment: {
      balconyOrientation: '东向',
      position: '客厅书架',
      potType: '塑料盆'
    },
    careSchedule: {
      nextWatering: 2,
      lastWatered: '2024-05-13',
      nextFertilizing: 10,
      waterCycle: 4
    },
    stats: {
      totalWaterings: 35,
      totalFertilizings: 6,
      growthRate: '+5.1cm/月'
    }
  },
  {
    id: '3',
    name: '多肉组合',
    variety: '桃蛋+吉娃娃',
    scientificName: 'Graptopetalum amethystinum',
    family: '景天科',
    image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&h=400&fit=crop',
    currentStage: 'dormant',
    healthStatus: 'healthy',
    height: 8,
    plantedDate: '2024-01-10',
    daysSincePlanted: 127,
    environment: {
      balconyOrientation: '南向',
      position: '阳台窗台',
      potType: '粗陶盆'
    },
    careSchedule: {
      nextWatering: 5,
      lastWatered: '2024-05-09',
      nextFertilizing: 20,
      waterCycle: 7
    },
    stats: {
      totalWaterings: 18,
      totalFertilizings: 2,
      growthRate: '+0.8cm/月'
    }
  },
  {
    id: '4',
    name: '月季公主',
    variety: '果汁阳台',
    scientificName: 'Rosa hybrida',
    family: '蔷薇科',
    image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f79bce?w=400&h=400&fit=crop',
    currentStage: 'flowering',
    healthStatus: 'pest',
    height: 60,
    plantedDate: '2023-11-20',
    daysSincePlanted: 178,
    environment: {
      balconyOrientation: '南向',
      position: '阳台中央',
      potType: '加仑盆'
    },
    careSchedule: {
      nextWatering: 0,
      lastWatered: '2024-05-12',
      nextFertilizing: 3,
      waterCycle: 3
    },
    stats: {
      totalWaterings: 52,
      totalFertilizings: 12,
      growthRate: '+8.5cm/月'
    }
  },
  {
    id: '5',
    name: '番茄苗',
    variety: '千禧番茄',
    scientificName: 'Solanum lycopersicum',
    family: '茄科',
    image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400&h=400&fit=crop',
    currentStage: 'growth',
    healthStatus: 'healthy',
    height: 35,
    plantedDate: '2024-04-01',
    daysSincePlanted: 46,
    environment: {
      balconyOrientation: '南向',
      position: '种植箱',
      potType: '长方形种植箱'
    },
    careSchedule: {
      nextWatering: 1,
      lastWatered: '2024-05-14',
      nextFertilizing: 7,
      waterCycle: 2
    },
    stats: {
      totalWaterings: 18,
      totalFertilizings: 3,
      growthRate: '+12cm/月'
    }
  }
]

export const mockCareRecords = [
  { id: '1', plantId: '1', type: 'watering', date: '2024-05-14', time: '08:30', note: '早晨浇水，土壤微干' },
  { id: '2', plantId: '1', type: 'fertilizing', date: '2024-05-10', time: '10:00', note: '施用液体肥，稀释1000倍' },
  { id: '3', plantId: '2', type: 'watering', date: '2024-05-13', time: '19:00', note: '叶片有点蔫，及时补水' },
  { id: '4', plantId: '4', type: 'pest_control', date: '2024-05-12', time: '16:00', note: '发现蚜虫，喷洒吡虫啉' },
]

export const mockTodayTasks = [
  { id: '1', plantId: '1', plantName: '小薄荷', type: 'watering', icon: '💧', title: '浇水', overdue: true, dueTime: '今天' },
  { id: '2', plantId: '5', plantName: '番茄苗', type: 'watering', icon: '💧', title: '浇水', overdue: false, dueTime: '今天' },
  { id: '3', plantId: '4', plantName: '月季公主', type: 'watering', icon: '💧', title: '浇水（紧急）', overdue: true, dueTime: '逾期1天' },
  { id: '4', plantId: '4', plantName: '月季公主', type: 'check', icon: '🔍', title: '检查虫害', overdue: false, dueTime: '今天' },
  { id: '5', plantId: '2', plantName: '绿萝宝宝', type: 'watering', icon: '💧', title: '浇水', overdue: false, dueTime: '明天' },
  { id: '6', plantId: '1', plantName: '小薄荷', type: 'fertilizing', icon: '🌱', title: '施肥', overdue: false, dueTime: '5天后' },
]

export const mockPosts = [
  {
    id: '1',
    author: {
      id: 'u1',
      nickname: '阳台园丁',
      avatar: 'https://ui-avatars.com/api/?name=%E9%98%B3%E5%8F%B0%E5%9B%AD%E8%8D%AF&background=22c55e&color=fff&size=150&font-size=0.4&length=2',
      level: 'LV.5'
    },
    type: 'harvest_show',
    title: '历时18个月，我的蝴蝶兰终于开花啦！🦋✨',
    content: '从一颗小苗到今天第一次开花，中间经历了换盆、病虫害、差点放弃...但坚持下来真的太值得了！分享一下我的养护心得：\n\n1. 光照：散射光充足，避免暴晒\n2. 浇水：见干见湿，宁干勿湿\n3. 湿度：保持在60%左右\n4. 施肥：生长期每两周薄肥\n\n有问题欢迎评论区交流～',
    images: [
      'https://images.unsplash.com/photo-1566836610593-c85082ee64e3?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&h=600&fit=crop'
    ],
    tags: ['蝴蝶兰', '成就感', '坚持就有收获'],
    likes: 328,
    comments: 56,
    collects: 89,
    createdAt: '2小时前',
    isLiked: false,
    isCollected: false
  },
  {
    id: '2',
    author: {
      id: 'u2',
      nickname: '新手小白',
      avatar: 'https://ui-avatars.com/api/?name=%E6%96%B0%E6%89%8B%E5%B0%8F%E7%99%BD&background=3b82f6&color=fff&size=150&font-size=0.4&length=2',
      level: 'LV.2'
    },
    type: 'question',
    title: '求助！我的绿萝叶子发黄怎么办？😢',
    content: '养了两个月的绿萝，最近发现下面几片叶子开始发黄，新叶子倒是长得挺快的。这是缺水还是水太多了？还是缺肥？\n\n附上照片，请各位大神帮忙看看！感谢！🙏',
    images: [
      'https://images.unsplash.com/photo-1593482892290-7b028c970c08?w=600&h=600&fit=crop'
    ],
    tags: ['绿萝', '求救', '黄叶'],
    likes: 24,
    comments: 38,
    collects: 5,
    createdAt: '5小时前',
    isLiked: true,
    isCollected: false
  },
  {
    id: '3',
    author: {
      id: 'u3',
      nickname: '多肉控',
      avatar: 'https://ui-avatars.com/api/?name=%E5%A4%9A%E8%82%89%E6%8E%A7&background=a855f7&color=fff&size=150&font-size=0.4&length=2',
      level: 'LV.8'
    },
    type: 'experience_share',
    title: '多肉度夏攻略｜3年血泪经验总结☀️',
    content: '夏天到了，又到了多肉最难熬的季节！分享我这些年总结的度夏经验：\n\n【通风】最重要！比遮阴还重要！\n【控水】延长浇水周期，甚至可以断水1个月\n【遮阴】中午必须遮阴，早晚可以晒\n【禁肥】夏天绝对不要施肥！\n【观察】每天观察状态，发现问题及时处理\n\n希望大家的肉肉都能安全度夏！💪',
    images: [
      'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1518964556884-374cf80584e9?w=600&h=600&fit=crop'
    ],
    tags: ['多肉', '夏季养护', '干货分享'],
    likes: 512,
    comments: 93,
    collects: 234,
    createdAt: '昨天',
    isLiked: false,
    isCollected: true
  }
]

export const mockGroups = [
  {
    id: 'g1',
    name: '薄荷党',
    avatar: '🌿',
    description: '薄荷种植爱好者交流群，分享养护技巧和创意用法',
    memberCount: 128,
    category: 'variety',
    lastMessage: '大家好啊！我是新手，刚种了第一盆薄荷...',
    lastMessageTime: '10分钟前',
    unreadCount: 3
  },
  {
    id: 'g2',
    name: '上海阳台种植圈',
    avatar: '🏙️',
    description: '上海地区阳台种植爱好者，交流本地化种植经验',
    memberCount: 356,
    category: 'location',
    lastMessage: '这周梅雨天，大家注意控制浇水啊！',
    lastMessageTime: '30分钟前',
    unreadCount: 12
  },
  {
    id: 'g3',
    name: '新手村',
    avatar: '🌱',
    description: '种植新手互助群，大神带小白，共同成长！',
    memberCount: 892,
    category: 'interest',
    lastMessage: '有人知道这个是什么虫吗？',
    lastMessageTime: '刚刚',
    unreadCount: 0
  }
]

export const mockChatMessages = [
  { id: 'm1', senderId: 'u1', senderName: '小明', avatar: 'https://ui-avatars.com/api/?name=%E5%B0%8F%E6%98%8E&background=fb923c&color=fff&size=150&font-size=0.4&length=2', content: '大家好啊！我是新手，刚种了第一盆薄荷，求指点~', time: '10:03', isMine: false, type: 'text' },
  { id: 'm2', senderId: 'u2', senderName: '园丁老王', avatar: 'https://ui-avatars.com/api/?name=%E5%9B%AD%E8%8D%AF%E8%80%81%E7%8E%8B&background=ef4444&color=fff&size=150&font-size=0.4&length=2', content: '欢迎新人！薄荷很好养的，关键是别积水。你用的什么土？', time: '10:05', isMine: false, type: 'text' },
  { id: 'm3', senderId: 'me', senderName: '我', avatar: '', content: '买的成品营养土，盆底下垫了陶粒', time: '10:06', isMine: true, type: 'text' },
  { id: 'm4', senderId: 'u2', senderName: '园丁老王', avatar: 'https://ui-avatars.com/api/?name=%E5%9B%AD%E8%8D%AF%E8%80%81%E7%8E%8B&background=ef4444&color=fff&size=150&font-size=0.4&length=2', content: '👍 配置没问题！记住一点：见干见湿，别天天浇', time: '10:07', isMine: false, type: 'text' },
  { id: 'm5', senderId: 'system', senderName: '系统', avatar: '', content: '"小红" 加入了群聊', time: '10:02', isMine: false, type: 'system' },
]

export const mockAIConversations = [
  { role: 'assistant', content: '您好！我是您的AI植物管家 🤖\n\n我可以帮您：\n• 🌱 回答植物养护问题\n• 🔍 识别病虫害并给出解决方案\n• 📋 提供个性化养护建议\n• 💡 分享种植小技巧\n\n请问有什么可以帮助您的吗？', time: '刚刚' }
]

export const mockCareScheme = {
  plantName: '小薄荷',
  generatedAt: '2024-05-16',
  sections: [
    {
      type: 'watering',
      title: '💧 浇水指南',
      priority: 'high',
      items: ['频率：每2-3天', '方法：见干见湿，浇透为止', '时间：早晨或傍晚最佳', '检查法：手指插入土壤2cm，干燥则浇']
    },
    {
      type: 'fertilizing',
      title: '🌱 施肥建议',
      priority: 'medium',
      items: ['当前阶段：生长期（氮肥为主）', '频率：每2周施一次稀薄液肥', '配方：氮:磷:钾 = 3:1:2', '注意：薄肥勤施，休眠期停肥']
    },
    {
      type: 'lighting',
      title: '☀️ 光照需求',
      priority: 'medium',
      items: ['需求：散射光充足，每天4-6小时', '您的情况：南向阳台 ✓', '提示：夏季正午适当遮阴']
    },
    {
      type: 'temperature',
      title: '🌡️ 温度适宜性',
      priority: 'low',
      items: ['适宜温度：15-25°C', '耐寒性：一般，<5℃需保暖', '本周提醒：将有降温，注意防护']
    }
  ],
  aiSummary: '您的南向阳台光照条件非常适合薄荷生长。当前处于生长期，建议保持土壤微湿，每2周施一次薄肥。注意夏季高温时增加浇水频率并适当遮阴。'
}
