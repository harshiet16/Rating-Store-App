import { Request, Response } from 'express';
import prisma from '../config/db';

export const createStore = async (req: Request, res: Response) => {
  try {
    const { name, email, address, ownerId } = req.body;

    const existingStore = await prisma.store.findUnique({ where: { email } });
    if (existingStore) {
      return res.status(400).json({ success: false, message: 'Store email already exists' });
    }

    const owner = await prisma.user.findUnique({ where: { id: ownerId } });
    if (!owner || owner.role !== 'STORE_OWNER') {
      return res.status(400).json({ success: false, message: 'Invalid owner ID or user is not a STORE OWNER' });
    }

    const store = await prisma.store.create({
      data: { name, email, address, ownerId },
    });

    res.status(201).json({ success: true, message: 'Store created successfully', data: store });
  } catch (error) {
    console.error('Create store error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getStores = async (req: Request, res: Response) => {
  try {
    const { name, address, sortField, sortOrder, page = 1, limit = 10 } = req.query;

    const where: any = {};
    if (name) where.name = { contains: String(name), mode: 'insensitive' };
    if (address) where.address = { contains: String(address), mode: 'insensitive' };

    const skip = (Number(page) - 1) * Number(limit);

    const [stores, total] = await Promise.all([
      prisma.store.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          owner: { select: { id: true, name: true } },
          ratings: { select: { rating: true, userId: true } }, // Include all ratings to compute avg and current user's rating
        },
      }),
      prisma.store.count({ where }),
    ]);

    // Format the response: calculate average rating
    // Also include the current user's rating if the requester is a USER
    const currentUserId = req.user?.id;

    const formattedStores = stores.map((store) => {
      const totalRatings = store.ratings.length;
      const sumRatings = store.ratings.reduce((acc, curr) => acc + curr.rating, 0);
      const averageRating = totalRatings > 0 ? (sumRatings / totalRatings).toFixed(1) : 0;

      let myRating = null;
      if (currentUserId) {
        const userRating = store.ratings.find((r) => r.userId === currentUserId);
        if (userRating) myRating = userRating.rating;
      }

      // Sort logic for custom computed field `rating` could be done in JS or advanced Prisma query
      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        owner: store.owner,
        averageRating: Number(averageRating),
        myRating, // Will be null for ADMIN or if user hasn't rated
      };
    });

    // Custom sorting if requested for `rating`
    if (sortField === 'rating') {
      formattedStores.sort((a, b) => {
        if (sortOrder === 'desc') return b.averageRating - a.averageRating;
        return a.averageRating - b.averageRating;
      });
    } else if (sortField) {
      formattedStores.sort((a: any, b: any) => {
        const valA = String(a[String(sortField)]).toLowerCase();
        const valB = String(b[String(sortField)]).toLowerCase();
        if (valA < valB) return sortOrder === 'desc' ? 1 : -1;
        if (valA > valB) return sortOrder === 'desc' ? -1 : 1;
        return 0;
      });
    }

    res.status(200).json({
      success: true,
      data: formattedStores,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
      },
    });
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getOwnerDashboard = async (req: Request, res: Response) => {
  try {
    const ownerId = req.user!.id;

    const stores = await prisma.store.findMany({
      where: { ownerId },
      include: {
        ratings: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    const formattedStores = stores.map((store) => {
      const totalRatings = store.ratings.length;
      const sumRatings = store.ratings.reduce((acc, curr) => acc + curr.rating, 0);
      const averageRating = totalRatings > 0 ? (sumRatings / totalRatings).toFixed(1) : 0;

      const raters = store.ratings.map((r) => ({
        ratingId: r.id,
        rating: r.rating,
        user: r.user,
        date: r.createdAt,
      }));

      return {
        id: store.id,
        name: store.name,
        averageRating: Number(averageRating),
        raters,
      };
    });

    res.status(200).json({ success: true, data: formattedStores });
  } catch (error) {
    console.error('Owner dashboard error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
