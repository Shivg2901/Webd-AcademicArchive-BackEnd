import express from 'express';
import authRouter from './routes/auth';
import adminRouter from './routes/admin';
import studentRouter from './routes/student';
import catRouter from './routes/categories';
import fileRouter from './routes/file';
import orgRouter from './routes/org';
import { adminOnly, authMiddleware } from './middleware/auth';

const app = express();

app.use(express.json());

app.use('/auth', authRouter);
app.use('/admin/submissions', authMiddleware, adminOnly, adminRouter);
app.use('/student', authMiddleware, studentRouter);
app.use('/category', authMiddleware, catRouter);
app.use('/file', authMiddleware, fileRouter);
app.use('/org', orgRouter);

const PORT = process.env.PORT || 3111;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
