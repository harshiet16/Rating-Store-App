import { User as PrismaUser } from '@prisma/client';
import prisma from '../config/db';

export type User = PrismaUser;

export const UserModel = prisma.user;
