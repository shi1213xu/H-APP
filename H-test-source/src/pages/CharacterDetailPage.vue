<template>
  <div class="detail-page">
    <header class="topbar">
      <button @click="router.back()">‹</button>
      <b>角色详细设置</b>
      <button class="save" @click="save">保存</button>
    </header>

    <main v-if="role" class="content">
      <div class="profile">
        <div class="avatar">{{ role.avatar || role.name.slice(0, 1) }}</div>
        <div>
          <h2>{{ role.name }}</h2>
          <p>角色资料与行为设定</p>
        </div>
      </div>

      <section class="panel">
        <h3>基础信息</h3>
        <label>角色名称<input v-model="role.name"></label>
        <label>角色头像文字<input v-model="role.avatar" maxlength="4"></label>
        <label>角色简介<textarea v-model="role.desc" rows="3"></textarea></label>
        <label>性格设定<textarea v-model="role.personality" rows="5"></textarea></label>
        <label>语言风格<textarea v-model="role.style" rows="4"></textarea></label>
      </section>

      <section class="panel">
        <h3>聊天设定</h3>
        <label>开场白<textarea v-model="role.first" rows="4"></textarea></label>
        <label>用户资料<textarea v-model="role.user" rows="4"></textarea></label>
        <label>作者注释<textarea v-model="role.note" rows="4"></textarea></label>
        <label>行为规则<textarea v-model="role.behaviorLogic" rows="5"></textarea></label>
      </section>

      <section class="panel">
        <h3>世界书与 API</h3>
        <label>绑定世界书
          <select v-model="role.book">
            <option value="">不绑定</option>
            <option v-for="book in hStore.data.books" :key="book.id" :value="book.id">
              {{ book.name }}
            </option>
          </select>
        </label>

        <label>绑定 API 型号
          <select v-model="role.api">
            <option value="">跟随全局默认（型号 {{ defaultApiNumber }}）</option>
            <option v-for="(api, index) in hStore.data.apis" :key="api.id" :value="api.id">
              型号 {{ String(Number(index) + 1).padStart(2, '0') }}
            </option>
          </select>
        </label>
        <p class="hint">角色可以独立绑定型号，不绑定时使用全局默认型号。</p>
      </section>

      <section class="panel">
        <h3>长期记忆与剧情</h3>
        <label>长期记忆<textarea v-model="role.memory" rows="5"></textarea></label>
        <label>剧情总结<textarea v-model="role.summary" rows="5"></textarea></label>
        <label class="switch-row">
          <span>注入剧情总结</span>
          <input v-model="role.sumInject" type="checkbox">
        </label>
      </section>

      <button class="delete-button" @click="deleteRole">删除此角色</button>
      <p v-if="notice" class="notice">{{ notice }}</p>
    </main>

    <main v-else class="empty">角色不存在或已被删除。</main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { hStore } from '../services/database/hStore'
import type { HRole } from '../services/database/hStore'

const route = useRoute()
const router = useRouter()
const notice = ref('')

const defaultApiNumber = computed(() => {
  const index = hStore.data.apis.findIndex(
    (api: { id: string }) => api.id === hStore.data.defApi
  )
  return String(index >= 0 ? index + 1 : 1).padStart(2, '0')
})

const role = computed(() =>
  hStore.data.roles.find((item: HRole) => item.id === String(route.params.id))
)

function save() {
  if (!role.value) return
  hStore.save()
  notice.value = '角色设定已保存。'
}

function deleteRole() {
  if (!role.value) return
  if (!window.confirm(`确定删除角色「${role.value.name}」及其聊天记录吗？`)) return
  hStore.deleteRole(role.value.id)
  router.replace('/characters')
}
</script>

<style scoped>
* { box-sizing: border-box; }
.detail-page { min-height: 100vh; background: #f7f5fb; color: #302b3a; padding-bottom: 35px; }
.topbar { height: 58px; display:flex; align-items:center; justify-content:space-between; padding:0 16px; background:#fff; border-bottom:1px solid #eeeaf4; position:sticky; top:0; z-index:2; }
.topbar button { border:0; background:none; font-size:25px; color:#65558e; }
.topbar .save { font-size:14px; color:#7959c7; font-weight:600; }
.content { max-width:620px; margin:auto; padding:18px 15px; }
.profile { display:flex; align-items:center; gap:14px; padding:12px 4px 22px; }
.avatar { width:58px; height:58px; border-radius:19px; background:#e9e1ff; display:grid; place-items:center; color:#7154b5; font-size:23px; }
.profile h2 { margin:0 0 5px; font-size:20px; }
.profile p,.hint { color:#9991a5; font-size:12px; margin:0; }
.panel { background:white; border:1px solid #eeeaf4; border-radius:16px; padding:17px; margin-bottom:13px; }
.panel h3 { font-size:15px; margin:0 0 16px; }
label { display:block; font-size:13px; color:#665e72; margin:13px 0; }
input:not([type=checkbox]),textarea,select { display:block; width:100%; margin-top:7px; border:1px solid #e9e4f0; border-radius:10px; background:#fcfbfe; padding:11px; color:#302b3a; font:inherit; font-size:14px; outline:none; }
textarea { resize:vertical; line-height:1.6; }
input:focus,textarea:focus,select:focus { border-color:#a58bdc; }
.switch-row { display:flex; align-items:center; justify-content:space-between; }
.switch-row input { width:19px; height:19px; accent-color:#896bd0; }
.delete-button { width:100%; border:1px solid #f0d8dc; background:#fff7f8; color:#bd5968; padding:13px; border-radius:12px; }
.notice { color:#7255b4; text-align:center; font-size:13px; }
.empty { padding:40px; text-align:center; color:#999; }
</style>
