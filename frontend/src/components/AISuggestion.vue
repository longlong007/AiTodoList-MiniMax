<template>
  <div class="card" id="ai-suggestion-card">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
        <span>🤖</span>
        AI智能建议
      </h3>
      <div class="flex gap-2">
        <button 
          v-if="suggestion"
          @click="downloadPDF"
          :disabled="pdfLoading"
          class="btn-secondary text-sm flex items-center gap-1"
          title="下载为PDF"
        >
          <span v-if="!pdfLoading">📄</span>
          <span v-else>⏳</span>
          {{ pdfLoading ? '生成中...' : '下载PDF' }}
        </button>
        <button 
          @click="$emit('get-suggestion')"
          :disabled="loading"
          class="btn-primary text-sm"
        >
          {{ loading ? '生成中...' : '获取建议' }}
        </button>
      </div>
    </div>
    
    <!-- PDF报告容器（用于生成PDF） -->
    <div v-if="suggestion" id="pdf-content" class="hidden">
      <div class="pdf-header">
        <h1 class="pdf-title">🤖 AI智能任务分析报告</h1>
        <p class="pdf-date">生成时间：{{ currentDate }}</p>
      </div>
      <div class="pdf-body">
        <pre class="pdf-text">{{ suggestion }}</pre>
      </div>
      <div class="pdf-footer">
        <p>— 智能任务管理系统 —</p>
      </div>
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
import { ref, computed } from 'vue'
import html2pdf from 'html2pdf.js'

const props = defineProps({
  suggestion: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['get-suggestion'])
const pdfLoading = ref(false)

// 获取当前日期时间
const currentDate = computed(() => {
  const now = new Date()
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  }
  return now.toLocaleDateString('zh-CN', options)
})

// 下载PDF
const downloadPDF = async () => {
  if (!props.suggestion) return
  
  pdfLoading.value = true
  
  try {
    // 先显示PDF内容（临时）
    const pdfContent = document.getElementById('pdf-content')
    if (!pdfContent) {
      throw new Error('PDF内容元素未找到')
    }
    
    // 移除hidden类并添加到body末尾（临时）
    pdfContent.classList.remove('hidden')
    document.body.appendChild(pdfContent)
    
    // 配置pdf选项
    const options = {
      margin: [10, 10, 10, 10],
      filename: `AI任务分析报告_${new Date().toISOString().slice(0, 10)}.pdf`,
      image: { 
        type: 'jpeg', 
        quality: 0.98 
      },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: false
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait' 
      },
      pagebreak: { 
        mode: ['avoid-all', 'css', 'legacy'] 
      }
    }
    
    // 生成PDF
    await html2pdf().set(options).from(pdfContent).save()
    
    // 移除临时添加的元素
    document.body.removeChild(pdfContent)
    
  } catch (error) {
    console.error('PDF生成失败:', error)
    alert('PDF生成失败，请稍后重试')
  } finally {
    pdfLoading.value = false
  }
}
</script>

<style scoped>
/* PDF内容样式（打印时生效） */
:deep(#pdf-content) {
  position: fixed;
  left: -9999px;
  top: 0;
  width: 210mm;  /* A4宽度 */
  min-height: 297mm;  /* A4高度 */
  background: white;
  padding: 20mm;
  font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
  font-size: 14px;
  line-height: 1.8;
  color: #333;
  z-index: -1;
}

:deep(.pdf-header) {
  text-align: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #667eea;
  margin-bottom: 20px;
}

:deep(.pdf-title) {
  font-size: 24px;
  font-weight: bold;
  color: #1a202c;
  margin-bottom: 8px;
}

:deep(.pdf-date) {
  font-size: 12px;
  color: #718096;
}

:deep(.pdf-body) {
  padding: 20px 0;
}

:deep(.pdf-text) {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.8;
  color: #333;
  background: none;
  border: none;
  padding: 0;
  margin: 0;
}

:deep(.pdf-footer) {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
  font-size: 11px;
  color: #a0aec0;
}
</style>
