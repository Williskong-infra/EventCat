import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../../generated/prisma';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import crypto from 'crypto';

const prisma = new PrismaClient();

const ses = new SESClient({
  region: process.env.AWS_SES_REGION,
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY!,
  },
});

const SENDER_EMAIL = process.env.AWS_SES_SENDER_EMAIL!;

async function sendVerificationEmail(email: string, code: string) {
  const params = {
    Destination: { ToAddresses: [email] },
    Message: {
      Body: {
        Text: { Data: `Your EventCat verification code is: ${code}` },
      },
      Subject: { Data: 'EventCat Email Verification' },
    },
    Source: SENDER_EMAIL,
  };
  await ses.send(new SendEmailCommand(params));
}

export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' });
    return;
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verifyCode = crypto.randomInt(100000, 999999).toString();
    const verifyCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Create user first
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        emailVerified: false,
        verifyCode,
        verifyCodeExpires,
      },
    });

    try {
      await sendVerificationEmail(email, verifyCode);
    } catch (emailErr) {
      // Roll back user creation if email fails
      await prisma.user.delete({ where: { id: user.id } });
      console.error('Verification email failed, user creation rolled back:', emailErr);
      return res.status(500).json({ message: 'Failed to send verification email. User not created.', error: emailErr });
    }

    res.status(201).json({ message: 'User created successfully. Please check your email for the verification code.', userId: user.id });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ email: user.email, id: user.id }, 'secret', { expiresIn: '1h' });

    res.status(200).json({ result: { id: user.id, email: user.email }, token });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    console.log('verifyEmail called with body:', req.body);
    const { email, code } = req.body;
    if (!email || !code) {
      console.log('Missing email or code');
      return res.status(400).json({ message: 'Email and code are required' });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    console.log('User found:', user);
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ message: 'User not found' });
    }
    if (user.emailVerified) {
      console.log('Email already verified');
      return res.status(400).json({ message: 'Email already verified' });
    }
    if (!user.verifyCode || !user.verifyCodeExpires || user.verifyCode !== code) {
      console.log('Invalid verification code', { userVerifyCode: user.verifyCode, userVerifyCodeExpires: user.verifyCodeExpires, code });
      return res.status(400).json({ message: 'Invalid verification code' });
    }
    if (user.verifyCodeExpires < new Date()) {
      console.log('Verification code expired', { verifyCodeExpires: user.verifyCodeExpires, now: new Date() });
      return res.status(400).json({ message: 'Verification code expired' });
    }
    console.log('Updating user to set emailVerified true');
    await prisma.user.update({
      where: { email },
      data: {
        emailVerified: true,
        verifyCode: null,
        verifyCodeExpires: null,
      },
    });
    console.log('Email verified successfully for', email);
    res.json({ message: 'Email verified successfully' });
  } catch (err) {
    console.error('Error in verifyEmail:', err);
    res.status(500).json({ message: 'Internal server error', error: err });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  // Check if any events use this category
  const eventCount = await prisma.event.count({ where: { categoryId: id } });
  if (eventCount > 0) {
    res.status(400).json({ message: 'Cannot delete category: it is used by one or more events.' });
    return;
  }
  await prisma.category.delete({ where: { id } });
  res.json({ message: 'Category deleted' });
}; 