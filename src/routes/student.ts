import express from 'express';
import { prismaClient } from '../config/db';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/dashboard', authMiddleware, async (req, res) => {
  const submissions = await prismaClient.submission.findMany({
    where: {
      organizationId: req.user?.organizationId,
      status: 'APPROVED',
    },
  });
  res.json(submissions);
});

router.post('/upload', authMiddleware, async (req, res) => {
  const { title, description, fileUrl, categoryId } = req.body;

  if (!req.user || !req.user?.organizationId || !req.user?.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!categoryId) {
    return res.status(400).json({ message: 'Category is required' });
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
        categoryId,
      },
    });
    res.status(201).json(submission);
  } catch (error) {
    res.status(400).json({ error: 'Error uploading submission' });
  }
});

router.put('/submission/:id/category', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { categoryId } = req.body;
  
  if (!categoryId) {
    return res.status(400).json({ message: 'Category is required' });
  }

  try {
    const submission = await prismaClient.submission.update({
      where: { id },
      data: { categoryId },
    });
    res.status(200).json(submission);
  } catch (error) {
    res.status(400).json({ error: 'Error updating submission category' });
  }
});

router.get('/submissions/category/:categoryId', authMiddleware, async (req, res) => {
  const { categoryId } = req.params;

  try {
    const submissions = await prismaClient.submission.findMany({
      where: {
        categoryId,
        organizationId: req.user?.organizationId,
        status: 'APPROVED',
      },
    });
    res.json(submissions);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching submissions' });
  }
});

router.post('/:submissionId/comment', authMiddleware, async (req, res) => {
  const { submissionId } = req.params;
  const { content } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const comment = await prismaClient.comment.create({
      data: {
        content: content,
        submissionId: submissionId,
        userId: req.user.userId,
      },
    });
    res.status(201).json(comment);
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'Error adding comment' });
  }
});


router.get('/:submissionId/comments', authMiddleware, async (req, res) => {
  const { submissionId } = req.params;

  try {
    const comments = await prismaClient.comment.findMany({
      where: {
        submissionId: submissionId,
      },
    });
    res.status(200).json(comments);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching comments' });
  }
});


export default router;
