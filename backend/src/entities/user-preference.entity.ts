import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_preferences')
export class UserPreference {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;

  @Column({
    type: 'enum',
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  })
  risk_tolerance: 'Low' | 'Medium' | 'High';

  @Column({
    type: 'enum',
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  })
  liquidity_need: 'Low' | 'Medium' | 'High';

  @Column({ type: 'boolean', default: false })
  has_emergency_fund: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
