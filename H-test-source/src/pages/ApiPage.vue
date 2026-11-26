<template>
  <div class="api-page">
    <header class="topbar">
      <button class="back" @click="goBack">‹</button>
      <b>{{ currentApi ? `型号 ${apiNumber(currentApi.id)}` : 'API 接口中心' }}</b>
      <button v-if="currentApi" class="save" @click="save">保存</button>
      <span v-else class="topbar-space"></span>
    </header>

    <main class="content">
      <!-- 十型号列表 -->
      <template v-if="!currentApi">
        <section class="intro">
          <div class="eyebrow">MODEL MANAGEMENT</div>
          <h2>接口配置</h2>
          <p>管理十个独立的 API 型号。每个型号都可以使用不同的服务商和模型。</p>
        </section>

        <section class="default-card">
          <div class="default-title">
            <span class="default-icon">★</span>
            <div>
              <b>全局默认型号</b>
              <small>角色没有单独绑定时，将使用此型号</small>
            </div>
          </div>
          <select v-model="hStore.data.defApi" @change="saveDefault">
            <option v-for="(api, index) in hStore.data.apis"
              :key="api.id" :value="api.id">
              型号 {{ String(Number(index) + 1).padStart(2, '0') }}
            </option>
          </select>
        </section>

        <div class="section-title">
          <b>API 型号</b>
          <span>固定 10 个配置槽位</span>
        </div>

        <section class="model-list">
          <button
            v-for="(api, index) in hStore.data.apis"
            :key="api.id"
            class="model-card"
            @click="openModel(api.id)"
          >
            <span class="number">{{ String(Number(index) + 1).padStart(2, '0') }}</span>
            <span class="model-info">
              <b>型号 {{ String(Number(index) + 1).padStart(2, '0') }}</b>
              <small>{{ api.key && api.model ? '已填写接口配置' : '尚未完成配置' }}</small>
            </span>
            <span v-if="hStore.data.defApi === api.id" class="default-tag">默认</span>
            <span class="arrow">›</span>
          </button>
        </section>

        <p class="security-note">API Key 保存在本机浏览器存储中。请勿在公共设备上填写个人密钥。</p>
        <p v-if="notice" class="notice">{{ notice }}</p>
      </template>

      <!-- 单型号配置 -->
      <template v-else>
        <section class="intro">
          <div class="eyebrow">API CONFIGURATION</div>
          <h2>型号 {{ apiNumber(currentApi.id) }}</h2>
          <p>此处的配置只作用于当前型号。绑定该型号的角色将共同使用这里的接口。</p>
        </section>

        <section class="config-card">
          <div class="config-heading">
            <span class="number large">{{ apiNumber(currentApi.id) }}</span>
            <div>
              <b>接口参数</b>
              <small>独立配置服务商与模型</small>
            </div>
          </div>

          <label>服务商
            <select v-model="currentApi.prov" @change="changeProvider(currentApi)">
              <option v-for="provider in PROVIDERS" :key="provider.id" :value="provider.id">
                {{ provider.name }}
              </option>
            </select>
          </label>

          <label>接口地址
            <input v-model="currentApi.url" placeholder="https://api.example.com/v1">
          </label>

          <label>API Key
            <input
              v-model="currentApi.key"
              type="password"
              autocomplete="off"
              placeholder="填写服务商提供的密钥"
            >
          </label>

          <label>大模型名称
            <input
              v-model="currentApi.model"
              :list="'models-' + currentApi.id"
              placeholder="填写模型 ID，例如 deepseek-chat"
            >
            <datalist :id="'models-' + currentApi.id">
              <option v-for="model in discovered[currentApi.id] || []"
                :key="model" :value="model"></option>
            </datalist>
          </label>

          <div class="button-row">
            <button class="secondary" @click="getModels(currentApi)">获取模型列表</button>
            <button class="primary" @click="testApi(currentApi)">测试接口</button>
          </div>

          <p v-if="status[currentApi.id]" class="status">{{ status[currentApi.id] }}</p>
        </section>

        <section class="config-tip">
          <b>配置说明</b>
          <p>1. 选择服务商后，会自动填入该服务商的默认地址和推荐模型。</p>
          <p>2. 请检查接口地址、填写 API Key，并确认模型名称。</p>
          <p>3. 点击右上角保存，配置才会写入本机数据。</p>
          <p>4. 角色绑定此型号后，将统一使用这里的配置。</p>
        </section>

        <button class="return-button" @click="goBack">返回型号列表</button>
      </template>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { hStore, PROVIDERS } from '../services/database/hStore'

