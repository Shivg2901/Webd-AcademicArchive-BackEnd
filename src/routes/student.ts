import express from 'express';
import {prismaClient} from '../config/db';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/dashboard', authMiddleware, async (req, res) => {
  const submissions = await prismaClient.submission.findMany({
    where: {
      organizationId: req.user?.organizationId, status: 'APPROVED' 
    },
  });
  res.json(submissions);
});

router.post('/upload', authMiddleware, async (req, res) => {
  const { title, description, fileUrl } = req.body;


  if(!req.user || !req.user?.organizationId || !req.user?.userId) {
    return res.json({
        message: "Unauthorized"
    })
  }

  
  try {
    const submission = await prismaClient.submission.create({
      data: {
        title,
        description,
        fileUrl,
        status: 'PENDING',
        studentId: req.user.userId,
        organizationId: req.user.organizationId,
      },
    });
    res.status(201).json(submission);
  } catch (error) {
    res.status(400).json({ error: 'Error uploading submission' });
  }
});

export default router;
