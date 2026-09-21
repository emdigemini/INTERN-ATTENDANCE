import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import attendanceRoutes from './routes/attendance.routes.js';
import adminRoutes from './routes/admin.routes.js';
import authRoutes from './routes/auth.routes.js';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use('/api/attendance_cnx', attendanceRoutes);
app.use('/api/admin_cnx', adminRoutes);
app.use('/api/auth', authRoutes);

export default app