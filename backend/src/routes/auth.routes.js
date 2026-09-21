import express from 'express';
import { authentication } from '../middleware/auth.middleware.js';
import { getAdmin } from '../controllers/auth.controller.js';

const router = express.Router();

router.get('/verifying', authentication, getAdmin);

export default router