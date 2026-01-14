import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref([])
  const loading = ref(false)
  const aiSuggestion = ref('')
  const aiLoading = ref(false)

  // 计算属性：按优先级排序的任务
  const sortedTasks = computed(() => {
    return [...tasks.value].sort((a, b) => {
      // 首先按重要性排序（A最高）
      const importanceOrder = { A: 0, B: 1, C: 2, D: 3 }
      const importanceDiff = importanceOrder[a.importance] - importanceOrder[b.importance]
      
      if (importanceDiff !== 0) return importanceDiff
      
      // 重要性相同，按紧急性排序（1最紧急）
      return a.urgency - b.urgency
    })
  })

  // 获取所有任务
  async function fetchTasks() {
    loading.value = true
    try {
      const response = await api.get('/tasks')
      tasks.value = response.data
    } catch (error) {
      console.error('获取任务失败:', error)
    } finally {
      loading.value = false
    }
  }

  // 添加任务
  async function addTask(task) {
    try {
      const response = await api.post('/tasks', task)
      tasks.value.push(response.data)
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || '添加任务失败' 
      }
    }
  }

  // 更新任务
  async function updateTask(id, updates) {
    try {
      const response = await api.put(`/tasks/${id}`, updates)
      const index = tasks.value.findIndex(t => t.id === id)
      if (index !== -1) {
        tasks.value[index] = response.data
      }
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || '更新任务失败' 
      }
    }
  }

  // 删除任务
  async function deleteTask(id) {
    try {
      await api.delete(`/tasks/${id}`)
      tasks.value = tasks.value.filter(t => t.id !== id)
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || '删除任务失败' 
      }
    }
  }

  // 切换任务完成状态
  async function toggleTask(id) {
    const task = tasks.value.find(t => t.id === id)
    if (task) {
      return await updateTask(id, { completed: !task.completed })
    }
    return { success: false, message: '任务不存在' }
  }

  // 获取AI建议
  async function getAISuggestion() {
    if (tasks.value.length === 0) {
      aiSuggestion.value = '暂无任务，请添加一些任务后再获取建议'
      return
    }

    aiLoading.value = true
    try {
      const response = await api.post('/ai/suggestion', {
        tasks: tasks.value
      })
      aiSuggestion.value = response.data.suggestion
    } catch (error) {
      aiSuggestion.value = '获取AI建议失败，请稍后重试'
    } finally {
      aiLoading.value = false
    }
  }

  return {
    tasks,
    loading,
    aiSuggestion,
    aiLoading,
    sortedTasks,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    getAISuggestion
  }
})
