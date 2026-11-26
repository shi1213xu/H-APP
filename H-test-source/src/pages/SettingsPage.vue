<template>
  <MainLayout title="我的" subtitle="个人设置与数据管理">
    <section class="profile-panel">
      <div class="profile-avatar">H</div>
      <div><h2>我的空间</h2><p>管理 API、外观与应用数据</p></div>
      <span class="arrow">›</span>
    </section>

    <section class="settings-section">
      <div class="section-heading"><h2>模型与接口</h2></div>
      <button v-for="item in apiItems" :key="item.name" class="setting-card" @click="openItem(item)">
        <span class="setting-icon lavender">{{ item.icon }}</span>
        <div class="setting-info"><b>{{ item.name }}</b><small>{{ item.description }}</small></div>
        <span class="arrow">›</span>
      </button>
    </section>

    <section class="settings-section">
      <div class="section-heading"><h2>数据与外观</h2></div>
      <button v-for="item in systemItems" :key="item.name" class="setting-card" @click="openItem(item)">
        <span class="setting-icon peach">{{ item.icon }}</span>
        <div class="setting-info"><b>{{ item.name }}</b><small>{{ item.description }}</small></div>
        <span class="arrow">›</span>
      </button>
    </section>

    <section class="settings-section">
      <div class="section-heading"><h2>应用</h2></div>
      <div class="setting-card">
        <span class="setting-icon blue">ⓘ</span>
        <div class="setting-info"><b>关于 H</b><small>应用版本与项目信息</small></div>
        <span class="muted">H-test</span>
      </div>
    </section>

    <div v-if="activeItem" class="modal-mask" @click.self="activeItem = null">
      <div class="modal-card">
        <button class="modal-close" @click="activeItem = null">×</button>
        <div class="modal-symbol">{{ activeItem.icon }}</div>
        <h2>{{ activeItem.name }}</h2>
        <p>{{ activeItem.description }}</p>
        <p class="muted">此页面将在后续阶段接入实际配置和数据管理逻辑。</p>
        <button class="primary-button full-button" @click="activeItem = null">返回</button>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '../components/MainLayout.vue'

type Item = { name: string; icon: string; description: string }
const activeItem = ref<Item | null>(null)
const router = useRouter()
const apiItems: Item[] = [
  { name: 'API 接口中心', icon: '⌘', description: '管理型号 01 至型号 10 的独立接口配置' },
  { name: '模型管理', icon: '◇', description: '管理已配置接口的模型' },
  { name: '调用记录', icon: '▤', description: '查看模型调用情况与记录' },
  { name: '上下文记忆', icon: '◈', description: '管理上下文长度与记忆注入' }
]
const systemItems: Item[] = [
  { name: '外观设置', icon: '◐', description: '调整主题、背景与显示效果' },
  { name: '数据备份', icon: '⇧', description: '导入、导出和恢复应用数据' },
  { name: '文件管理', icon: '▧', description: '管理角色头像、背景和附件' },
  { name: '应用设置', icon: '⚙', description: '管理应用基础设置' }
]
function openItem(item: Item) {
  if (item.name === 'API 接口中心') {
    router.push('/api')
    return
  }
  activeItem.value = item
}
</script>
