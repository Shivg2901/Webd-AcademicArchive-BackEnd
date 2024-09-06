import express from 'express';
import authRouter from './routes/auth';
import adminRouter from './routes/admin';
import studentRouter from './routes/student';
import { adminOnly, authMiddleware } from './middleware/auth';

const app = express();

app.use(express.json());

app.use('/auth', authRouter);
app.use('/admin', authMiddleware, adminOnly, adminRouter);
app.use('/student', authMiddleware, studentRouter);

const PORT = process.env.PORT || 3111;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
