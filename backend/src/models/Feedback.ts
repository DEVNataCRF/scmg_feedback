import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from './User';
import { Department } from './Department';

export type Rating = 'Excelente' | 'Bom' | 'Regular' | 'Ruim';

@Entity('feedbacks')
@Index(['createdAt', 'department'])
@Index(['rating', 'createdAt'])
export class Feedback {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Department, { eager: true })
  @JoinColumn({ name: 'department_id' })
  @Index()
  department!: Department;

  @Column({
    type: process.env.NODE_ENV === 'test' ? 'text' : 'enum',
    enum: ['Excelente', 'Bom', 'Regular', 'Ruim']
  })
  @Index()
  rating!: Rating;

  @CreateDateColumn()
  @Index()
  createdAt!: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ nullable: true })
  @Index()
  user_id?: string;

  @Column({ nullable: true, type: 'text' })
  suggestion?: string;

  @Column({ nullable: true, type: 'int' })
  recomendacao?: number;
} 