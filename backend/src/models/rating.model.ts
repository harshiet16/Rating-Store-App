import { Rating as PrismaRating } from '@prisma/client';
import prisma from '../config/db';

export type Rating = PrismaRating;

export const RatingModel = prisma.rating;
