<template>
  <div class="agent-page">
    <header class="agent-header">
      <button @click="router.back()">‹</button>
      <b>Agent 工作区</b>
      <span>H</span>
    </header>

    <main class="agent-content">
      <div class="agent-symbol">✧</div>
      <div class="eyebrow">H AGENT SPACE</div>
      <h1>任务与智能执行</h1>
      <p class="description">
        Agent 工作区用于规划任务、组织步骤，并逐步接入工具调用与执行能力。
      </p>

      <section class="status-card">
        <div class="status-title">
          <b>工作区状态</b>
          <span>建设中</span>
        </div>
        <p>当前已恢复独立入口，任务规划、工具调用和自动执行能力尚未接入。</p>
      </section>

      <section class="function-card">
        <h3>计划接入的能力</h3>
        <div class="function-row">
          <span>◇</span>
          <div><b>任务规划</b><small>将复杂目标拆解为可执行步骤</small></div>
        </div>
        <div class="function-row">
          <span>⌘</span>
          <div><b>工具调用</b><small>根据任务调用已配置的工具</small></div>
        </div>
        <div class="function-row">
          <span>↗</span>
          <div><b>执行与追踪</b><small>记录执行过程和任务结果</small></div>
        </div>
      </section>

      <button class="back-button" @click="router.push('/')">返回聊天首页</button>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<style scoped>
* { box-sizing:border-box; }
.agent-page { min-height:100vh; background:#f7f5fb; color:#302b3a; }
.agent-header { height:58px; display:flex; align-items:center; justify-content:space-between; padding:0 17px; background:#fff; border-bottom:1px solid #eeeaf4; }
.agent-header button { border:0; background:none; color:#7255ae; font-size:27px; }
.agent-header b { font-size:15px; }
.agent-header span { color:#8468c0; font-weight:800; }
.agent-content { max-width:600px; margin:auto; padding:38px 19px; }
.agent-symbol { width:62px; height:62px; border-radius:21px; display:grid; place-items:center; background:#ebe4fb; color:#8063bf; font-size:32px; margin-bottom:22px; }
.eyebrow { color:#9279c0; font-size:10px; letter-spacing:2px; font-weight:700; }
h1 { font-size:25px; margin:10px 0; }
.description { color:#928b9c; font-size:13px; line-height:1.8; }
.status-card,.function-card { background:#fff; border:1px solid #eeeaf4; border-radius:15px; padding:17px; margin-top:20px; }
.status-title { display:flex; justify-content:space-between; align-items:center; font-size:14px; }
.status-title span { color:#9274c5; background:#f0eafa; border-radius:20px; padding:5px 9px; font-size:10px; }
.status-card p { font-size:12px; line-height:1.7; color:#9991a5; margin:13px 0 0; }
.function-card h3 { font-size:14px; margin:0 0 15px; }
.function-row { display:flex; align-items:center; gap:13px; padding:12px 0; border-top:1px solid #f1eef5; }
.function-row > span { width:34px; height:34px; display:grid; place-items:center; background:#f0ebfa; color:#8063bf; border-radius:11px; }
.function-row b,.function-row small { display:block; }
.function-row b { font-size:12px; }
.function-row small { color:#a39bad; font-size:10px; margin-top:5px; }
.back-button { width:100%; border:0; border-radius:12px; background:#8064c4; color:#fff; padding:13px; margin-top:23px; }
</style>
