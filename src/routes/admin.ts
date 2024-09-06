import express from 'express';
import {prismaClient} from '../config/db';
import { adminOnly, authMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/submissions', authMiddleware, adminOnly, async (req, res) => {
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

router.put('/submissions/:id/approve', authMiddleware, adminOnly, async (req, res) => {
    const { id } = req.params;
    const submission = await prismaClient.submission.update({
        where: { id },
        data: { status: 'APPROVED' },
    });
    res.json(submission);
});

router.put('/submissions/:id/reject', authMiddleware, adminOnly, async (req, res) => {
    const { id } = req.params;
    const submission = await prismaClient.submission.update({
        where: { id },
        data: { status: 'REJECTED' },
    });
    res.json(submission);
});

router.put('/submissions/:id', authMiddleware, adminOnly, async (req, res) => {
    const { id } = req.params;
    const updatedSubmission = await prismaClient.submission.update({
        where: { id },
        data: req.body,
    });
    res.json(updatedSubmission);
});

router.delete('/submissions/:id', authMiddleware, adminOnly, async (req, res) => {
    const { id } = req.params;
    await prismaClient.submission.delete({ where: { id } });
    res.json({ message: 'Submission deleted' });
});

export default router;
