import express from 'express';
import { authMiddleware } from '../middlewares/AuthMiddleware';
import { urlShortenerController } from '../controllers';

const router = express.Router();

router.post("/", authMiddleware.verifyJWT, (req, res) => { 
    urlShortenerController.createShortURL(req, res) });
router.get("/:alias", (req, res) => {
    urlShortenerController.redirectToLongURL(req, res) });

export default router;