import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: () => import('../pages/HomePage.vue') },
    { path: '/chat', component: () => import('../pages/ChatPage.vue') },
    { path: '/characters', component: () => import('../pages/CharactersPage.vue') },
    { path: '/character/:id', component: () => import('../pages/CharacterDetailPage.vue') },
    { path: '/api', component: () => import('../pages/ApiPage.vue') },
    { path: '/agent', component: () => import('../pages/AgentPage.vue') },
    { path: '/settings', component: () => import('../pages/SettingsPage.vue') },
    { path: '/tools', component: () => import('../pages/ToolsPage.vue') }
  ]
})

export default router
