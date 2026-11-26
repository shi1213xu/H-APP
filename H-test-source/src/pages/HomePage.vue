<template>
  <MainLayout title="聊天" subtitle="角色、故事与智能助手，都在这里。">
    <div class="home-page">
      <section class="greeting">
        <div class="eyebrow">YOUR AI SPACE</div>
        <h1>今天想和谁聊聊？</h1>
        <p>角色、故事与智能助手，都在这里。</p>
      </section>

      <div class="search-box">
        <span>⌕</span>
        <input v-model="keyword" placeholder="搜索联系人或聊天记录">
      </div>

      <div class="section-head">
        <h2>常用联系人</h2>
        <span>{{ pinnedRoles.length }} 位角色</span>
      </div>

      <div v-if="pinnedRoles.length" class="pinned-strip">
        <button
          v-for="role in pinnedRoles"
          :key="role.id"
          class="pinned-item"
          @click="openChat(role.id)"
        >
          <div class="avatar">{{ role.avatar || role.name.slice(0, 1) }}</div>
          <b>{{ role.name }}</b>
        </button>
      </div>
      <div v-else class="empty-small">还没有角色，先创建一张角色卡吧。</div>

      <div class="section-head recent-heading">
        <h2>最近聊天</h2>
        <span>本机保存</span>
      </div>

      <div v-if="recentChats.length" class="chat-list">
        <button
          v-for="item in recentChats"
          :key="item.role.id"
          class="chat-item"
          @click="openChat(item.role.id)"
        >
          <div class="avatar">{{ item.role.avatar || item.role.name.slice(0, 1) }}</div>
          <div class="chat-info">
            <b>{{ item.role.name }}</b>
            <p>{{ item.last?.text || '开始聊天' }}</p>
          </div>
          <span class="chat-count">{{ item.count }} 条</span>
        </button>
      </div>
      <div v-else class="empty-card">
        <div class="empty-symbol">✧</div>
        <b>还没有最近聊天</b>
        <p>选择一位角色，开始第一段对话。</p>
      </div>

      <div class="section-head shortcut-heading">
        <h2>快捷入口</h2>
        <span>快速开始</span>
      </div>

      <div class="shortcut-grid">
        <button class="shortcut-card agent-card" @click="router.push('/agent')">
          <div class="shortcut-icon">✧</div>
          <b>Agent 工作区</b>
          <small>规划任务与执行能力（逐步接入）</small>
          <span class="shortcut-arrow">›</span>
        </button>

        <button class="shortcut-card tools-card" @click="router.push('/tools')">
          <div class="shortcut-icon">⌘</div>
          <b>AI 工具箱</b>
          <small>翻译、图片、语音与视频工具</small>
          <span class="shortcut-arrow">›</span>
        </button>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '../components/MainLayout.vue'
import { hStore } from '../services/database/hStore'
import type { HRole, HMessage } from '../services/database/hStore'

const router = useRouter()
const keyword = ref('')

const roles = computed(() => hStore.data.roles as HRole[])

const pinnedRoles = computed(() => {
  const key = keyword.value.trim().toLowerCase()
  return roles.value
    .filter(role => !key || role.name.toLowerCase().includes(key))
    .slice(0, 4)
})

const recentChats = computed(() => {
  const chats = hStore.data.chats as Record<string, HMessage[]>
  const key = keyword.value.trim().toLowerCase()

  return roles.value
    .map(role => {
      const messages = chats?.[role.id] || []
      return {
        role,
        count: messages.length,
        last: messages[messages.length - 1]
      }
    })
    .filter(item => item.count > 0)
    .filter(item => !key ||
      item.role.name.toLowerCase().includes(key) ||
      (item.last?.text || '').toLowerCase().includes(key)
    )
    .sort((a, b) => Number(b.last?.ts || 0) - Number(a.last?.ts || 0))
    .slice(0, 8)
})

function openChat(id: string) {
  localStorage.setItem('h_current_character', id)
  router.push('/chat')
}
</script>

<style scoped>
* { box-sizing: border-box; }
.home-page { padding: 8px 0 30px; color: #302b3a; }
.greeting { padding: 12px 4px 20px; }
.eyebrow { color: #9079c2; font-size: 10px; letter-spacing: 2px; font-weight: 700; }
.greeting h1 { font-size: 23px; margin: 9px 0 7px; }
.greeting p { color: #9991a5; font-size: 12px; margin: 0; }
.search-box { display:flex; align-items:center; gap:9px; background:#fff; border:1px solid #eeeaf4; border-radius:12px; padding:0 13px; height:43px; margin-bottom:23px; color:#927eb9; }
.search-box span { font-size:23px; }
.search-box input { flex:1; min-width:0; border:0; outline:0; background:transparent; font-size:12px; color:#302b3a; }
.section-head { display:flex; align-items:center; justify-content:space-between; margin:20px 3px 12px; }
.section-head h2 { font-size:15px; margin:0; }
.section-head span { font-size:11px; color:#a39bad; }
.pinned-strip { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:9px; }
.pinned-item { display:flex; flex-direction:column; align-items:center; gap:8px; padding:12px 3px; border:1px solid #eeeaf4; border-radius:13px; background:#fff; min-width:0; }
.avatar { width:43px; height:43px; border-radius:15px; background:#eee8fc; display:grid; place-items:center; color:#7559b5; font-size:17px; flex-shrink:0; }
.pinned-item b { max-width:100%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:11px; font-weight:500; }
.empty-small { padding:18px; text-align:center; color:#aaa2b2; background:#fff; border-radius:12px; font-size:12px; }
.recent-heading { margin-top:25px; }
.chat-list { background:#fff; border:1px solid #eeeaf4; border-radius:14px; overflow:hidden; }
.chat-item { width:100%; display:flex; align-items:center; gap:11px; padding:12px; border:0; border-bottom:1px solid #f1eef5; background:#fff; text-align:left; }
.chat-item:last-child { border-bottom:0; }
.chat-info { flex:1; min-width:0; }
.chat-info b { font-size:13px; }
.chat-info p { overflow:hidden; white-space:nowrap; text-overflow:ellipsis; color:#9991a5; font-size:11px; margin:5px 0 0; }
.chat-count { font-size:10px; color:#aaa2b2; }
.empty-card { padding:23px 12px; background:#fff; border:1px solid #eeeaf4; border-radius:14px; text-align:center; }
.empty-symbol { font-size:25px; color:#9479c9; margin-bottom:8px; }
.empty-card b { font-size:13px; }
.empty-card p { font-size:11px; color:#a39bad; margin:7px 0 0; }
.shortcut-heading { margin-top:25px; }
.shortcut-grid { display:grid; grid-template-columns:1fr 1fr; gap:11px; }
.shortcut-card { position:relative; min-width:0; text-align:left; padding:15px 12px; border:1px solid #eeeaf4; border-radius:15px; background:#fff; color:#302b3a; }
.shortcut-icon { width:35px; height:35px; display:grid; place-items:center; border-radius:12px; background:#eee8fc; color:#7959c7; font-size:19px; margin-bottom:12px; }
.tools-card .shortcut-icon { background:#e9efff; color:#627fc0; }
.shortcut-card b { display:block; font-size:13px; margin-bottom:7px; }
.shortcut-card small { display:block; color:#9991a5; font-size:10px; line-height:1.6; padding-right:5px; }
.shortcut-arrow { position:absolute; right:12px; top:17px; color:#a99abe; font-size:20px; }
</style>
