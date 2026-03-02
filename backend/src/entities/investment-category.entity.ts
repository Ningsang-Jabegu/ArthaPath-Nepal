import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('investment_categories')
export class InvestmentCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ['Stocks', 'Mutual Fund', 'Bond', 'FD', 'Gold', 'Real Estate', 'Business'],
  })
  type: 'Stocks' | 'Mutual Fund' | 'Bond' | 'FD' | 'Gold' | 'Real Estate' | 'Business';

  @Column({ type: 'float' })
  expected_return_min: number;

  @Column({ type: 'float' })
  expected_return_max: number;

  @Column({
    type: 'enum',
    enum: ['Low', 'Medium', 'High'],
  })
  risk_level: 'Low' | 'Medium' | 'High';

  @Column({ type: 'float' })
  liquidity_score: number; // 0-10, where 10 is most liquid

  @Column()
  lock_in_period: string; // e.g., "None", "3 months", "1 year"

  @Column({ type: 'int' })
  minimum_capital: number; // in NPR

  @Column({ type: 'text' })
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
