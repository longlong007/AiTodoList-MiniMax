# API接口文档

本文档描述智能待办事项管理系统的所有API接口规范，包括认证模块、任务管理模块和AI推荐模块的接口定义、请求参数和响应格式。

## 1. API概述

### 1.1 接口规范

- **基础路径**：`/api`
- **认证方式**：JWT Bearer Token
- **请求格式**：JSON
- **响应格式**：JSON
- **字符编码**：UTF-8

### 1.2 通用响应格式

```json
{
  "code": 200,
  "message": "操作成功",
  "data": { }
}
```

### 1.3 HTTP状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未认证或Token无效 |
| 403 | 无权限访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

### 1.4 错误响应格式

```json
{
  "code": 400,
  "message": "请求参数错误",
  "errors": {
    "phone": "手机号格式不正确"
  }
}
```

## 2. 认证模块 (Auth)

### 2.1 用户登录

用户登录接口，支持新用户自动注册。

**接口信息**：

| 项目 | 说明 |
|------|------|
| URL | `/auth/login` |
| Method | `POST` |
| Content-Type | `application/json` |

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| phone | String | 是 | 手机号（11位数字，以1开头） |

**请求示例**：

```bash
curl -X POST /api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone": "13800138000"}'
```

**成功响应**：

```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "phone": "13800138000",
      "name": null,
      "createdAt": "2026-01-14T10:00:00.000Z",
      "updatedAt": "2026-01-14T10:00:00.000Z"
    }
  }
}
```

**错误响应**：

```json
{
  "code": 400,
  "message": "请求参数错误",
  "errors": {
    "phone": "手机号格式不正确"
  }
}
```

### 2.2 获取用户信息

获取当前登录用户的详细信息。

**接口信息**：

| 项目 | 说明 |
|------|------|
| URL | `/auth/profile` |
| Method | `GET` |
| 需要认证 | 是 |

**请求头**：

```
Authorization: Bearer <your-jwt-token>
```

**响应示例**：

```json
{
  "code": 200,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "phone": "13800138000",
    "name": "张三",
    "createdAt": "2026-01-14T10:00:00.000Z",
    "updatedAt": "2026-01-14T10:00:00.000Z"
  }
}
```

**错误响应**：

```json
{
  "code": 401,
  "message": "未登录或Token已过期"
}
```

## 3. 任务管理模块 (Tasks)

### 3.1 获取任务列表

获取当前用户的所有任务，支持排序。

**接口信息**：

| 项目 | 说明 |
|------|------|
| URL | `/tasks` |
| Method | `GET` |
| 需要认证 | 是 |

**请求头**：

```
Authorization: Bearer <your-jwt-token>
```

**查询参数**：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| completed | Boolean | 否 | 按完成状态筛选 |

**响应示例**：

```json
{
  "code": 200,
  "data": [
    {
      "id": "task-uuid-001",
      "title": "完成项目文档",
      "description": "撰写技术架构文档并提交",
      "importance": "A",
      "urgency": 2,
      "completed": false,
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "createdAt": "2026-01-14T10:00:00.000Z",
      "updatedAt": "2026-01-14T10:30:00.000Z"
    },
    {
      "id": "task-uuid-002",
      "title": "代码审查",
      "description": "审查新功能的代码实现",
      "importance": "B",
      "urgency": 3,
      "completed": true,
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "createdAt": "2026-01-13T15:00:00.000Z",
      "updatedAt": "2026-01-14T09:00:00.000Z"
    }
  ]
}
```

### 3.2 获取单个任务

根据任务ID获取任务详情。

**接口信息**：

| 项目 | 说明 |
|------|------|
| URL | `/tasks/:id` |
| Method | `GET` |
| 需要认证 | 是 |

**URL参数**：

| 参数名 | 类型 | 说明 |
|--------|------|------|
| id | UUID | 任务ID |

**响应示例**：

```json
{
  "code": 200,
  "data": {
    "id": "task-uuid-001",
    "title": "完成项目文档",
    "description": "撰写技术架构文档并提交",
    "importance": "A",
    "urgency": 2,
    "completed": false,
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "createdAt": "2026-01-14T10:00:00.000Z",
    "updatedAt": "2026-01-14T10:30:00.000Z"
  }
}
```

