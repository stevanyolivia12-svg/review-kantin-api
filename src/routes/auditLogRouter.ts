import { Router } from 'express';
import { AuditLogController } from '../controllers/auditLogController.ts';

const auditLogRouter = Router();
const auditLogController = new AuditLogController();

auditLogRouter.get('/', (req, res) => auditLogController.getAuditLogs(req, res));
auditLogRouter.post('/', (req, res) => auditLogController.createAuditLog(req, res));

export { auditLogRouter };