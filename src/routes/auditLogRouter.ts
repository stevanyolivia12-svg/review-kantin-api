import { Router } from 'express';
import { AuditLogController } from '../controllers/auditLogController.ts';
import { requireAuth, requireRoles } from '../middleware/auth.ts';
import { validateBody } from '../middleware/validate.ts';
import { createAuditLogSchema } from '../validators/schemas.ts';

const auditLogRouter = Router();
const auditLogController = new AuditLogController();

auditLogRouter.get('/', requireAuth, requireRoles('admin'), (req, res) => {
	// #swagger.security = [{ "bearerAuth": [] }]
	return auditLogController.getAuditLogs(req, res);
});
auditLogRouter.post('/', requireAuth, requireRoles('admin'), validateBody(createAuditLogSchema), (req, res) => {
	// #swagger.security = [{ "bearerAuth": [] }]
	return auditLogController.createAuditLog(req, res);
});

export { auditLogRouter };