import { Request, Response } from 'express';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req: Request, res: Response) => {
  const categories = await prisma.category.findMany();
  res.json(categories);
};

// @desc    Add a new category
// @route   POST /api/categories
// @access  Public (or protect if needed)
export const addCategory = async (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).json({ message: 'Category name is required' });
    return;
  }
  const existing = await prisma.category.findUnique({ where: { name } });
  if (existing) {
    res.status(400).json({ message: 'Category already exists' });
    return;
  }
  const category = await prisma.category.create({ data: { name } });
  res.status(201).json(category);
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Public (or protect if needed)
export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) {
    res.status(400).json({ message: 'Category name is required' });
    return;
  }
  const category = await prisma.category.update({ where: { id }, data: { name } });
  res.json(category);
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Public (or protect if needed)
export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.category.delete({ where: { id } });
  res.json({ message: 'Category deleted' });
}; 