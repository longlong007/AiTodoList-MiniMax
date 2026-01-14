<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <span class="text-6xl">📝</span>
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
          智能TodoList
        </h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          登录您的账户开始管理任务
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="phone" class="sr-only">手机号码</label>
            <input 
              id="phone"
              v-model="phone"
              type="tel"
              required
              class="input-field rounded-t-lg"
              placeholder="请输入手机号码"
            />
          </div>
        </div>

        <div v-if="error" class="text-red-600 text-sm text-center">
          {{ error }}
        </div>

        <div>
          <button 
            type="submit"
            :disabled="loading"
            class="btn-primary w-full flex justify-center py-3 text-lg"
          >
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </div>
        
        <p class="text-center text-xs text-gray-500 dark:text-gray-400">
          这是一个演示应用，输入任意手机号码即可登录
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const phone = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  if (!phone.value || phone.value.length < 11) {
    error.value = '请输入有效的手机号码'
    return
  }

  loading.value = true
  error.value = ''

  const result = await authStore.login(phone.value)
  
  if (result.success) {
    router.push('/')
  } else {
    error.value = result.message
  }
  
  loading.value = false
}
</script>
