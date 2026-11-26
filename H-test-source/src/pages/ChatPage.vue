<template>
  <div class="chat-screen">
    <header class="chat-topbar">
      <button class="back-button" @click="router.back()">‹</button>
      <div class="chat-heading">
        <b>{{ character?.name || '角色聊天' }}</b>
        <small>独立聊天记录 · 本机保存</small>
      </div>
      <button class="icon-button" @click="showDetails = !showDetails">···</button>
    </header>

    <div v-if="showDetails" class="chat-details">
      <b>聊天设置</b>
      <p>当前角色的聊天记录独立保存。AI API 接入将在下一阶段完成。</p>
    </div>

    <main class="message-area" ref="messageArea">
      <div class="chat-date">新的故事</div>
      <div v-for="message in messages" :key="message.id" class="message-line" :class="message.role">
        <div v-if="message.role === 'assistant'" class="message-avatar">
          {{ character?.avatar || character?.name?.slice(0, 1) || '角' }}
        </div>
        <div class="message-bubble">{{ message.text }}</div>
      </div>
    </main>

    <footer class="composer">
      <div class="composer-tools">
        <button @click="notice = '附件功能将在后续接入。'">＋</button>
        <button @click="notice = '更多聊天工具将在后续接入。'">▧</button>
      </div>
      <div class="input-row">
        <textarea
          v-model="draft"
          rows="1"
          placeholder="输入消息..."
          @keydown.enter.exact.prevent="sendMessage"
        ></textarea>
        <button class="send-button" :disabled="!draft.trim()" @click="sendMessage">↑</button>
      </div>
      <p v-if="notice" class="composer-notice">{{ notice }}</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { useRouter } from 'vue-router'
import { hStore } from '../services/database/hStore'
import type { HRole, HMessage } from '../services/database/hStore'

const router = useRouter()
const characterId = localStorage.getItem('h_current_character') || 'r1'
const draft = ref('')
const showDetails = ref(false)
const notice = ref('')
const messageArea = ref<HTMLElement | null>(null)

const character = computed(() =>
  hStore.data.roles.find((role: HRole) => role.id === characterId)
)

const messages = computed(() =>
  (hStore.data.chats[characterId] || []).map((message: HMessage, index: number) => ({
    id: `${message.ts}-${index}`,
    role: message.who === 'me' ? 'user' : 'assistant',
    text: message.text
  }))
)

function sendMessage() {
  const text = draft.value.trim()
  if (!text) return

  hStore.appendMessage(characterId, 'me', text)
  draft.value = ''
  notice.value = '消息已保存到本机；AI 回复功能尚未接入。'

  nextTick(() => {
    if (messageArea.value) {
      messageArea.value.scrollTop = messageArea.value.scrollHeight
    }
  })
}
</script>
