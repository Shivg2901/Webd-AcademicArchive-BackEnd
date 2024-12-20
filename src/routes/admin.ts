import express from 'express';
import {prismaClient} from '../config/db';
import { adminOnly, authMiddleware } from '../middleware/auth';

const router = express.Router();

//get all pending submissions
router.get('/', authMiddleware, adminOnly, async (req, res) => {
    if(!req.user || !req.user.organizationId) {

        return res.json({
            message: "Unauthorized"
        })
    }
    const submissions = await prismaClient.submission.findMany({
        where: {
         status: 'PENDING', organizationId: req.user.organizationId
        },
    });
    res.json(submissions);
});

//route to approve submission
router.put('/:id/approve', authMiddleware, adminOnly, async (req, res) => {
    const { id } = req.params;
    const submission = await prismaClient.submission.update({
        where: { id },
        data: {
            status: 'APPROVED'
        },
    });
    res.json(submission);
});

//route to reject submission
router.put('/:id/reject', authMiddleware, adminOnly, async (req, res) => {
    const { id } = req.params;
    const submission = await prismaClient.submission.update({
        where: { id },
        data: {
            status: 'REJECTED' 
        },
    });
    res.json(submission);
});

//route to make updates
router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
    const { id } = req.params;
    const updatedSubmission = await prismaClient.submission.update({
        where: { id },
        data: req.body,
    });
    res.json(updatedSubmission);
});

//route to delete submission
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
    const { id } = req.params;
    await prismaClient.submission.delete({
        where: { id } 
    });
    res.json({
        message: 'Submission deleted' 
    });
});

//route to assign category to submission
router.put('/:id/category', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { categoryId } = req.body;
    
    if (!categoryId) {
      return res.status(400).json({
        message: 'Category is required'
      });
    }
  
    try {
      const submission = await prismaClient.submission.update({
        where: {
          id 
        },
        data: {
          categoryId 
        },
      });
      res.status(200).json(submission);
    } catch (error) {
      res.status(400).json({
       error: 'Error updating submission category' 
      });
    }
  });

export default router;
