<template>
  <div class="task-item group" :class="{ 'opacity-50': task.completed }">
    <!-- 完成复选框 -->
    <input 
      type="checkbox"
      :checked="task.completed"
      @change="$emit('toggle', task.id)"
      class="w-5 h-5 rounded border-gray-300 text-primary-600 
             focus:ring-primary-500 cursor-pointer"
    />
    
    <!-- 任务内容 -->
    <div class="flex-1 min-w-0">
      <p 
        class="text-gray-800 dark:text-white font-medium truncate"
        :class="{ 'line-through text-gray-400': task.completed }"
      >
        {{ task.title }}
      </p>
      <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
        {{ task.description }}
      </p>
    </div>
    
    <!-- 优先级标签 -->
    <div class="flex items-center gap-2">
      <span class="badge badge-importance-{{ task.importance }}">
        重要:{{ task.importance }}
      </span>
      <span class="badge badge-urgency-{{ task.urgency }}">
        紧急:{{ task.urgency }}
      </span>
    </div>
    
    <!-- 操作按钮 -->
    <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <button 
        @click="$emit('edit', task)"
        class="p-1.5 text-gray-500 hover:text-primary-600 
               hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        title="编辑"
      >
        ✏️
      </button>
      <button 
        @click="$emit('delete', task.id)"
        class="p-1.5 text-gray-500 hover:text-red-600 
               hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        title="删除"
      >
        🗑️
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  task: {
    type: Object,
    required: true
  }
})

defineEmits(['toggle', 'edit', 'delete'])
</script>
