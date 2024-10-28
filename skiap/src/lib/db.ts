import { db } from '../db/database';
import bcrypt from 'bcryptjs';

export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  age?: number;
  createdAt: Date;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}

function generateToken(userId: number): string {
  return btoa(`user-${userId}-${Date.now()}`);
}

export async function createUser(
  name: string,
  email: string,
  password: string,
  age?: number
): Promise<AuthResponse> {
  try {
    const existingUser = await db.users.where('email').equals(email).first();
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userData: User = {
      name,
      email,
      password: hashedPassword,
      age: age ? Number(age) : undefined,
      createdAt: new Date()
    };
    
    const id = await db.users.add(userData);
    const token = generateToken(id as number);
    
    const { password: _, ...userWithoutPassword } = userData;
    return { 
      user: { ...userWithoutPassword, id: id as number },
      token 
    };
  } catch (error) {
    console.error('User creation error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to create user');
  }
}

export async function loginUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    const user = await db.users.where('email').equals(email).first();
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('Invalid password');
    }
    
    const token = generateToken(user.id as number);
    const { password: _, ...userWithoutPassword } = user;
    
    return { user: userWithoutPassword, token };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function getUserById(id: number): Promise<Omit<User, 'password'> | null> {
  try {
    const user = await db.users.get(id);
    if (!user) return null;
    
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Get user error:', error);
    throw error;
  }
}

export function verifyToken(token: string): { userId: number } {
  try {
    const decoded = atob(token);
    const match = decoded.match(/^user-(\d+)-\d+$/);
    if (!match) throw new Error('Invalid token format');
    return { userId: parseInt(match[1], 10) };
  } catch (error) {
    console.error('Token verification error:', error);
    throw new Error('Invalid token');
  }
}