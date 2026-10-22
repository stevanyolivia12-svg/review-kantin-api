import type { Request, Response } from 'express';
import { AuditLogService } from '../services/auditLogService.ts';
import { respondWithError } from '../middleware/errorHandler.ts';

export class AuditLogController {
  private auditLogService: AuditLogService;

  constructor(auditLogService: AuditLogService = new AuditLogService()) {
    this.auditLogService = auditLogService;
  }

  private handleError(res: Response, error: unknown): Response {
    return respondWithError(res, error);
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
      const data = await this.auditLogService.createAuditLog({ ...req.body, userId: req.auth!.id });
      return res.status(201).json({ status: 'success', data });
    } catch (error) {
      return this.handleError(res, error);
    }
  };
}