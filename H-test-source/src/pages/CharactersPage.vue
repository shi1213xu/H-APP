<template>
  <MainLayout title="联系人" subtitle="角色、世界书与关系管理">
    <div class="page-intro">
      <h1>联系人</h1>
      <p>管理角色卡与故事资料。</p>
    </div>

    <div class="segmented">
      <button :class="{ selected: tab === '角色' }" @click="tab = '角色'">角色</button>
      <button :class="{ selected: tab === '世界书' }" @click="tab = '世界书'">世界书</button>
      <button :class="{ selected: tab === '群聊' }" @click="tab = '群聊'">群聊</button>
    </div>

    <template v-if="tab === '角色'">
      <div class="section-heading">
        <h2>我的角色</h2>
        <span class="muted">{{ hStore.data.roles.length }} 个角色</span>
      </div>

      <div class="character-list">
        <article v-for="item in hStore.data.roles" :key="item.id" class="character-card" @click="openDetail(item.id)">
          <div class="avatar character-avatar">{{ item.avatar || item.name.slice(0, 1) }}</div>
          <div class="character-info">
            <b>{{ item.name }}</b>
            <p>{{ item.desc || '暂无简介' }}</p>
            <small>{{ item.api ? '独立 API：' + item.api : '使用全局默认 API' }}</small>
          </div>
          <button class="small-action" @click.stop="startChat(item.id)">聊天</button>
        </article>
      </div>

      <button class="wide-add" @click="showCreate = !showCreate">＋ 创建角色</button>

      <div v-if="showCreate" class="create-panel">
        <h3>创建角色</h3>
        <input v-model="newName" placeholder="角色名称" maxlength="30">
        <input v-model="newDescription" placeholder="角色简介">
        <div class="button-row">
          <button class="secondary-button" @click="showCreate = false">取消</button>
          <button class="primary-button" @click="createCharacter">创建</button>
        </div>
      </div>
    </template>

    <template v-else-if="tab === '世界书'">
      <div class="section-heading">
        <h2>世界书</h2>
        <span class="muted">{{ hStore.data.books.length }} 本</span>
      </div>

      <article v-for="book in hStore.data.books" :key="book.id" class="setting-card">
        <span class="setting-icon lavender">▤</span>
        <div class="setting-info">
          <b>{{ book.name }}</b>
          <small>{{ book.entries.length }} 个条目 · {{ book.entries.filter((e: any) => e.always).length }} 个常驻</small>
        </div>
        <span class="arrow">›</span>
      </article>

      <button class="wide-add" @click="createBook">＋ 新建世界书</button>
    </template>

    <template v-else>
      <div class="empty-state">
        <div class="empty-icon">♧</div>
        <b>暂时没有群聊</b>
        <p>群聊成员调度将在后续阶段接入。</p>
      </div>
    </template>

    <p v-if="notice" class="notice">{{ notice }}</p>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '../components/MainLayout.vue'
import { hStore } from '../services/database/hStore'

const router = useRouter()
const tab = ref('角色')
const showCreate = ref(false)
const newName = ref('')
const newDescription = ref('')
const notice = ref('')

function openDetail(id: string) {
  router.push(`/character/${id}`)
}

function startChat(id: string) {
  localStorage.setItem('h_current_character', id)
  router.push('/chat')
}

function createCharacter() {
  const name = newName.value.trim()
  if (!name) {
    notice.value = '请先填写角色名称。'
    return
  }
  const role = hStore.createRole(name, newDescription.value.trim())
  newName.value = ''
  newDescription.value = ''
  showCreate.value = false
  router.push(`/character/${role.id}`)
}

function createBook() {
  const name = window.prompt('请输入世界书名称')
  if (!name?.trim()) return
  hStore.createBook(name.trim())
  notice.value = '世界书已创建并保存到本机。'
}
</script>
