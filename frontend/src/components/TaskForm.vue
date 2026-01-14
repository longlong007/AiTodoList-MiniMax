<template>
  <form @submit.prevent="handleSubmit" class="card mb-6">
    <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">
      {{ isEditing ? '编辑任务' : '添加新任务' }}
    </h3>
    
    <div class="space-y-4">
      <!-- 任务标题 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          任务标题 *
        </label>
        <input 
          v-model="form.title"
          type="text"
          required
          placeholder="请输入任务标题"
          class="input-field"
        />
      </div>
      
      <!-- 任务描述 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          任务描述
        </label>
        <textarea 
          v-model="form.description"
          rows="2"
          placeholder="请输入任务描述（可选）"
          class="input-field resize-none"
        ></textarea>
      </div>
      
      <!-- 优先级选择 -->
      <div class="grid grid-cols-2 gap-4">
        <!-- 重要性 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            重要性 *
          </label>
          <select v-model="form.importance" required class="input-field">
            <option value="A">A - 非常重要</option>
            <option value="B">B - 重要</option>
            <option value="C">C - 一般</option>
            <option value="D">D - 不重要</option>
          </select>
        </div>
        
        <!-- 紧急性 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            紧急性 *
          </label>
          <select v-model="form.urgency" required class="input-field">
            <option :value="1">1 - 非常紧急</option>
            <option :value="2">2 - 紧急</option>
            <option :value="3">3 - 一般</option>
            <option :value="4">4 - 不紧急</option>
          </select>
        </div>
      </div>
      
      <!-- 按钮组 -->
      <div class="flex justify-end gap-3 pt-2">
        <button 
          v-if="isEditing"
          type="button"
          @click="cancelEdit"
          class="btn-secondary"
        >
          取消
        </button>
        <button 
          type="submit"
          :disabled="loading"
          class="btn-primary"
        >
          {{ loading ? '保存中...' : (isEditing ? '更新任务' : '添加任务') }}
        </button>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  task: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])

const isEditing = ref(false)
const form = ref({
  title: '',
  description: '',
  importance: 'B',
  urgency: 3
})

// 监听任务变化（编辑模式）
watch(() => props.task, (newTask) => {
  if (newTask) {
    isEditing.value = true
    form.value = {
      title: newTask.title,
      description: newTask.description || '',
      importance: newTask.importance,
      urgency: newTask.urgency
    }
  }
}, { immediate: true })

const handleSubmit = () => {
  emit('submit', { ...form.value, id: props.task?.id })
}

const cancelEdit = () => {
  isEditing.value = false
  form.value = {
    title: '',
    description: '',
    importance: 'B',
    urgency: 3
  }
  emit('cancel')
}
</script>