**错误响应**：

```json
{
  "code": 404,
  "message": "任务不存在"
}
```

### 3.3 创建任务

创建一个新的待办事项。

**接口信息**：

| 项目 | 说明 |
|------|------|
| URL | `/tasks` |
| Method | `POST` |
| 需要认证 | 是 |
| Content-Type | `application/json` |

**请求参数**：

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| title | String | 是 | - | 任务标题（1-255字符） |
| description | String | 否 | null | 任务描述 |
| importance | Enum | 否 | 'B' | 重要性 (A/B/C/D) |
| urgency | Enum | 否 | 3 | 紧急程度 (1/2/3/4) |

**请求示例**：

```bash
curl -X POST /api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "title": "完成项目文档",
    "description": "撰写技术架构文档并提交",
    "importance": "A",
    "urgency": 2
  }'
```

**成功响应**：

```json
{
  "code": 201,
  "message": "创建成功",
  "data": {
    "id": "task-uuid-001",
    "title": "完成项目文档",
    "description": "撰写技术架构文档并提交",
    "importance": "A",
    "urgency": 2,
    "completed": false,
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "createdAt": "2026-01-14T10:00:00.000Z",
    "updatedAt": "2026-01-14T10:00:00.000Z"
  }
}
```

**错误响应**：

```json
{
  "code": 400,
  "message": "请求参数错误",
  "errors": {
    "title": "任务标题不能为空"
  }
}
```

### 3.4 更新任务

更新任务的标题、描述、重要程度、紧急程度或完成状态。

**接口信息**：

| 项目 | 说明 |
|------|------|
| URL | `/tasks/:id` |
| Method | `PUT` |
| 需要认证 | 是 |
| Content-Type | `application/json` |

**URL参数**：

| 参数名 | 类型 | 说明 |
|--------|------|------|
| id | UUID | 任务ID |

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| title | String | 否 | 任务标题 |
| description | String | 否 | 任务描述 |
| importance | Enum | 否 | 重要性 (A/B/C/D) |
| urgency | Enum | 否 | 紧急程度 (1/2/3/4) |
| completed | Boolean | 否 | 完成状态 |

**请求示例**：

```bash
curl -X PUT /api/tasks/task-uuid-001 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "title": "更新项目文档",
    "completed": true
  }'
```

**成功响应**：

```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": "task-uuid-001",
    "title": "更新项目文档",
    "description": "撰写技术架构文档并提交",
    "importance": "A",
    "urgency": 2,
    "completed": true,
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "createdAt": "2026-01-14T10:00:00.000Z",
    "updatedAt": "2026-01-14T11:00:00.000Z"
  }
}
```

### 3.5 删除任务

删除指定的待办事项。

**接口信息**：

| 项目 | 说明 |
|------|------|
| URL | `/tasks/:id` |
| Method | `DELETE` |
| 需要认证 | 是 |

**URL参数**：

| 参数名 | 类型 | 说明 |
|--------|------|------|
| id | UUID | 任务ID |

**请求示例**：

```bash
curl -X DELETE /api/tasks/task-uuid-001 \
  -H "Authorization: Bearer <your-jwt-token>"
```

**响应**：

```
HTTP/1.1 204 No Content
```

**错误响应**：

```json
{
  "code": 404,
  "message": "任务不存在"
}
```

### 3.6 切换任务完成状态

快速切换任务的完成状态（已完成 ↔ 未完成）。

**接口信息**：

| 项目 | 说明 |
|------|------|
| URL | `/tasks/:id/toggle` |
| Method | `POST` |
| 需要认证 | 是 |

**URL参数**：

| 参数名 | 类型 | 说明 |
|--------|------|------|
| id | UUID | 任务ID |

**请求示例**：

```bash
curl -X POST /api/tasks/task-uuid-001/toggle \
  -H "Authorization: Bearer <your-jwt-token>"
```

**成功响应**：

```json
{
  "code": 200,
  "message": "状态切换成功",
  "data": {
    "id": "task-uuid-001",
    "completed": true,
    "updatedAt": "2026-01-14T11:00:00.000Z"
  }
}
```

