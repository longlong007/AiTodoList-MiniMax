import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 启用CORS
  app.enableCors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });
  
  // 全局验证管道（用于DTO验证）
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    // forbidNonWhitelisted: true, // 移除：对实体操作太严格
  }));
  
  // 设置全局前缀
  app.setGlobalPrefix('api');
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`🚀 应用已启动: http://localhost:${port}/api`);
}

bootstrap();
