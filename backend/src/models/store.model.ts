import { Store as PrismaStore } from '@prisma/client';
import prisma from '../config/db';

export type Store = PrismaStore;

export const StoreModel = prisma.store;
