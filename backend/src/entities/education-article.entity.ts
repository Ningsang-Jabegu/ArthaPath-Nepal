import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type EducationCategory =
  | 'Stocks'
  | 'Mutual Fund'
  | 'Bond'
  | 'Fixed Deposit'
  | 'Gold'
  | 'Real Estate'
  | 'Business'
  | 'General';

@Entity('education_articles')
export class EducationArticle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: [
      'Stocks',
      'Mutual Fund',
      'Bond',
      'Fixed Deposit',
      'Gold',
      'Real Estate',
      'Business',
      'General',
    ],
  })
  category: EducationCategory;

  @Column({ type: 'text' })
  content: string;

  @Column()
  risk_icon: string;

  @Column()
  image: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
