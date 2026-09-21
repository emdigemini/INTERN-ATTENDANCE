import express from 'express';
import { internStats, checkAttendanceStatus, timeIn, timeOut, getAttendanceData } from '../controllers/attendance.controller.js';
import { authentication } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

router.get('/intern-stats', authentication, internStats);
router.get('/attendance-data', authentication, getAttendanceData);
router.get('/attendance-status', authentication, checkAttendanceStatus);
router.post('/time-in', authentication, upload.single('photo'), timeIn);
router.patch('/time-out', authentication, upload.single('photo'), timeOut);

export default router