import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';

@Entity('eventos')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({ type: 'timestamp' })
  dataInicio: Date;

  @Column({ type: 'timestamp' })
  dataFim: Date;

  @Column({ length: 20 })
  cor: string;

  // Índice para performance (muito importante)
  @Index()
  @Column()
  usuario_id: string;

  // Foreign Key, onDelete para apagar todas as tarefas do banco caso o usuário seja excluido
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id' })
  usuario: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
