import { Request, Response, NextFunction } from 'express';
import { db, isDatabaseConnected } from '../src/db/index.ts';
import { users } from '../src/db/schema.ts';
import { eq } from 'drizzle-orm';
import { adminAuth } from '../src/lib/firebase-admin.ts';
import { verifySignedToken } from './security.ts';
import { devStore } from './devStore.ts';

export interface UserRecord {
  id: number;
  uid: string;
  email: string | null;
  fullName: string;
  role: string;
  gradeLevel: string | null;
  phoneNumber: string | null;
  avatarUrl: string | null;
  isActive: boolean;
}

export interface AuthenticatedRequest extends Request {
  user?: UserRecord;
}

// Security Headers Middleware
export function applySecurityHeaders(req: Request, res: Response, next: NextFunction) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
}

// Authentication middleware verifying cryptographic Firebase ID Token or signed session token
export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);

    // 1. Try Firebase Admin token verification
    try {
      const decoded = await adminAuth.verifyIdToken(token);
      if (decoded && decoded.uid) {
        const existing = await db.select().from(users).where(eq(users.uid, decoded.uid)).limit(1);
        if (existing.length > 0) {
          req.user = existing[0];
          return next();
        } else {
          // Auto-register new authenticated user in database
          const inserted = await db
            .insert(users)
            .values({
              uid: decoded.uid,
              email: decoded.email || null,
              fullName: decoded.name || 'Người dùng mới',
              role: 'STUDENT',
              gradeLevel: 'SECONDARY',
            })
            .returning();
          req.user = inserted[0];
          return next();
        }
      }
    } catch {
      // 2. Check if token is a cryptographically signed internal session token
      const verified = verifySignedToken(token);
      if (verified) {
        if (!isDatabaseConnected()) {
          const devUser = devStore.findUser(verified.uid);
          if (devUser && devUser.isActive) {
            req.user = devUser as any;
            return next();
          }
        } else {
          try {
            const found = await db.select().from(users).where(eq(users.uid, verified.uid)).limit(1);
            if (found.length > 0 && found[0].isActive) {
              req.user = found[0];
              return next();
            }
          } catch (err) {
            console.error('Database query error in requireAuth:', err);
          }
        }
      }
    }
  }

  return res.status(401).json({
    success: false,
    message: 'Yêu cầu xác thực tài khoản hợp lệ để truy cập.',
  });
}

// Scoped Role-Based Access Control (RBAC) Middleware
export function requireRoles(...allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Bạn chưa đăng nhập.',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Tài khoản với vai trò [${req.user.role}] không được phép thực hiện thao tác này. Quyền truy cập bị từ chối.`,
      });
    }

    next();
  };
}

// In-memory sliding rate limiter per IP/client
const requestBuckets = new Map<string, { count: number; expiresAt: number }>();

export function rateLimit(limit: number = 30, windowMs: number = 60000) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown-client';
    const key = `${ip}-${req.baseUrl || req.path}`;
    const now = Date.now();

    const record = requestBuckets.get(key);
    if (!record || now > record.expiresAt) {
      requestBuckets.set(key, { count: 1, expiresAt: now + windowMs });
      return next();
    }

    if (record.count >= limit) {
      return res.status(429).json({
        success: false,
        message: 'Bạn gửi yêu cầu quá nhanh. Vui lòng thử lại sau giây lát.',
      });
    }

    record.count++;
    next();
  };
}

// Specific Brute-Force Tracker for failed code lookups
const failedLookupAttempts = new Map<string, { count: number; blockedUntil: number }>();

export function trackFailedLookup(ip: string): boolean {
  const now = Date.now();
  const entry = failedLookupAttempts.get(ip) || { count: 0, blockedUntil: 0 };

  if (now < entry.blockedUntil) {
    return true; // Already blocked
  }

  entry.count += 1;
  if (entry.count >= 6) {
    entry.blockedUntil = now + 10 * 60 * 1000; // 10 minutes lockout
    failedLookupAttempts.set(ip, entry);
    return true;
  }

  failedLookupAttempts.set(ip, entry);
  return false;
}

export function isLookupBlocked(ip: string): boolean {
  const entry = failedLookupAttempts.get(ip);
  if (!entry) return false;
  return Date.now() < entry.blockedUntil;
}

export function resetLookupFailure(ip: string) {
  failedLookupAttempts.delete(ip);
}
