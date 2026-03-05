import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  VIEW = 'VIEW',
}

@Entity('audit_logs')
@Index(['entity_type', 'entity_id', 'created_at'])
@Index(['user_id', 'created_at'])
@Index(['action', 'created_at'])
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  entity_type: string; // 'investment_category', 'user', 'saved_plan', etc.

  @Column()
  entity_id: string;

  @Column({
    type: 'enum',
    enum: AuditAction,
  })
  action: AuditAction;

  @Column()
  user_id: string;

  @Column()
  user_email: string;

  @Column()
  ip_address: string;

  @Column('text', { nullable: true })
  user_agent: string | null;

  // Store the old values for updates and deletes
  @Column('jsonb', { nullable: true })
  old_values: Record<string, any> | null;

  // Store the new values for creates and updates
  @Column('jsonb', { nullable: true })
  new_values: Record<string, any> | null;

  // Description of what changed (for human readability)
  @Column({ nullable: true })
  change_description: string;

  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  created_at: Date;
}
