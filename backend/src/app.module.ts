import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { AiModule } from './ai/ai.module';
import { Task } from './tasks/task.entity';
import { User } from './auth/user.entity';

// 手动加载 .env 文件（仅开发环境）
import * as fs from 'fs';
import * as path from 'path';

const isDevelopment = process.env.NODE_ENV !== 'production';

if (isDevelopment) {
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const [key, ...values] = line.split('=');
      if (key && values.length > 0 && !key.startsWith('#')) {
        process.env[key.trim()] = values.join('=').trim();
      }
    });
    console.log('[INFO] .env file loaded (development mode)');
  } else {
    console.log('[INFO] No .env file found, using default values');
  }
} else {
  console.log('[INFO] Production mode: using system environment variables');
}

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'todolist',
      entities: [Task, User],
      synchronize: isDevelopment,
      logging: isDevelopment,
      ssl: isDevelopment ? false : { rejectUnauthorized: false },
    }),
    TasksModule,
    AuthModule,
    AiModule,
  ],
})
export class AppModule {}