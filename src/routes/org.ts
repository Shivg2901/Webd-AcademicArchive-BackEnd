import express from 'express';
import { prismaClient } from '../config/db';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Create org and master admin
router.post('/create-admin-org', async (req, res) => {
  const { organizationName, adminEmail, adminPassword } = req.body;

  if (!organizationName || !adminEmail || !adminPassword) {
    return res.status(400).json({
      message: 'Organization name, admin email, and admin password are required',
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    //transaction so that an org is only created with an admin
    const result = await prismaClient.$transaction(async (prisma) => {
      const newOrg = await prisma.organization.create({
        data: {
          name: organizationName,
        },
      });

      const newAdmin = await prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          role: 'MASTER_ADMIN',
          approved: true,
          organizationId: newOrg.id,
        },
      });

      return {
        organization: newOrg,
        master_admin: newAdmin,
      };
    });

    res.status(201).json({
      message: 'Organization and Admin created successfully',
      organization: result.organization,
      master_admin: result.master_admin,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error creating organization or admin',
    });
  }
});

export default router;