## 4. AI智能推荐模块 (AI)

### 4.1 获取任务排序建议

根据任务的重要性和紧急程度，AI智能推荐任务执行顺序。

**接口信息**：

| 项目 | 说明 |
|------|------|
| URL | `/ai/suggestion` |
| Method | `POST` |
| 需要认证 | 是 |
| Content-Type | `application/json` |

**请求参数**：

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| tasks | Array | 否 | 任务列表（不传则查询所有未完成任务） |

**tasks数组元素结构**：

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | String | 任务ID |
| title | String | 任务标题 |
| description | String | 任务描述（可选） |
| importance | String | 重要性 (A/B/C/D) |
| urgency | Number | 紧急程度 (1/2/3/4) |
| completed | Boolean | 完成状态 |

**请求示例**：

```bash
curl -X POST /api/ai/suggestion \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "tasks": [
      {
        "id": "task-uuid-001",
        "title": "完成项目文档",
        "importance": "A",
        "urgency": 2,
        "completed": false
      },
      {
        "id": "task-uuid-002",
        "title": "代码审查",
        "importance": "B",
        "urgency": 3,
        "completed": false
      }
    ]
  }'
```

**成功响应**：

```json
{
  "code": 200,
  "data": {
    "suggestion": {
      "orderedTasks": [
        {
          "id": "task-uuid-001",
          "title": "完成项目文档",
          "priorityScore": 100,
          "reason": "重要性和紧急程度都很高，建议优先处理"
        },
        {
          "id": "task-uuid-002",
          "title": "代码审查",
          "priorityScore": 70,
          "reason": "重要但不紧急，可以安排在第二位处理"
        }
      ],
      "summary": "根据您当前的任务情况，建议您优先处理'完成项目文档'，因为它具有最高的优先级分数。"
    }
  }
}
```

**不传tasks参数的请求**：

```bash
curl -X POST /api/ai/suggestion \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{}'
```

**响应示例**（查询所有未完成任务）：

```json
{
  "code": 200,
  "data": {
    "suggestion": {
      "orderedTasks": [
        {
          "id": "task-uuid-003",
          "title": "紧急bug修复",
          "priorityScore": 100,
          "reason": "这是一个非常紧急的任务，建议立即处理"
        },
        {
          "id": "task-uuid-001",
          "title": "完成项目文档",
          "priorityScore": 90,
          "reason": "重要性为A的任务应该优先处理"
        }
      ],
      "summary": "您当前有5个未完成的任务，建议按照以下顺序处理以提高效率。"
    }
  }
}
```

## 5. 完整请求流程示例

### 5.1 完整交互流程

```mermaid
sequenceDiagram
    participant User as 用户
    participant Frontend as 前端应用
    participant Backend as 后端服务
    participant Database as 数据库
    
    Note over User,Database: 完整的用户交互流程
    
    User->>Frontend: 打开应用
    
    rect rgb(240, 248, 255)
        Note 登录阶段
        Frontend-->>User: 显示登录页面
        User->>Frontend: 输入手机号
        User->>Frontend: 点击登录
        Frontend->>Backend: POST /auth/login
        Backend->>Database: 查询/创建用户
        Database-->>Backend: 返回用户信息
        Backend->>Backend: 生成JWT Token
        Backend-->>Frontend: {token, user}
        Frontend->>Frontend: 存储Token
    end
    
    rect rgb(255, 250, 240)
        Note 任务管理阶段
        Frontend->>Backend: GET /tasks (带Token)
        Backend->>Database: 查询用户任务
        Database-->>Backend: 返回任务列表
        Backend-->>Frontend: 任务列表
        Frontend-->>User: 显示任务列表
        
        User->>Frontend: 点击添加任务
        Frontend-->>User: 显示添加表单
        User->>Frontend: 填写任务信息
        User->>Frontend: 提交任务
        Frontend->>Backend: POST /tasks
        Backend->>Database: 创建任务
        Backend-->>Frontend: 新建任务
        Frontend-->>User: 更新任务列表
    end
    
    rect rgb(240, 255, 240)
        Note AI推荐阶段
        User->>Frontend: 点击AI推荐
        Frontend->>Backend: POST /ai/suggestion
        Backend->>Backend: 计算任务优先级
        Backend-->>Frontend: 推荐结果
        Frontend-->>User: 显示推荐列表
    end
```

