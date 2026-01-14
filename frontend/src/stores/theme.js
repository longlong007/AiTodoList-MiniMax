import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(localStorage.getItem('theme') === 'dark')

  function setDarkMode(value) {
    isDark.value = value
    localStorage.setItem('theme', value ? 'dark' : 'light')
  }

  function toggleTheme() {
    setDarkMode(!isDark.value)
  }

  // 同步到html标签
  watch(isDark, (value) => {
    if (value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, { immediate: true })

  return {
    isDark,
    setDarkMode,
    toggleTheme
  }
})
