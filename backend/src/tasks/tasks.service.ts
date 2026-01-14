import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto, UpdateTaskDto } from './task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async findAll(userId: string): Promise<Task[]> {
    return this.tasksRepository.find({
      where: { userId },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string, userId: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id, userId },
    });

    if (!task) {
      throw new NotFoundException(`任务ID ${id} 不存在`);
    }

    return task;
  }

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    const task = this.tasksRepository.create({
      ...createTaskDto,
      userId,
    });

    return this.tasksRepository.save(task);
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<Task> {
    const task = await this.findOne(id, userId);

    Object.assign(task, updateTaskDto);
    return this.tasksRepository.save(task);
  }

  async delete(id: string, userId: string): Promise<void> {
    const result = await this.tasksRepository.delete({ id, userId });

    if (result.affected === 0) {
      throw new NotFoundException(`任务ID ${id} 不存在`);
    }
  }

  async toggleComplete(id: string, userId: string): Promise<Task> {
    const task = await this.findOne(id, userId);
    task.completed = !task.completed;
    return this.tasksRepository.save(task);
  }
}
