import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)

  const isLoggedIn = computed(() => !!token.value)

  async function login(phone) {
    try {
      const response = await api.post('/auth/login', { phone })
      const { token: newToken, user: newUser } = response.data
      
      token.value = newToken
      user.value = newUser
      localStorage.setItem('token', newToken)
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || '登录失败' 
      }
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  // 初始化时检查token
  async function init() {
    if (token.value) {
      try {
        const response = await api.get('/auth/profile')
        user.value = response.data
      } catch {
        logout()
      }
    }
  }

  return {
    user,
    token,
    isLoggedIn,
    login,
    logout,
    init
  }
})
