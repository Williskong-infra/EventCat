import { Request, Response } from 'express';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

export const createOrder = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { event: true } } },
  });
  if (!cart || !cart.items.length) return res.status(400).json({ message: 'Cart is empty' });
  const total = cart.items.reduce((sum, item) => sum + (item.event.price || 0) * item.quantity, 0);
  const order = await prisma.order.create({
    data: {
      userId,
      total,
      status: 'pending',
      items: {
        create: cart.items.map(item => ({
          eventId: item.eventId,
          quantity: item.quantity,
          price: item.event.price || 0,
        })),
      },
    },
    include: { items: true },
  });
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  res.json(order);
};

export const getOrders = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: { include: { event: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json(orders);
};

export const getOrderById = async (req: Request, res: Response) => {
  const userId = req.userId;
  const { id } = req.params;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { event: true } } },
  });
  if (!order || order.userId !== userId) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
}; 