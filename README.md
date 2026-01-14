# 智能TodoList应用

一个功能完整的智能任务管理应用，支持AI智能建议、主题切换、任务优先级管理。

## 技术栈

- **前端**: Vue 3 + Vite + Pinia + TailwindCSS
- **后端**: NestJS + TypeORM + PostgreSQL
- **AI**: 智谱大模型 (Zhipu AI)
- **认证**: JWT认证

## 核心功能

### 1. 任务管理
- 重要性分级: A(非常重要) > B(重要) > C(一般) > D(不重要)
- 紧急性分级: 1(非常紧急) > 2(紧急) > 3(一般) > 4(不紧急)
- 自动按优先级排序
- 任务完成状态切换
- 任务编辑和删除

### 2. AI智能建议
- 基于智谱大模型的任务分析
- 优先级排序建议
- 时间分配建议
- 任务合并建议

### 3. 用户认证
- 手机号登录（模拟）
- JWT Token认证
- 7天有效期的认证令牌

### 4. 主题切换
- 一键切换白天/黑夜模式
- 自动保存主题偏好
- 优雅的过渡动画

### 5. 性能优化
- API响应时间 < 200ms
- 前端路由预加载
- 组件按需加载
- 10秒请求超时保护

## 项目结构

```
smart-todolist/
├── frontend/                # Vue 3前端项目
│   ├── src/
│   │   ├── api/            # API服务
│   │   ├── components/     # Vue组件
│   │   ├── stores/         # Pinia状态管理
│   │   ├── views/          # 页面视图
│   │   ├── router/         # 路由配置
│   │   ├── App.vue         # 根组件
│   │   └── main.js         # 入口文件
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── backend/                 # NestJS后端项目
│   ├── src/
│   │   ├── auth/           # 认证模块
│   │   ├── tasks/          # 任务管理模块
│   │   ├── ai/             # AI模块
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml       # Docker配置
└── package.json            # 根目录配置
```

## 快速开始

### 1. 环境准备

确保已安装以下软件：
- Node.js 18+ 
- npm 或 yarn
- Docker Desktop (用于PostgreSQL)

### 2. 启动PostgreSQL数据库

```bash
# 使用Docker启动PostgreSQL
docker-compose up -d

# 验证数据库是否启动成功
docker ps
```

### 3. 安装依赖

```bash
# 安装根目录依赖
npm install

# 安装前端依赖
cd frontend && npm install

# 安装后端依赖
cd backend && npm install
```

### 4. 配置环境变量

```bash
# 复制环境变量模板
cp backend/.env.example backend/.env

# 编辑.env文件，配置以下内容：
# - 数据库连接信息
# - JWT密钥
# - 智谱AI API密钥（可选）
```

### 5. 启动应用

**方式一：同时启动前后端**

```bash
npm run dev
```

**方式二：分别启动**

```bash
# 终端1 - 启动后端
cd backend
npm run start:dev

# 终端2 - 启动前端
cd frontend
npm run dev
```

### 6. 访问应用

- 前端: http://localhost:5173
- 后端API: http://localhost:3001/api

## API接口文档

### 认证模块

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/auth/login | 手机号登录 |
| GET | /api/auth/profile | 获取用户信息 |

### 任务模块

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/tasks | 获取所有任务 |
| GET | /api/tasks/:id | 获取单个任务 |
| POST | /api/tasks | 创建任务 |
| PUT | /api/tasks/:id | 更新任务 |
| DELETE | /api/tasks/:id | 删除任务 |
| POST | /api/tasks/:id/toggle | 切换任务完成状态 |

### AI模块

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/ai/suggestion | 获取AI任务建议 |

## 任务数据结构

```typescript
{
  id: string,           // 任务ID (UUID)
  title: string,        // 任务标题
  description?: string, // 任务描述（可选）
  importance: 'A'|'B'|'C'|'D',  // 重要性等级
  urgency: 1|2|3|4,     // 紧急性等级
  completed: boolean,   // 完成状态
  createdAt: Date,      // 创建时间
  updatedAt: Date       // 更新时间
}
```

## 主题切换

应用支持一键切换白天/黑夜主题：

- 点击顶部工具栏的太阳/月亮图标
- 主题偏好自动保存到本地存储
- 切换时带有300ms的平滑过渡动画

## 智谱AI配置

1. 注册智谱AI账号: https://www.zhipuai.cn/
2. 获取API密钥
3. 在后端的.env文件中配置:
   ```
   ZHIPU_API_KEY=your_api_key_here
   ```
4. 如果不配置API密钥，系统将使用模拟建议功能

## 性能指标

- API响应时间: < 200ms
- 前端首屏加载: < 1s
- 主题切换: 300ms过渡动画
- 请求超时: 10秒保护

## 生产部署

### 1. 构建应用

```bash
# 构建前端
cd frontend && npm run build

# 构建后端
cd backend && npm run build
```

### 2. 环境配置

设置生产环境变量：
```env
DB_HOST=your_postgres_host
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=todolist
JWT_SECRET=your_strong_secret_key
ZHIPU_API_KEY=your_production_api_key
PORT=3001
```

### 3. 使用PM2部署后端

```bash
npm install -g pm2
cd backend
pm2 start dist/main.js --name todolist-backend
```

### 4. 配置Nginx

```nginx
server {
    listen 80;
    server_name your_domain.com;
    
    # 前端静态文件
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # 后端API代理
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 许可证

MIT License
