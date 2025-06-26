import { Request, Response } from 'express';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

export const getCart = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { event: true } } },
  });
  if (!cart) {
    await prisma.cart.create({ data: { userId } });
    cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { event: true } } },
    });
  }
  res.json(cart);
};

export const addToCart = async (req: Request, res: Response) => {
  const userId = req.userId;
  const { eventId, quantity } = req.body;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }
  let item = await prisma.cartItem.findFirst({ where: { cartId: cart.id, eventId } });
  if (item) {
    item = await prisma.cartItem.update({ where: { id: item.id }, data: { quantity: item.quantity + (quantity || 1) } });
  } else {
    item = await prisma.cartItem.create({ data: { cartId: cart.id, eventId, quantity: quantity || 1 } });
  }
  res.json(item);
};

export const updateCartItem = async (req: Request, res: Response) => {
  const userId = req.userId;
  const { cartItemId, quantity } = req.body;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  const item = await prisma.cartItem.update({ where: { id: cartItemId }, data: { quantity } });
  res.json(item);
};

export const removeCartItem = async (req: Request, res: Response) => {
  const userId = req.userId;
  const { cartItemId } = req.body;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  await prisma.cartItem.delete({ where: { id: cartItemId } });
  res.json({ message: 'Item removed' });
};

export const clearCart = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (cart) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }
  res.json({ message: 'Cart cleared' });
}; 