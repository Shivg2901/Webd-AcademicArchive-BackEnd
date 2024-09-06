import express from 'express';
import authRoutes from './routes/auth';
import { authMiddleware } from './middleware/auth';

const app = express();

app.use(express.json());

app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3111;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
``