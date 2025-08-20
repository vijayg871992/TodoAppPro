"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'todoapppro-secret-2025');
        const user = await User_1.default.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(401).json({ error: 'Invalid token. User not found.' });
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Invalid token.' });
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=auth.js.map