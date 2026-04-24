import prisma from '../config/db';

export const ratingService = {
  checkExistingRating: async (userId: string, storeId: string) => {
    return prisma.rating.findUnique({
      where: {
        userId_storeId: { userId, storeId },
      },
    });
  },

  createRating: async (userId: string, storeId: string, rating: number) => {
    return prisma.rating.create({
      data: { userId, storeId, rating },
    });
  },

  updateRating: async (ratingId: string, rating: number) => {
    return prisma.rating.update({
      where: { id: ratingId },
      data: { rating },
    });
  }
};
