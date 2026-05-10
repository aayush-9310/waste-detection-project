import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export function verifyAdmin(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'No token provided' })
        return
    }

const token = authHeader.split(' ')[1]

if (!token) {
    res.status(401).json({ error: 'No token provided' })
    return
}


    try {
          const secret = process.env.JWT_SECRET ?? 'fallback_secret'
const decoded = jwt.verify(token, secret)
        next()
    } catch (e) {
        res.status(401).json({ error: 'Invalid or expired token' })
    }
}   