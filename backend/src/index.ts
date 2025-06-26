import express, { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma';
import authRoutes from './routes/auth';
import eventRoutes from './routes/event';
import categoryRoutes from './routes/category';
import uploadRoutes from './routes/upload';
import path from 'path';
import cartRoutes from './routes/cart';
import orderRoutes from './routes/order';

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3001;

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/categories', categoryRoutes);
console.log('DEBUG: __dirname =', __dirname);
const mediaPath = path.join(__dirname, '../media');
console.log('DEBUG: Serving media from:', mediaPath);
app.use('/media', (req, res, next) => {
  const filePath = path.join(mediaPath, req.url);
  console.log('DEBUG: Looking for file:', filePath);
  next();
}, express.static(mediaPath));
app.use('/api/upload', uploadRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

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