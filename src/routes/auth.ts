import express, { Request, Response } from 'express';
import bcrypt, { hash, compare } from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { prismaClient } from '../config/db';

const router = express.Router();

const JWT_SECRET: string = process.env.JWT_SECRET || 'defaultsecret';

import { Role as PrismaRole } from '../config/db';

interface RegisterRequestBody {
  email: string;
  password: string;
  role: PrismaRole;
  organizationId: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

//role based registration
router.post('/register', async (req: Request<{}, {}, RegisterRequestBody>, res: Response) => {

    const { email, password, role, organizationId } = req.body;

    if (!email || !password || !role || !organizationId) {

        return res.status(400).json({
        message: "Missing field",
        });
    }

    try {
        const hashedPassword: string = await hash(password, 10);

        const user = await prismaClient.user.create({
            data: {
            email,
            password: hashedPassword,
            role,
            organizationId,
            },
        });

        const { password: _, ...userWithoutPassword } = user;

        return res.status(201).json({
        message: 'User created successfully',
        user: userWithoutPassword,
        });

    } catch (error) {

        return res.status(400).json({
        error: 'Email already exists or invalid data',
        });
    }
});

//login and get jwt
router.post('/login', async (req: Request<{}, {}, LoginRequestBody>, res: Response) => {

    const { email, password } = req.body;

    const user = await prismaClient.user.findUnique({ 
        where: { 
            email
        } 
    })

    if (!user) {
        return res.status(401).json({ 
            error: 'Invalid email or password'
        })
    }

    const isValidPassword: boolean = await compare(password, user.password);
    if (!isValidPassword) {
        return res.status(401).json({ 
            error: 'Invalid email or password' 
        });

    }
    const token: string = jwt.sign(
        {
            userId: user.id,
            role: user.role,
            organizationId: user.organizationId
        },
        JWT_SECRET,
        { expiresIn: '24h' } as SignOptions
    );

    res.json({ token });
});

export default router;