### 5.2 实际代码示例

**前端API封装**：

```javascript
// api/index.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器 - 自动添加Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 统一处理错误
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response.status === 401) {
      // Token过期，清除本地状态
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 认证相关API
export const authAPI = {
  login: (phone) => api.post('/auth/login', { phone }),
  profile: () => api.get('/auth/profile')
};

// 任务相关API
export const tasksAPI = {
  list: (params) => api.get('/tasks', { params }),
  get: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
  toggle: (id) => api.post(`/tasks/${id}/toggle`)
};

// AI相关API
export const aiAPI = {
  suggestion: (tasks) => api.post('/ai/suggestion', { tasks })
};

export default api;
```

**登录流程**：

```javascript
// 登录流程示例
async function login(phone) {
  try {
    const response = await authAPI.login(phone);
    const { token, user } = response.data;
    
    // 存储Token
    localStorage.setItem('token', token);
    
    // 跳转到首页
    router.push('/');
    
    return { success: true, user };
  } catch (error) {
    console.error('登录失败:', error);
    return { success: false, message: error.message };
  }
}
```

**任务管理流程**：

```javascript
// 获取任务列表
async function fetchTasks() {
  try {
    const response = await tasksAPI.list();
    return response.data;
  } catch (error) {
    console.error('获取任务列表失败:', error);
    return [];
  }
}

// 创建任务
async function createTask(taskData) {
  try {
    const response = await tasksAPI.create(taskData);
    return { success: true, task: response.data };
  } catch (error) {
    return { success: false, message: error.response.data.message };
  }
}

// 获取AI推荐
async function getAISuggestion(tasks) {
  try {
    const response = await aiAPI.suggestion(tasks);
    return response.data;
  } catch (error) {
    console.error('获取AI推荐失败:', error);
    return null;
  }
}
```

## 6. 错误码参考

### 6.1 业务错误码

| 错误码 | 说明 | 处理建议 |
|--------|------|----------|
| 400 | 请求参数错误 | 检查请求参数格式和必填项 |
| 401 | 未认证或Token无效 | 重新登录获取有效Token |
| 403 | 无权限访问 | 检查用户权限 |
| 404 | 资源不存在 | 检查请求的资源ID是否正确 |
| 500 | 服务器内部错误 | 联系管理员或稍后重试 |

### 6.2 详细错误消息

| 错误消息 | 说明 |
|----------|------|
| 手机号格式不正确 | 请输入有效的11位手机号 |
| 该手机号已注册 | 可以直接登录 |
| 任务标题不能为空 | 请填写任务标题 |
| Token无效或已过期 | 请重新登录 |
| 任务不存在 | 检查任务ID是否正确 |

## 7. 接口测试

### 7.1 使用curl测试

**登录测试**：

```bash
# 登录
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone": "13800138000"}'

# 提取Token
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone": "13800138000"}' | jq -r '.data.token')

# 创建任务
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title": "测试任务", "importance": "A", "urgency": 1}'

# 获取任务列表
curl http://localhost:3000/api/tasks \
  -H "Authorization: Bearer $TOKEN"
```

### 7.2 Postman Collection

可以导入以下Collection到Postman中进行接口测试：

```json
{
  "info": {
    "name": "Smart Todo API",
    "description": "智能待办事项管理API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000/api"
    },
    {
      "key": "token",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/auth/login",
            "body": {
              "mode": "raw",
              "raw": "{\"phone\": \"13800138000\"}"
            }
          }
        }
      ]
    },
    {
      "name": "Tasks",
      "item": [
        {
          "name": "Get Tasks",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": "{{baseUrl}}/tasks"
          }
        }
      ]
    }
  ]
}
```

## 8. 版本信息

| 版本 | 日期 | 修改内容 | 作者 |
|------|------|----------|------|
| v1.0.0 | 2026-01-14 | 初始版本 | 开发团队 |