const router = useRouter()
const route = useRoute()
const notice = ref('')
const status = reactive<Record<string, string>>({})
const discovered = reactive<Record<string, string[]>>({})

const currentApi = computed(() => {
  const id = String(route.query.model || '')
  if (!/^a([1-9]|10)$/.test(id)) return null
  return hStore.data.apis.find((api: any) => api.id === id) || null
})

function apiNumber(id: string) {
  const index = hStore.data.apis.findIndex((api: any) => api.id === id)
  return String(index >= 0 ? index + 1 : 1).padStart(2, '0')
}

function openModel(id: string) {
  notice.value = ''
  router.push({ path: '/api', query: { model: id } })
}

function goBack() {
  if (currentApi.value) {
    router.push('/api')
  } else {
    router.push('/settings')
  }
}

function changeProvider(api: any) {
  const provider = PROVIDERS.find(item => item.id === api.prov)
  if (!provider) return
  api.name = provider.name
  api.url = provider.url
  api.model = provider.model
}

function save() {
  const ok = hStore.save()
  status[currentApi.value?.id || ''] = ok
    ? '配置已保存。'
    : '保存失败，请检查浏览器存储空间。'
}

function saveDefault() {
  const ok = hStore.save()
  notice.value = ok ? '全局默认型号已更新。' : '保存失败。'
}

async function getModels(api: any) {
  if (!api.url || !api.key) {
    status[api.id] = '请先填写接口地址和 API Key。'
    return
  }

  status[api.id] = '正在获取模型列表……'
  try {
    const base = api.url.replace(/\/+$/, '')
    const response = await fetch(`${base}/models`, {
      headers: { Authorization: `Bearer ${api.key}` }
    })

    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const result = await response.json()
    const models = Array.isArray(result.data)
      ? result.data.map((item: any) => item.id).filter(Boolean)
      : []

    discovered[api.id] = models
    status[api.id] = models.length
      ? `获取成功，共 ${models.length} 个模型。点击模型名称即可填写。`
      : '接口有响应，但没有返回标准模型列表。'
  } catch (error) {
    status[api.id] = `获取失败：${error instanceof Error ? error.message : '网络错误'}。也可能是服务商跨域限制。`
  }
}

async function testApi(api: any) {
  if (!api.url || !api.key || !api.model) {
    status[api.id] = '请填写接口地址、API Key 和模型名称。'
    return
  }

  status[api.id] = '正在测试接口……'
  try {
    const base = api.url.replace(/\/+$/, '')
    const response = await fetch(`${base}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${api.key}`
      },
      body: JSON.stringify({
        model: api.model,
        messages: [{ role: 'user', content: '请只回复：连接成功' }],
        max_tokens: 20,
        stream: false
      })
    })

    if (!response.ok) {
      const detail = await response.text()
      throw new Error(`HTTP ${response.status} ${detail.slice(0, 180)}`)
    }

    const result = await response.json()
    status[api.id] = result.choices?.length
      ? '连接成功，模型已返回回复。'
      : '接口返回成功，但响应格式不符合预期。'
  } catch (error) {
    status[api.id] = `测试失败：${error instanceof Error ? error.message : '网络错误'}。请检查地址、密钥、模型和跨域设置。`
  }
}
</script>

