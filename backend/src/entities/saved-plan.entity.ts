import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('saved_plans')
export class SavedPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;

  @Column({ type: 'varchar', length: 255 })
  plan_name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string | null;

  // Financial Input Data
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

  // Risk Profile Result
  @Column({
    type: 'enum',
    enum: ['CONSERVATIVE', 'BALANCED', 'AGGRESSIVE'],
  })
  risk_profile: 'CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE';

  // Allocation Data (JSON)
  @Column({ type: 'json' })
  allocation: Record<string, number>; // e.g., { stocks: 40, bonds: 30, gold: 20, fd: 10 }

  @Column({ type: 'json' })
  capital_distribution: Record<string, number>; // e.g., { stocks: 40000, bonds: 30000, gold: 20000, fd: 10000 }

  // Projection Data (JSON)
  @Column({ type: 'json' })
  projection: {
    conservative: number;
    expected: number;
    optimistic: number;
    total_contributions: number;
  };

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
