import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { User } from '../auth/user.entity';

export enum TaskImportance {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D'
}

export enum TaskUrgency {
  VERY_URGENT = 1,
  URGENT = 2,
  NORMAL = 3,
  NOT_URGENT = 4
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: TaskImportance,
    default: TaskImportance.B
  })
  importance: TaskImportance;

  @Column({
    type: 'enum',
    enum: TaskUrgency,
    default: TaskUrgency.NORMAL
  })
  urgency: TaskUrgency;

  @Column({ default: false })
  completed: boolean;

  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
