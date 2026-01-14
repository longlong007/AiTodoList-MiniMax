<template>
  <div :class="{ 'dark': isDark }" class="min-h-screen">
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <!-- 顶部导航栏 -->
      <header class="bg-white dark:bg-gray-800 shadow-sm transition-colors duration-300">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center gap-3">
              <span class="text-2xl">📝</span>
              <h1 class="text-xl font-bold text-gray-800 dark:text-white">
                智能TodoList
              </h1>
            </div>
            
            <div class="flex items-center gap-4">
              <!-- 主题切换按钮 -->
              <button 
                @click="toggleTheme"
                class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 
                       dark:hover:bg-gray-600 transition-colors duration-200"
                :title="isDark ? '切换到白天模式' : '切换到黑夜模式'"
              >
                <span v-if="isDark" class="text-2xl">☀️</span>
                <span v-else class="text-2xl">🌙</span>
              </button>
              
              <!-- 用户信息 -->
              <div v-if="authStore.isLoggedIn" class="flex items-center gap-3">
                <span class="text-gray-600 dark:text-gray-300">
                  {{ authStore.user?.phone }}
                </span>
                <button 
                  @click="authStore.logout"
                  class="text-sm text-red-600 hover:text-red-700"
                >
                  退出
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <!-- 主要内容 -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'

const authStore = useAuthStore()
const themeStore = useThemeStore()

const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  themeStore.setDarkMode(isDark.value)
}

onMounted(() => {
  // 恢复主题设置
  isDark.value = themeStore.isDark
})
</script>
