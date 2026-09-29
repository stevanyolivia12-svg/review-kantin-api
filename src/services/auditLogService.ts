import { AuditLogRepository, type CreateAuditLogInput } from '../repositories/auditLogRepository.ts';

export class AuditLogService {
  private auditLogRepository: AuditLogRepository;

  constructor(auditLogRepository: AuditLogRepository = new AuditLogRepository()) {
    this.auditLogRepository = auditLogRepository;
  }

  async getAllAuditLogs() {
    return this.auditLogRepository.findAll();
  }

  async createAuditLog(input: CreateAuditLogInput) {
    if (!input.userId || !input.action || !input.targetTable || input.targetId === undefined) {
      throw new Error('AUDIT_LOG_INVALID_INPUT');
    }
    const row = await this.auditLogRepository.create(input);
    if (!row) throw new Error('AUDIT_LOG_NOT_FOUND');
    return row;
  }
}