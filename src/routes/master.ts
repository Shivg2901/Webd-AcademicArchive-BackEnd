import express from 'express';
import { prismaClient } from '../config/db';
import { authMiddleware, masterAdminOnly } from '../middleware/auth';

const router = express.Router();

// Approve an admin by the Master Admin

router.get('/pending-admins', authMiddleware, masterAdminOnly, async (req, res) => {
    try {
        const pendingAdmins = await prismaClient.user.findMany({
            where: { role: 'ADMIN',
        approved: false },
        });
        res.json(pendingAdmins)
    } catch (error) {
        res.status(500).json({ error: 'Error approving admin' });
    }
});

router.put('/approve-admin/:id', authMiddleware, masterAdminOnly, async (req, res) => {
    try {
        const updatedAdmin = await prismaClient.user.update({
            where: { id: req.params.id },
            data: { approved: true },
        });
        res.status(200).json(updatedAdmin);
    } catch (error) {
        res.status(500).json({ error: 'Error approving admin' });
    }
});

// Remove an admin by the Master Admin
router.delete('/admin/:id', authMiddleware, masterAdminOnly, async (req, res) => {
    const { id } = req.params;

    try {
        const adminToDelete = await prismaClient.user.findUnique({
            where: { id },
        });

        if (!adminToDelete) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        // Prevent the master admin from removing themselves
        if (adminToDelete.role === 'MASTER_ADMIN') {
            return res.status(403).json({ error: 'You cannot remove yourself as the Master Admin' });
        }

        await prismaClient.user.delete({
            where: { id },
        });

        res.status(200).json({ message: 'Admin removed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error removing admin' });
    }
});

export default router;
