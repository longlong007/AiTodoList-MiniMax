<template>
  <div class="card">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
        <span>🤖</span>
        AI智能建议
      </h3>
      <button 
        @click="$emit('get-suggestion')"
        :disabled="loading"
        class="btn-primary text-sm"
      >
        {{ loading ? '生成中...' : '获取建议' }}
      </button>
    </div>
    
    <div v-if="suggestion" 
         class="p-4 bg-primary-50 dark:bg-primary-900/30 rounded-lg 
                border border-primary-200 dark:border-primary-800"
    >
      <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
        {{ suggestion }}
      </p>
    </div>
    
    <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
      <span class="text-4xl mb-2 block">💡</span>
      <p>点击上方按钮获取AI智能建议</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  suggestion: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['get-suggestion'])
</script>
