import { Request, Response } from 'express';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

// @desc    Create an event
// @route   POST /api/events
// @access  Private
export const createEvent = async (req: Request, res: Response) => {
  const { title, description, date, location, categoryId, imageUrl } = req.body;
  const organizerId = req.userId;

  if (!title || !date || !location || !categoryId) {
    res.status(400).json({ message: 'Please provide all required fields' });
    return;
  }

  if (!organizerId) {
    res.status(401).json({ message: 'User not authorized' });
    return;
  }

  const event = await prisma.event.create({
    data: {
      title,
      description,
      date: new Date(date),
      location,
      organizerId,
      categoryId,
      imageUrl,
    },
  });

  if (!event) {
    res.status(404).json({ message: 'Event not found' });
    return;
  }

  res.status(201).json(event);
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getEvents = async (req: Request, res: Response) => {
  const events = await prisma.event.findMany({
    include: {
      organizer: { select: { id: true, name: true } },
      category: true,
    },
  });
  res.json(events);
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      organizer: { select: { id: true, name: true } },
      category: true,
      tickets: true,
    },
  });

  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  res.json(event);
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private
export const updateEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, date, location, categoryId, imageUrl } = req.body;
  const organizerId = req.userId;

  const event = await prisma.event.findUnique({ where: { id } });

  if (!event) {
    res.status(404).json({ message: 'Event not found' });
    return;
  }

  if (event.organizerId !== organizerId) {
    res.status(401).json({ message: 'User not authorized' });
    return;
  }

  const updatedEvent = await prisma.event.update({
    where: { id },
    data: { title, description, date: date ? new Date(date) : undefined, location, categoryId, imageUrl },
  });

  res.json(updatedEvent);
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private
export const deleteEvent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const organizerId = req.userId;

  const event = await prisma.event.findUnique({ where: { id } });

  if (!event) {
    res.status(404).json({ message: 'Event not found' });
    return;
  }

  if (event.organizerId !== organizerId) {
    res.status(401).json({ message: 'User not authorized' });
    return;
  }

  await prisma.event.delete({ where: { id } });

  res.json({ message: 'Event removed' });
}; 