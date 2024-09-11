import express from 'express';
import { prismaClient } from '../config/db';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

//dashboard to get approved submissions
router.get('/dashboard', authMiddleware, async (req, res) => {
  const submissions = await prismaClient.submission.findMany({
    where: {
      organizationId: req.user?.organizationId,
      status: 'APPROVED',
    },
  });
  res.json(submissions);
});

//route to create submission
router.post('/upload', authMiddleware, async (req, res) => {
  const { title, description, fileUrl, categoryId } = req.body;

  if (!req.user || !req.user?.organizationId || !req.user?.userId) {
    return res.status(401).json({
     message: 'Unauthorized' 
    });
  }

  try {
    const submissionData: any = {
      title,
      description,
      fileUrl,
      status: 'PENDING',
      studentId: req.user.userId,
      organizationId: req.user.organizationId,
    };

    if (categoryId) {
      submissionData.categoryId = categoryId;
    }

    const submission = await prismaClient.submission.create({
      data: submissionData,
    });

    res.status(201).json(submission);
  } catch (error) {
    res.status(400).json({
       error: 'Error uploading submission' 
    });
  }
});

//route to fetch submissions based on category 
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
    res.status(400).json({
      error: 'Error fetching submissions' 
    });
  }
});

//route to make comment to a submission
router.post('/:submissionId/comment', authMiddleware, async (req, res) => {
  const { submissionId } = req.params;
  const { content } = req.body;

  if (!req.user) {
    return res.status(401).json({
     message: 'Unauthorized' 
    });
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
    res.status(400).json({
     error: 'Error adding comment' 
    });
  }
});

//route to fetch comments for a submission
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
    res.status(400).json({
     error: 'Error fetching comments' 
    });
  }
});

//route to search for submissions by title, description, category
router.get('/search', authMiddleware, async (req, res) => {
  const { q } = req.query; 

  try {
    const searchResults = await prismaClient.submission.findMany({
      where: {
        status: 'APPROVED',
        OR: q
          ? [
              {
                title: {
                  contains: q as string,
                  mode: 'insensitive', 
                },
              },
              {
                description: {
                  contains: q as string,
                  mode: 'insensitive',
                },
              },
              {
                Category: {
                  name: {
                    contains: q as string,
                    mode: 'insensitive',
                  },
                },
              },
            ]
          : undefined, 
      },
      include: {
        Category: true, 
      },
    });

    res.status(200).json(searchResults);
  } catch (error) {
    res.status(500).json({ error: 'Error searching submissions' });
  }
});

export default router;




