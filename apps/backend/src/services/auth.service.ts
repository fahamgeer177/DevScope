// ============================================
// DevScope — Authentication Service
// ============================================
// Handles user registration, login, token creation/verification,
// session management, and logout.

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { prisma } from '../config/database.js';
import { config } from '../config/index.js';
import { AppError } from '../types/index.js';
import type { JwtPayload } from '../types/index.js';
import { parseDurationMs } from '../utils/helpers.js';

const SALT_ROUNDS = 12;

// ── Registration ────────────────────────────────────────────────

export async function registerUser(
  email: string,
  username: string,
  password: string,
): Promise<{ user: { id: string; email: string; username: string }; accessToken: string; refreshToken: string }> {
  // Check for existing email
  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) {
    throw AppError.conflict('An account with this email already exists');
  }

  // Check for existing username
  const existingUsername = await prisma.user.findUnique({ where: { username } });
  if (existingUsername) {
    throw AppError.conflict('This username is already taken');
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // Create user
  const user = await prisma.user.create({
    data: { email, username, passwordHash },
    select: { id: true, email: true, username: true },
  });

  // Generate tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = await createSession(user.id);

  return { user, accessToken, refreshToken };
}

// ── Login ───────────────────────────────────────────────────────

export async function loginUser(
  email: string,
  password: string,
  meta?: { userAgent?: string; ipAddress?: string },
): Promise<{ user: { id: string; email: string; username: string }; accessToken: string; refreshToken: string }> {
  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, username: true, passwordHash: true },
  });

  if (!user) {
    throw AppError.unauthorized('Invalid email or password');
  }

  // Verify password
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw AppError.unauthorized('Invalid email or password');
  }

  const publicUser = { id: user.id, email: user.email, username: user.username };

  // Generate tokens
  const accessToken = generateAccessToken(publicUser);
  const refreshToken = await createSession(user.id, meta);

  return { user: publicUser, accessToken, refreshToken };
}

// ── Logout ──────────────────────────────────────────────────────

export async function logoutUser(refreshToken: string): Promise<void> {
  await prisma.session.deleteMany({
    where: { refreshToken },
  });
}

export async function logoutAllSessions(userId: string): Promise<void> {
  await prisma.session.deleteMany({
    where: { userId },
  });
}

// ── Token Refresh ───────────────────────────────────────────────

export async function refreshAccessToken(
  refreshToken: string,
): Promise<{ accessToken: string; refreshToken: string }> {
  // Find the session
  const session = await prisma.session.findUnique({
    where: { refreshToken },
    include: { user: { select: { id: true, email: true, username: true } } },
  });

  if (!session) {
    throw AppError.unauthorized('Invalid refresh token');
  }

  // Check expiry
  if (new Date() > session.expiresAt) {
    // Clean up expired session
    await prisma.session.delete({ where: { id: session.id } });
    throw AppError.unauthorized('Refresh token has expired');
  }

  // Rotate refresh token (security best practice)
  const newRefreshToken = generateRefreshTokenString();
  const expiresAt = new Date(Date.now() + parseDurationMs(config.JWT_REFRESH_EXPIRES_IN));

  await prisma.session.update({
    where: { id: session.id },
    data: { refreshToken: newRefreshToken, expiresAt },
  });

  const accessToken = generateAccessToken(session.user);

  return { accessToken, refreshToken: newRefreshToken };
}

// ── Get Current User ────────────────────────────────────────────

export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, username: true, createdAt: true },
  });

  if (!user) {
    throw AppError.notFound('User not found');
  }

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    createdAt: user.createdAt.toISOString(),
  };
}

// ── Token Helpers ───────────────────────────────────────────────

function generateAccessToken(user: { id: string; email: string; username: string }): string {
  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    username: user.username,
  };

  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  });
}

function generateRefreshTokenString(): string {
  return crypto.randomBytes(64).toString('hex');
}

async function createSession(
  userId: string,
  meta?: { userAgent?: string; ipAddress?: string },
): Promise<string> {
  // Cleanup old expired sessions for this user
  await prisma.session.deleteMany({
    where: { userId, expiresAt: { lt: new Date() } },
  });

  const refreshToken = generateRefreshTokenString();
  const expiresAt = new Date(Date.now() + parseDurationMs(config.JWT_REFRESH_EXPIRES_IN));

  await prisma.session.create({
    data: {
      userId,
      refreshToken,
      userAgent: meta?.userAgent,
      ipAddress: meta?.ipAddress,
      expiresAt,
    },
  });

  return refreshToken;
}

/**
 * Cleanup all expired sessions from the database.
 */
export async function cleanupExpiredSessions(): Promise<number> {
  const result = await prisma.session.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
  return result.count;
}
