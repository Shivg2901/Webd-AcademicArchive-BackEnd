import express from 'express';
import { prismaClient } from '../config/db';
import bcrypt from 'bcryptjs';

const router = express.Router();

router.post('/create-admin-org', async (req, res) => {
  const { organizationName, adminEmail, adminPassword } = req.body;

  if (!organizationName || !adminEmail || !adminPassword) {
    return res.status(400).json({
     message: 'Organization name, admin email, and admin password are required' 
    });
  }

  try {
    
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    
    const result = await prismaClient.$transaction([
      prismaClient.organization.create({
        data: {
          name: organizationName,
        },
      }),
      prismaClient.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          role: 'ADMIN',
          organization: {
            create: {
              name: organizationName,
            },
          },
        },
      }),
    ]);

    res.status(201).json({
      message: 'Organization and Admin created successfully',
      organization: result[0],
      admin: result[1],
    });
  } catch (error) {
    //console.log(error);
    res.status(500).json({
     message: 'Error creating organization or admin' 
    });
  }
});

export default router;
