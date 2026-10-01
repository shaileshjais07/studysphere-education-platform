import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
export type AuthRequest = Request & { user?: { id:string; role:Role; email:string } };
export function requireAuth(req:AuthRequest,res:Response,next:NextFunction){ const h=req.headers.authorization; if(!h?.startsWith('Bearer ')) return res.status(401).json({error:'Authentication required'}); try { const p:any=jwt.verify(h.slice(7),process.env.JWT_SECRET!); req.user={id:p.id,role:p.role,email:p.email}; next(); } catch { return res.status(401).json({error:'Invalid or expired token'}); } }
export function requireRoles(...roles:Role[]){ return (req:AuthRequest,res:Response,next:NextFunction)=>{ if(!req.user) return res.status(401).json({error:'Authentication required'}); if(!roles.includes(req.user.role)) return res.status(403).json({error:'Forbidden'}); next(); }; }
