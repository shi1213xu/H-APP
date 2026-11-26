<template>
  <div class="app-shell">
    <header class="topbar">
      <div class="brand">
        <span class="brand-mark">H</span>
        <div>
          <strong>{{ title }}</strong>
          <small>{{ subtitle }}</small>
        </div>
      </div>
      <button class="icon-button" @click="$emit('action')">···</button>
    </header>

    <main class="main-content">
      <slot />
    </main>

    <nav class="bottom-nav">
      <router-link to="/" class="nav-item" :class="{ active: route.path === '/' }">
        <span class="nav-icon">◷</span>
        <span>聊天</span>
      </router-link>
      <router-link to="/characters" class="nav-item" :class="{ active: route.path === '/characters' }">
        <span class="nav-icon">♙</span>
        <span>联系人</span>
      </router-link>
      <router-link to="/tools" class="nav-item" :class="{ active: route.path === '/tools' }">
        <span class="nav-icon">✧</span>
        <span>工具箱</span>
      </router-link>
      <router-link to="/settings" class="nav-item" :class="{ active: route.path === '/settings' }">
        <span class="nav-icon">☻</span>
        <span>我的</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

defineProps({
  title: { type: String, default: 'H' },
  subtitle: { type: String, default: '智能角色与聊天空间' }
})

defineEmits(['action'])
const route = useRoute()
</script>
