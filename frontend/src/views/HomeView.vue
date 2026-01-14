<template>
  <div class="space-y-6">
    <!-- AI建议区域 -->
    <AISuggestion 
      :suggestion="tasksStore.aiSuggestion"
      :loading="tasksStore.aiLoading"
      @get-suggestion="handleGetSuggestion"
    />
    
    <!-- 任务表单 -->
    <TaskForm 
      :task="editingTask"
      :loading="formLoading"
      @submit="handleTaskSubmit"
      @cancel="handleCancelEdit"
    />
    
    <!-- 任务列表 -->
    <div class="card">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
          任务列表 
          <span class="text-sm font-normal text-gray-500">
            ({{ tasksStore.sortedTasks.length }}个任务)
          </span>
        </h3>
        
        <!-- 排序说明 -->
        <div class="text-sm text-gray-500 dark:text-gray-400">
          按重要性（A-D）和紧急性（1-4）自动排序
        </div>
      </div>
      
      <!-- 加载状态 -->
      <div v-if="tasksStore.loading" class="text-center py-8">
        <span class="text-2xl">⏳</span>
        <p class="text-gray-500 mt-2">加载任务中...</p>
      </div>
      
      <!-- 空状态 -->
      <div v-else-if="tasksStore.sortedTasks.length === 0" class="text-center py-8">
        <span class="text-4xl">📋</span>
        <p class="text-gray-500 dark:text-gray-400 mt-2">暂无任务</p>
        <p class="text-sm text-gray-400 dark:text-gray-500">
          请在上方添加您的第一个任务
        </p>
      </div>
      
      <!-- 任务列表 -->
      <div v-else class="space-y-3">
        <TaskItem 
          v-for="task in tasksStore.sortedTasks"
          :key="task.id"
          :task="task"
          @toggle="handleToggleTask"
          @edit="handleEditTask"
          @delete="handleDeleteTask"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import TaskItem from '@/components/TaskItem.vue'
import TaskForm from '@/components/TaskForm.vue'
import AISuggestion from '@/components/AISuggestion.vue'

const tasksStore = useTasksStore()

const editingTask = ref(null)
const formLoading = ref(false)

onMounted(async () => {
  await tasksStore.fetchTasks()
})

const handleTaskSubmit = async (taskData) => {
  formLoading.value = true
  
  if (taskData.id) {
    // 编辑模式
    await tasksStore.updateTask(taskData.id, {
      title: taskData.title,
      description: taskData.description,
      importance: taskData.importance,
      urgency: taskData.urgency
    })
  } else {
    // 添加模式
    await tasksStore.addTask({
      title: taskData.title,
      description: taskData.description,
      importance: taskData.importance,
      urgency: taskData.urgency
    })
  }
  
  formLoading.value = false
  editingTask.value = null
}

const handleCancelEdit = () => {
  editingTask.value = null
}

const handleEditTask = (task) => {
  editingTask.value = task
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleToggleTask = async (id) => {
  await tasksStore.toggleTask(id)
}

const handleDeleteTask = async (id) => {
  if (confirm('确定要删除这个任务吗？')) {
    await tasksStore.deleteTask(id)
  }
}

const handleGetSuggestion = async () => {
  await tasksStore.getAISuggestion()
}
</script>
