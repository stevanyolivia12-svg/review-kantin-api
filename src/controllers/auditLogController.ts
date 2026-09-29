import type { Request, Response } from 'express';
import { AuditLogService } from '../services/auditLogService.ts';

export class AuditLogController {
  private auditLogService: AuditLogService;

  constructor(auditLogService: AuditLogService = new AuditLogService()) {
    this.auditLogService = auditLogService;
  }

  private handleError(res: Response, error: unknown): Response {
    if (error instanceof Error && error.message === 'AUDIT_LOG_INVALID_INPUT') {
      return res.status(400).json({ status: 'fail', message: 'Data audit log tidak valid' });
    }
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
      error: error instanceof Error ? error.message : String(error),
    });
  }

  getAuditLogs = async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = await this.auditLogService.getAllAuditLogs();
      return res.status(200).json({ status: 'success', data });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  createAuditLog = async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = await this.auditLogService.createAuditLog(req.body);
      return res.status(201).json({ status: 'success', data });
    } catch (error) {
      return this.handleError(res, error);
    }
  };
}