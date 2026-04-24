import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../config/db';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { name, email, address, role, sortField, sortOrder, page = 1, limit = 10 } = req.query;

    const where: any = {};
    if (name) where.name = { contains: String(name), mode: 'insensitive' };
    if (email) where.email = { contains: String(email), mode: 'insensitive' };
    if (address) where.address = { contains: String(address), mode: 'insensitive' };
    if (role) where.role = role;

    const orderBy: any = {};
    if (sortField) {
      orderBy[String(sortField)] = sortOrder === 'desc' ? 'desc' : 'asc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy,
        skip,
        take: Number(limit),
        select: { 
          id: true, 
          name: true, 
          email: true, 
          address: true, 
          role: true, 
          createdAt: true,
          stores: {
            select: {
              ratings: {
                select: { rating: true }
              }
            }
          }
        },
      }),
      prisma.user.count({ where }),
    ]);

    const usersWithRatings = users.map(u => {
      if (u.role === 'STORE_OWNER' && u.stores.length > 0) {
        let totalRating = 0;
        let ratingCount = 0;
        u.stores.forEach(s => {
          s.ratings.forEach(r => {
            totalRating += r.rating;
            ratingCount++;
          });
        });
        return {
          ...u,
          stores: undefined,
          averageRating: ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : 'N/A'
        };
      }
      return { ...u, stores: undefined };
    });

    res.status(200).json({
      success: true,
      data: usersWithRatings,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
      },
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, address, role } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, address, role },
      select: { id: true, name: true, email: true, role: true },
    });

    res.status(201).json({ success: true, message: 'User created successfully', data: user });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getUserDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        stores: {
          select: { id: true, name: true },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'STORE_OWNER') {
      const storesWithRating = await Promise.all(
        user.stores.map(async (store) => {
          const aggregations = await prisma.rating.aggregate({
            _avg: { rating: true },
            where: { storeId: store.id },
          });
          return {
            ...store,
            averageRating: aggregations._avg.rating || 0,
          };
        })
      );
      return res.status(200).json({ success: true, data: { ...user, stores: storesWithRating } });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
export const updatePassword = async (req: Request, res: Response) => {
  try {
    const { id } = (req as any).user;
    const { oldPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect current password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword }
    });

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
