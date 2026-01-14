import { IsString, IsEnum, IsOptional, IsBoolean, IsUUID } from 'class-validator';
import { TaskImportance, TaskUrgency } from './task.entity';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskImportance)
  importance: TaskImportance;

  @IsEnum(TaskUrgency)
  urgency: TaskUrgency;
}

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskImportance)
  @IsOptional()
  importance?: TaskImportance;

  @IsEnum(TaskUrgency)
  @IsOptional()
  urgency?: TaskUrgency;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}

export class ReorderTasksDto {
  @IsUUID('4', { each: true })
  taskIds: string[];
}
