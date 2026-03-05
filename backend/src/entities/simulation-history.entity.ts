import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';

@Entity('simulation_history')
@Index(['user_id', 'created_at'])
@Index(['user_id'])
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;

  @Column({ type: 'int' })
  initial_capital: number;

  @Column({ type: 'int' })
  monthly_contribution: number;

  @Column({ type: 'int' })
  duration_years: number;

  @Column({
    type: 'enum',
    enum: ['Low', 'Medium', 'High'],
  })
  risk_tolerance: 'Low' | 'Medium' | 'High';

  @Column({
    type: 'enum',
    enum: ['Low', 'Medium', 'High'],
  })
  liquidity_need: 'Low' | 'Medium' | 'High';

  @Column({ type: 'boolean' })
  has_emergency_fund: boolean;

  @Column({ type: 'json' })
  allocation_result: Record<string, number>; // allocation percentages

  @Column({ type: 'json' })
  projection_result: {
    conservative: number;
    expected: number;
    optimistic: number;
    total_contributions: number;
  };

  @Column({
    type: 'enum',
    enum: ['Conservative', 'Balanced', 'Aggressive'],
  })
  risk_profile: 'Conservative' | 'Balanced' | 'Aggressive';

  @CreateDateColumn()
  created_at: Date;
}
