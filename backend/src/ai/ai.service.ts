import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

interface Task {
  id: string;
  title: string;
  description?: string;
  importance: string;
  urgency: number;
  completed: boolean;
}

@Injectable()
export class AiService {
  private readonly zhipuApiKey: string;
  private readonly zhipuApiUrl = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

  constructor() {
    this.zhipuApiKey = process.env.ZHIPU_API_KEY || '';
  }

  async getSuggestion(tasks: Task[]): Promise<string> {
    // 参数验证
    if (!tasks || tasks.length === 0) {
      console.log('[AI] No tasks provided, returning empty message');
      return '📋 暂无任务，请添加一些任务后再获取AI建议。';
    }

    console.log('[AI] getSuggestion called with', tasks.length, 'tasks');
    console.log('[AI] ZHIPU_API_KEY configured:', !!this.zhipuApiKey);

    if (!this.zhipuApiKey) {
      console.log('[AI] No API key, using mock suggestion');
      return this.getMockSuggestion(tasks);
    }

    try {
      console.log('[AI] Calling Zhipu API...');
      const response = await axios.post(
        this.zhipuApiUrl,
        {
          model: 'glm-4-flash',
          messages: [
            {
              role: 'system',
              content: `你是一个智能任务管理助手。请根据用户当前的任务列表，提供合理的建议，包括：
1. 优先级排序建议
2. 时间分配建议
3. 任务合并建议
4. 注意事项
请用简洁、友好的语气回答，控制在200字以内。`
            },
            {
              role: 'user',
              content: `请分析以下任务并给出建议：\n${tasks.map(t => 
                `- [${t.completed ? '✓' : ' '}] ${t.title} (重要:${t.importance}, 紧急:${t.urgency}) ${t.description ? `- ${t.description}` : ''}`
              ).join('\n')}`
            }
          ],
          temperature: 0.7,
          max_tokens: 500,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.zhipuApiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000, // 10秒超时
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('智谱AI调用失败:', error.response?.data || error.message);
      console.log('[AI] API failed, falling back to mock suggestion');
      return this.getMockSuggestion(tasks);
    }
  }

  private getMockSuggestion(tasks: Task[]): string {
    // 参数验证
    if (!tasks || tasks.length === 0) {
      console.log('[AI Mock] No tasks, returning empty message');
      return '📋 暂无任务，请添加一些任务后再获取AI建议。';
    }

    console.log('[AI Mock] Generating suggestion for', tasks.length, 'tasks');

    const incompleteTasks = tasks.filter(t => !t.completed);
    
    if (incompleteTasks.length === 0) {
      return '🎉 恭喜！所有任务都已完成！您可以休息一下，或者添加新的任务来继续提升自己。';
    }

    // 按优先级排序
    const sorted = [...incompleteTasks].sort((a, b) => {
      const importanceOrder = { A: 0, B: 1, C: 2, D: 3 };
      const impDiff = importanceOrder[a.importance] - importanceOrder[b.importance];
      if (impDiff !== 0) return impDiff;
      return a.urgency - b.urgency;
    });

    const topTask = sorted[0];
    const urgentTasks = sorted.filter(t => t.urgency <= 2);
    
    let suggestion = '📋 任务分析建议：\n\n';
    
    suggestion += `🎯 **建议优先处理**：${topTask.title}\n`;
    suggestion += `   重要程度：${topTask.importance}级，紧急程度：${topTask.urgency}级\n`;
    if (topTask.description) {
      suggestion += `   说明：${topTask.description}\n`;
    }
    
    if (urgentTasks.length > 1) {
      suggestion += `\n⚠️ **紧急任务**：您有${urgentTasks.length}个紧急任务需要关注\n`;
    }
    
    suggestion += `\n💡 **温馨提示**：`;
    if (sorted.length > 3) {
      suggestion += '任务较多，建议分批完成，每次专注2-3个任务。';
    } else {
      suggestion += '保持专注，合理安排时间，祝您高效完成任务！';
    }

    return suggestion;
  }
}