<style scoped>
* { box-sizing: border-box; }
.api-page { min-height:100vh; background:#f7f5fb; color:#302b3a; padding-bottom:35px; }
.topbar { height:58px; display:flex; align-items:center; justify-content:space-between; padding:0 16px; background:#fff; border-bottom:1px solid #eeeaf4; position:sticky; top:0; z-index:2; }
.topbar button { border:0; background:none; color:#65558e; font-size:25px; }
.topbar b { font-size:16px; }
.topbar .save { font-size:14px; font-weight:600; color:#7959c7; }
.topbar-space { width:35px; }
.content { max-width:620px; padding:20px 15px; margin:auto; }
.intro { margin:5px 2px 20px; }
.eyebrow { color:#9b87c7; font-size:10px; letter-spacing:2px; font-weight:700; }
.intro h2 { font-size:23px; margin:8px 0; }
.intro p { font-size:12px; color:#9991a5; line-height:1.7; margin:0; }
.default-card,.config-card { background:#fff; border:1px solid #eeeaf4; border-radius:16px; padding:16px; margin:15px 0 22px; }
.default-title,.config-heading { display:flex; align-items:center; gap:12px; }
.default-icon { width:36px; height:36px; display:grid; place-items:center; background:#f0ebfa; color:#7959c7; border-radius:12px; }
.default-title b,.default-title small,.config-heading b,.config-heading small { display:block; }
.default-title b,.config-heading b { font-size:14px; }
.default-title small,.config-heading small { color:#9991a5; font-size:11px; margin-top:5px; }
.default-card select,.config-card input,.config-card select { display:block; width:100%; padding:12px; margin:13px 0 0; border:1px solid #e9e4f0; border-radius:10px; background:#fcfbfe; color:#302b3a; font-size:13px; }
.section-title { display:flex; justify-content:space-between; align-items:center; margin:22px 3px 11px; font-size:14px; }
.section-title span { color:#9991a5; font-size:11px; }
.model-list { display:grid; gap:10px; }
.model-card { width:100%; display:flex; align-items:center; gap:12px; padding:13px; border:1px solid #eeeaf4; border-radius:14px; background:#fff; text-align:left; }
.number { width:42px; height:42px; flex-shrink:0; display:grid; place-items:center; border-radius:13px; background:#eee8fc; color:#7959c7; font-weight:700; font-size:14px; }
.number.large { width:46px; height:46px; }
.model-info { flex:1; min-width:0; }
.model-info b,.model-info small { display:block; }
.model-info b { font-size:14px; }
.model-info small { color:#9991a5; font-size:11px; margin-top:5px; }
.default-tag { color:#7959c7; background:#f0ebfa; border-radius:20px; padding:4px 8px; font-size:10px; }
.arrow { color:#8f7db4; font-size:23px; }
.config-heading { margin-bottom:20px; }
.config-card label { display:block; margin-top:16px; color:#665e72; font-size:12px; }
.config-card input,.config-card select { margin-top:8px; }
.button-row { display:flex; gap:9px; margin-top:18px; }
.button-row button { flex:1; padding:12px 5px; border:0; border-radius:10px; font-size:12px; }
.primary { background:#8064c4; color:white; }
.secondary { background:#f0ebfa; color:#7155ae; }
.status,.notice { color:#765bb1; font-size:12px; line-height:1.7; overflow-wrap:anywhere; }
.config-tip { background:#f0ecf8; border-radius:13px; padding:14px; color:#766b8b; font-size:11px; line-height:1.8; }
.config-tip b { font-size:12px; }
.config-tip p { margin:5px 0; }
.return-button { width:100%; margin-top:16px; padding:13px; border:1px solid #e8e1f1; border-radius:11px; background:white; color:#765bb1; font-size:13px; }
.security-note { margin:20px 3px; color:#9991a5; font-size:11px; line-height:1.7; }
</style>
