import express, { Request, Response } from 'express';
import { prismaClient } from '../config/db';
import { adminOnly } from '../middleware/auth';

const router = express.Router();

//admin creates category
router.post('/create', adminOnly, async (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      message: 'Category name is required' 
    });
  }

  try {
    const category = await prismaClient.category.create({
      data: { name } 
    });

    return res.status(201).json({
      message: 'Category creted', category 
    });

  } catch (error) {
    return res.status(400).json({
      error: 'Error creating category' 
    });
  }
});

//fetch categories
router.get('/', async (req: Request, res: Response) => {
  try {
    const categories = await prismaClient.category.findMany();

    return res.status(200).json(categories);

  } catch (error) {
    return res.status(400).json({
      error: 'Error fetching categories' 
    });
  }
});

export default router;
