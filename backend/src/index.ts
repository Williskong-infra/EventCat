import express, { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma';
import authRoutes from './routes/auth';
import eventRoutes from './routes/event';
import categoryRoutes from './routes/category';

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3001;

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/categories', categoryRoutes);

app.get('/api/health', (req: Request, res: Response) => {
  res.send('Server is running');
});

const main = async () => {
  try {
    const generalCategory = await prisma.category.findUnique({
      where: { name: 'General' },
    });

    if (!generalCategory) {
      const newCategory = await prisma.category.create({
        data: { name: 'General' },
      });
      console.log('Created default category:', newCategory);
    } else {
      console.log('Default category already exists:', generalCategory);
    }
  } catch (error) {
    console.error('Error creating default category:', error);
  }

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};

main(); 