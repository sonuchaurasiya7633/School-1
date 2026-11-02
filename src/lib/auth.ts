import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { UserRole } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_school_management_2026_sps';

export interface TokenPayload {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: UserRole;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (err) {
    return null;
  }
}

export function getUserFromRequest(req: NextRequest): TokenPayload | null {
  // 1. Check Authorization Header
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const user = verifyToken(token);
    if (user) return user;
  }

  // 2. Check Cookie
  const cookie = req.cookies.get('token');
  if (cookie?.value) {
    const user = verifyToken(cookie.value);
    if (user) return user;
  }

  return null;
}

export function authorizeRoles(req: NextRequest, allowedRoles: UserRole[]): { authorized: boolean; user?: TokenPayload; message?: string } {
  const user = getUserFromRequest(req);
  if (!user) {
    return { authorized: false, message: 'Unauthorized. Please log in.' };
  }
  if (!allowedRoles.includes(user.role)) {
    return { authorized: false, user, message: 'Forbidden: Insufficient permissions.' };
  }
  return { authorized: true, user };
}
