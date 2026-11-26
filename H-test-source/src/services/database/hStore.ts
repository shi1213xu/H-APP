import { reactive } from 'vue'

const DBKEY = 'H_proto_v1'

export const H_ROLE_BEHAVIOR =
  '角色行为描写、神态、动作、姿势及心理活动等非语言内容，统一使用中文全角括号（）包裹；角色实际说出的对话不使用括号。行为与对话应明确区分，并符合当前角色的性格、身份、关系和剧情发展。'

export const DEF_CTX = {
  ctxMsgs: 30,
  maxTokens: 1024,
  temp: 0.8,
  topP: 1,
  anDepth: 4,
  wiScan: 6,
  wiBudget: 1500,
  stream: true
}

export const PROVIDERS = [
  { id: 'deepseek', name: 'DeepSeek', url: 'https://api.deepseek.com/v1', model: 'deepseek-chat' },
  { id: 'qwen', name: '阿里云百炼（通义千问）', url: 'https://dashscope.aliyuncs.com/compatible-mode/v1', model: 'qwen-plus' },
  { id: 'kimi', name: 'Kimi（月之暗面）', url: 'https://api.moonshot.cn/v1', model: '' },
  { id: 'zhipu', name: '智谱 GLM', url: 'https://open.bigmodel.cn/api/paas/v4', model: 'glm-4-flash' },
  { id: 'ark', name: '火山方舟（豆包）', url: 'https://ark.cn-beijing.volces.com/api/v3', model: '' },
  { id: 'sf', name: '硅基流动 SiliconFlow', url: 'https://api.siliconflow.cn/v1', model: 'Qwen/Qwen2.5-7B-Instruct' },
  { id: 'qf', name: '百度千帆', url: 'https://qianfan.baidubce.com/v2', model: '' },
  { id: 'or', name: 'OpenRouter', url: 'https://openrouter.ai/api/v1', model: '' },
  { id: 'oai', name: 'OpenAI', url: 'https://api.openai.com/v1', model: '' },
  { id: 'gem', name: 'Google Gemini', url: 'https://generativelanguage.googleapis.com/v1beta/openai', model: '' },
  { id: 'ollama', name: 'Ollama（本地）', url: 'http://localhost:11434/v1', model: '' },
  { id: 'lms', name: 'LM Studio（本地）', url: 'http://localhost:1234/v1', model: '' }
]

export interface HRole {
  id: string
  name: string
  avatar: string
  color?: string
  desc: string
  personality: string
  style: string
  note: string
  user: string
  book: string
  first: string
  behaviorLogic: string
  memory: string
  summary: string
  sumInject: boolean
  api: string
  model: string
  ctx?: number
}

export interface HBookEntry {
  name: string
  keys: string
  content: string
  always: boolean
  off?: boolean
}

export interface HBook {
  id: string
  name: string
  summary: string
  entries: HBookEntry[]
}

export interface HMessage {
  who: 'me' | 'ai'
  text: string
  ts: number
  err?: boolean
}

function makeSeed() {
  return {
    version: 1,

    roles: [
      {
        id: 'r1', name: '校园高冷女神', avatar: '女',
        desc: '成绩优秀、外表清冷的校园学生。',
        personality: '理性克制，不轻易表达情绪，但并非冷漠。',
        style: '简洁、克制，偶尔带有不易察觉的关心。',
        note: '保持人物言行一致，不要突然改变性格。',
        user: '同校学生。', book: 'b1'
      },
      {
        id: 'r2', name: '温柔学姐', avatar: '学',
        desc: '待人温和，善于倾听与鼓励。',
        personality: '耐心、细致，有自己的原则。',
        style: '自然温柔，表达清楚，不刻意说教。',
        note: '', user: '学弟/学妹。', book: 'b1'
      },
      {
        id: 'r3', name: '异世界公主', avatar: '公',
        desc: '来自魔法王国的年轻公主。',
        personality: '优雅、自尊心强，对未知事物充满好奇。',
        style: '礼貌而有分寸，带一点古典措辞。',
        note: '', user: '来自异乡的旅人。', book: 'b2'
      },
      {
        id: 'r4', name: '末世幸存者', avatar: '生',
        desc: '在灾后世界独自生存了一段时间。',
        personality: '警惕、务实，重视承诺与资源。',
        style: '短句为主，信息明确。',
        note: '', user: '临时同行者。', book: 'b2'
      }
    ],

    books: [
      {
        id: 'b1',
        name: '现代校园',
        summary: '以现代学校生活为背景，包含校园空间、课程安排、社团活动与日常社会关系。',
        entries: [
          { name: '校园环境', keys: '学校,校园,教学楼', content: '校园包含教学楼、图书馆、操场、食堂与宿舍区。', always: true },
          { name: '日常课程', keys: '课程,上课,考试', content: '课程安排遵循普通学校作息，具体时间以当前剧情为准。', always: false }
        ]
      },
      {
        id: 'b2',
        name: '星海幻想',
        summary: '一个包含多个王国、古老遗迹与魔法体系的幻想世界。',
        entries: [
          { name: '王国制度', keys: '王国,公主,王室', content: '王国由王室与贵族议会共同治理，地方领主负责辖区事务。', always: true },
          { name: '魔法基础', keys: '魔法,法术,魔力', content: '魔法需要消耗个人魔力，施法效果受知识、熟练度与环境影响。', always: false }
        ]
      }
    ],

    chats: {} as Record<string, HMessage[]>,
    apis: [] as any[],
    groups: [] as any[],
    ctx: { ...DEF_CTX },
    defApi: 'a1',
    toolApis: {} as Record<string, any>,
    tasks: [] as any[],
    arch: {} as Record<string, any>
  }
}

