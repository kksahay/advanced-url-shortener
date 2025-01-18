import express from 'express';
import { userController } from '../controllers';

const router = express.Router();

router.get("/auth", (req, res) => { userController.signIn(req, res) });
router.get("/auth/google-callback", (req, res) => { userController.googleCallback(req, res) })

export default router;