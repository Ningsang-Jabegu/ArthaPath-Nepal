import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog, AuditAction } from '../entities/audit-log.entity';

export interface IAuditContext {
  userId: string;
  userEmail: string;
  ipAddress: string;
  userAgent?: string;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    @InjectRepository(AuditLog)
    private auditLogsRepository: Repository<AuditLog>,
  ) {}

  /**
   * Log a CREATE action
   */
  async logCreate(
    entityType: string,
    entityId: string,
    context: IAuditContext,
    newValues: Record<string, any>,
    changeDescription?: string,
  ): Promise<AuditLog> {
    const auditLog = this.auditLogsRepository.create();
    auditLog.entity_type = entityType;
    auditLog.entity_id = entityId;
    auditLog.action = AuditAction.CREATE;
    auditLog.user_id = context.userId;
    auditLog.user_email = context.userEmail;
    auditLog.ip_address = context.ipAddress;
    auditLog.user_agent = context.userAgent ?? null;
    auditLog.new_values = newValues;
    auditLog.old_values = null;
    auditLog.change_description =
      changeDescription || `Created ${entityType} with ID ${entityId}`;

    await this.auditLogsRepository.save(auditLog);
    this.logger.log(
      `Audit CREATE: ${entityType}/${entityId} by ${context.userEmail}`,
    );
    return auditLog;
  }

  /**
   * Log an UPDATE action
   */
  async logUpdate(
    entityType: string,
    entityId: string,
    context: IAuditContext,
    oldValues: Record<string, any>,
    newValues: Record<string, any>,
    changeDescription?: string,
  ): Promise<AuditLog> {
    // Calculate what actually changed
    const changedFields = this.getChangedFields(oldValues, newValues);

    const auditLog = this.auditLogsRepository.create();
    auditLog.entity_type = entityType;
    auditLog.entity_id = entityId;
    auditLog.action = AuditAction.UPDATE;
    auditLog.user_id = context.userId;
    auditLog.user_email = context.userEmail;
    auditLog.ip_address = context.ipAddress;
    auditLog.user_agent = context.userAgent ?? null;
    auditLog.old_values = oldValues;
    auditLog.new_values = newValues;
    auditLog.change_description =
      changeDescription ||
      `Updated fields: ${changedFields.join(', ')} in ${entityType}`;

    await this.auditLogsRepository.save(auditLog);
    this.logger.log(
      `Audit UPDATE: ${entityType}/${entityId} (${changedFields.length} fields) by ${context.userEmail}`,
    );
    return auditLog;
  }

  /**
   * Log a DELETE action
   */
  async logDelete(
    entityType: string,
    entityId: string,
    context: IAuditContext,
    oldValues: Record<string, any>,
    changeDescription?: string,
  ): Promise<AuditLog> {
    const auditLog = this.auditLogsRepository.create();
    auditLog.entity_type = entityType;
    auditLog.entity_id = entityId;
    auditLog.action = AuditAction.DELETE;
    auditLog.user_id = context.userId;
    auditLog.user_email = context.userEmail;
    auditLog.ip_address = context.ipAddress;
    auditLog.user_agent = context.userAgent ?? null;
    auditLog.old_values = oldValues;
    auditLog.new_values = null;
    auditLog.change_description =
      changeDescription || `Deleted ${entityType} with ID ${entityId}`;

    await this.auditLogsRepository.save(auditLog);
    this.logger.log(
      `Audit DELETE: ${entityType}/${entityId} by ${context.userEmail}`,
    );
    return auditLog;
  }

  /**
   * Get all audit logs for a specific entity
   */
  async getLogsForEntity(
    entityType: string,
    entityId: string,
    limit = 50,
  ): Promise<AuditLog[]> {
    return this.auditLogsRepository.find({
      where: {
        entity_type: entityType,
        entity_id: entityId,
      },
      order: {
        created_at: 'DESC',
      },
      take: limit,
    });
  }

  /**
   * Get all audit logs for a specific user
   */
  async getLogsForUser(userId: string, limit = 50): Promise<AuditLog[]> {
    return this.auditLogsRepository.find({
      where: {
        user_id: userId,
      },
      order: {
        created_at: 'DESC',
      },
      take: limit,
    });
  }

  /**
   * Get audit logs for a specific action
   */
  async getLogsByAction(
    action: AuditAction,
    limit = 50,
  ): Promise<AuditLog[]> {
    return this.auditLogsRepository.find({
      where: {
        action,
      },
      order: {
        created_at: 'DESC',
      },
      take: limit,
    });
  }

  /**
   * Get audit logs for a specific entity type
   */
  async getLogsByEntityType(
    entityType: string,
    limit = 50,
  ): Promise<AuditLog[]> {
    return this.auditLogsRepository.find({
      where: {
        entity_type: entityType,
      },
      order: {
        created_at: 'DESC',
      },
      take: limit,
    });
  }

  /**
   * Get audit logs within a date range
   */
  async getLogsByDateRange(
    startDate: Date,
    endDate: Date,
    limit = 50,
  ): Promise<AuditLog[]> {
    return this.auditLogsRepository
      .createQueryBuilder('audit')
      .where('audit.created_at >= :startDate', { startDate })
      .andWhere('audit.created_at <= :endDate', { endDate })
      .orderBy('audit.created_at', 'DESC')
      .take(limit)
      .getMany();
  }

  /**
   * Get a summary of changes for an entity
   */
  async getEntityChangesSummary(
    entityType: string,
    entityId: string,
  ): Promise<{
    totalChanges: number;
    createdAt: Date | null;
    lastModifiedAt: Date | null;
    lastModifiedBy: string | null;
    changeLog: Array<{
      action: AuditAction;
      timestamp: Date;
      user: string;
      changes: string;
    }>;
  }> {
    const logs = await this.getLogsForEntity(entityType, entityId);

    if (logs.length === 0) {
      return {
        totalChanges: 0,
        createdAt: null,
        lastModifiedAt: null,
        lastModifiedBy: null,
        changeLog: [],
      };
    }

    const createdLog = logs[logs.length - 1]; // Last one is the oldest
    const lastLog = logs[0]; // First one is the newest

    return {
      totalChanges: logs.length,
      createdAt: createdLog.created_at,
      lastModifiedAt: lastLog.created_at,
      lastModifiedBy: lastLog.user_email,
      changeLog: logs.map((log) => ({
        action: log.action,
        timestamp: log.created_at,
        user: log.user_email,
        changes: log.change_description,
      })),
    };
  }

  /**
   * Delete old audit logs (older than specified days)
   * Useful for maintenance and compliance with data retention policies
   */
  async deleteOldLogs(daysToKeep = 365): Promise<{ deletedCount: number }> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await this.auditLogsRepository.delete({
      created_at: this.getLessThanDate(cutoffDate),
    });

    this.logger.log(
      `Deleted ${result.affected} audit logs older than ${daysToKeep} days`,
    );
    return { deletedCount: result.affected || 0 };
  }

  /**
   * Private helper: Determine which fields changed between two objects
   */
  private getChangedFields(
    oldValues: Record<string, any>,
    newValues: Record<string, any>,
  ): string[] {
    const changed: string[] = [];

    // Check all new keys
    for (const key in newValues) {
      if (oldValues[key] !== newValues[key]) {
        changed.push(key);
      }
    }

    // Check for deleted keys
    for (const key in oldValues) {
      if (!(key in newValues) && newValues[key] !== undefined) {
        changed.push(key);
      }
    }

    return changed;
  }

  /**
   * Private helper: Create a TypeORM LessThan condition
   */
  private getLessThanDate(date: Date) {
    // TypeORM's LessThan function - returning date for raw query
    return date;
  }
}
