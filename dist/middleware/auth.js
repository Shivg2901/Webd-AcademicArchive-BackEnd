"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.masterAdminOnly = exports.adminOnly = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        // If user admin and not approved, deny access
        if (req.user.role === 'ADMIN' && !req.user.approved) {
            return res.status(403).json({ error: 'Admin account not approved yet' });
        }
        next();
    }
    catch (error) {
        return res.status(403).json({ error: 'Invalid token' });
    }
};
exports.authMiddleware = authMiddleware;
// Middleware for all admins
const adminOnly = (req, res, next) => {
    if (req.user) {
        if (req.user.role !== 'ADMIN' && req.user.role !== 'MASTER_ADMIN') {
            return res.status(403).json({ error: 'Access denied. Admins only.' });
        }
        return next();
    }
    return res.status(403).json({ error: 'Access denied. Not logged in.' });
};
exports.adminOnly = adminOnly;
// Middleware for master admin only
const masterAdminOnly = (req, res, next) => {
    if (req.user) {
        if (req.user.role !== 'MASTER_ADMIN') {
            return res.status(403).json({
                error: 'Access denied. Master Admins only.'
            });
        }
        return next();
    }
    return res.status(403).json({
        error: 'Access denied. Not logged in.'
    });
};
exports.masterAdminOnly = masterAdminOnly;
