import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import type { JwtPayload } from '../types/index.js'

declare global {
  namespace Express {
    interface Request {
      userId: string
      userEmail: string
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = extractToken(req)
  if (!token) {
    res.status(401).json({ message: 'Token não fornecido' })
    return
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
    req.userId = payload.userId
    req.userEmail = payload.email
    next()
  } catch {
    res.status(401).json({ message: 'Token inválido ou expirado' })
  }
}

function extractToken(req: Request): string | null {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) return null
  return auth.split(' ')[1]
}