function normalize(data: any) {
  const seed = makeSeed()
  const state = data && Array.isArray(data.roles) && Array.isArray(data.books)
    ? data
    : seed

  state.chats ||= {}
  state.groups ||= []
  state.ctx = { ...DEF_CTX, ...(state.ctx || {}) }
  state.toolApis ||= {}
  state.tasks ||= []
  state.arch ||= {}
  state.defApi ||= 'a1'

  const oldApis = Array.isArray(state.apis) ? state.apis.slice(0, 10) : []
  const defaults = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10]

  state.apis = oldApis

  while (state.apis.length < 10) {
    const i = state.apis.length
    const provider = PROVIDERS[defaults[i]]
    state.apis.push({
      id: `a${i + 1}`,
      name: provider.name,
      purpose: `型号 ${String(i + 1).padStart(2, '0')}`,
      prov: provider.id,
      url: provider.url,
      key: '',
      model: provider.model
    })
  }

  state.apis.forEach((api: any, index: number) => {
    api.id = `a${index + 1}`
    api.purpose ||= `型号 ${String(index + 1).padStart(2, '0')}`
  })

  state.roles.forEach((role: any) => {
    role.api ||= ''
    role.model = ''
    role.behaviorLogic ||= H_ROLE_BEHAVIOR
    role.memory ||= ''
    role.summary ||= ''
    role.first ||= ''
    if (role.sumInject === undefined) role.sumInject = true
  })

  return state
}

function loadData() {
  try {
    const raw = localStorage.getItem(DBKEY)
    if (raw) return normalize(JSON.parse(raw))
  } catch (error) {
    console.error('H 数据读取失败', error)
  }
  return normalize(makeSeed())
}

const initialData = loadData()

export const hStore = reactive({
  data: initialData,

  save() {
    try {
      localStorage.setItem(DBKEY, JSON.stringify(this.data))
      return true
    } catch (error) {
      console.error('H 数据保存失败', error)
      return false
    }
  },

  createRole(name: string, desc = '') {
    const role: HRole = {
      id: 'r' + Date.now(),
      name,
      avatar: [...name][0] || '角',
      desc,
      personality: '',
      style: '',
      note: '',
      user: '',
      book: '',
      first: '',
      behaviorLogic: H_ROLE_BEHAVIOR,
      memory: '',
      summary: '',
      sumInject: true,
      api: '',
      model: ''
    }
    this.data.roles.push(role)
    this.save()
    return role
  },

  deleteRole(id: string) {
    this.data.roles = this.data.roles.filter((r: HRole) => r.id !== id)
    delete this.data.chats[id]
    this.save()
  },

  createBook(name: string) {
    const book: HBook = {
      id: 'b' + Date.now(),
      name,
      summary: '',
      entries: []
    }
    this.data.books.push(book)
    this.save()
    return book
  },

  appendMessage(roleId: string, who: 'me' | 'ai', text: string) {
    this.data.chats[roleId] ||= []
    this.data.chats[roleId].push({
      who,
      text,
      ts: Date.now()
    })
    this.save()
  }
})

hStore.save()
