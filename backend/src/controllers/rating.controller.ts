import { Request, Response } from 'express';
import { ratingService } from '../services/rating.service';
import prisma from '../config/db';

export const submitRating = async (req: Request, res: Response) => {
  try {
    const { storeId, rating } = req.body;
    const userId = req.user!.id;

    const store = await prisma.store.findUnique({ where: { id: storeId } });
    if (!store) {
      return res.status(404).json({ success: false, message: 'Store not found' });
    }

    const existingRating = await ratingService.checkExistingRating(userId, storeId);

    if (existingRating) {
      return res.status(400).json({ success: false, message: 'You have already rated this store. Use the update endpoint.' });
    }

    const newRating = await ratingService.createRating(userId, storeId, rating);

    res.status(201).json({ success: true, message: 'Rating submitted successfully', data: newRating });
  } catch (error) {
    console.error('Submit rating error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const updateRating = async (req: Request, res: Response) => {
  try {
    const { rating } = req.body;
    const { storeId } = req.params;
    const userId = req.user!.id;

    const existingRating = await ratingService.checkExistingRating(userId, storeId);

    if (!existingRating) {
      return res.status(404).json({ success: false, message: 'Rating not found' });
    }

    const updatedRating = await ratingService.updateRating(existingRating.id, rating);

    res.status(200).json({ success: true, message: 'Rating updated successfully', data: updatedRating });
  } catch (error) {
    console.error('Update rating error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
