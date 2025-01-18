import express from 'express';

const router = express.Router();

router.get("/:alias");
router.get("/topic/:topic");
router.get("/overall");

export default router;