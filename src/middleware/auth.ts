import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      organizationId: string;
      email: string;
      role: 'STUDENT' | 'ADMIN' | 'MASTER_ADMIN';
      approved: boolean;
      name?: string;
    };

    req.user = decoded;

    // If user admin and not approved, deny access
    if (req.user.role === 'ADMIN' && !req.user.approved) {
      return res.status(403).json({ error: 'Admin account not approved yet' });
    }

    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Middleware for all admins
export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  if (req.user) {
    if (req.user.role !== 'ADMIN' && req.user.role !== 'MASTER_ADMIN') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
    return next();
  }
  return res.status(403).json({ error: 'Access denied. Not logged in.' });
};

// Middleware for master admin only
export const masterAdminOnly = (req: Request, res: Response, next: NextFunction) => {
    if (req.user) {

    if (req.user.role !== 'MASTER_ADMIN') {
        return res.status(403).json({
            error: 'Access denied. Master Admins only.' 
        });
    }
    return next();
    }
    return res.status(403).json({
        error: 'Access denied. Not logged in.' 
    });
};
