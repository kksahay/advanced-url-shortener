import express from 'express';
import { analyticsController } from '../controllers';
import { authMiddleware } from '../middlewares/AuthMiddleware';

const router = express.Router();

router.get("/overall", authMiddleware.verifyJWT, (req, res) => { analyticsController.getOverallAnalytics(req, res) });
router.get("/:alias", (req, res) => { analyticsController.getAliasAnalytics(req, res) });
router.get("/topic/:topic", authMiddleware.verifyJWT, (req, res) => { analyticsController.getTopicAnalytics(req, res) });

export default router;