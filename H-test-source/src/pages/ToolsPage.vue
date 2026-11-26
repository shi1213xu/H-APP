<template>
  <MainLayout title="AI 工具箱" subtitle="扩展你的创作能力">
    <div class="page-intro">
      <h1>AI 工具箱</h1>
      <p>不同工具可以配置独立的模型接口。</p>
    </div>

    <section class="tool-section">
      <h2>AI 能力</h2>
      <div class="tool-grid">
        <button v-for="tool in aiTools" :key="tool.name" class="tool-card" @click="selectTool(tool)">
          <span class="tool-icon" :class="tool.color">{{ tool.icon }}</span>
          <b>{{ tool.name }}</b>
          <small>{{ tool.description }}</small>
        </button>
      </div>
    </section>

    <section class="tool-section">
      <h2>角色与资料</h2>
      <div class="tool-menu">
        <button v-for="tool in dataTools" :key="tool.name" class="setting-card" @click="selectTool(tool)">
          <span class="setting-icon lavender">{{ tool.icon }}</span>
          <div class="setting-info"><b>{{ tool.name }}</b><small>{{ tool.description }}</small></div>
          <span class="arrow">›</span>
        </button>
      </div>
    </section>

    <section class="tool-section">
      <h2>任务中心</h2>
      <div class="setting-card">
        <span class="setting-icon peach">▤</span>
        <div class="setting-info"><b>任务中心</b><small>查看工具任务与执行状态</small></div>
        <span class="status-tag">暂无任务</span>
      </div>
    </section>

    <div v-if="selected" class="modal-mask" @click.self="selected = null">
      <div class="modal-card">
        <button class="modal-close" @click="selected = null">×</button>
        <div class="modal-symbol">{{ selected.icon }}</div>
        <h2>{{ selected.name }}</h2>
        <p>{{ selected.description }}</p>
        <p class="muted">此功能入口已建立，具体模型调用将在后续模块中接入。</p>
        <button class="primary-button full-button" @click="selected = null">知道了</button>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MainLayout from '../components/MainLayout.vue'

type Tool = { name: string; icon: string; description: string; color?: string }
const selected = ref<Tool | null>(null)
const aiTools: Tool[] = [
  { name: 'AI 助手', icon: '✦', description: '通用 AI 对话与辅助', color: 'lavender' },
  { name: '文本翻译', icon: '文', description: '多语言文本翻译', color: 'peach' },
  { name: '图片生成', icon: '▧', description: '根据提示词生成图片', color: 'blue' },
  { name: '视频生成', icon: '▷', description: 'AI 视频生成接口', color: 'pink' },
  { name: '语音合成', icon: '♫', description: '文本转语音 TTS', color: 'peach' },
  { name: '语音识别', icon: '◉', description: '语音转文字 ASR', color: 'blue' },
  { name: '实时语音', icon: '⌁', description: '实时语音交互', color: 'pink' }
]
const dataTools: Tool[] = [
  { name: '角色卡导入', icon: '♙', description: '导入角色卡文件或文本' },
  { name: '世界书导入', icon: '▤', description: '导入世界书与设定资料' }
]
function selectTool(tool: Tool) {
  selected.value = tool
}
</script>
