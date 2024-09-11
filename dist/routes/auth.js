"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../config/db");
const router = express_1.default.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';
//role based registration
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, role, organizationId } = req.body;
    if (!email || !password || !role || !organizationId) {
        return res.status(400).json({
            message: "Missing field",
        });
    }
    try {
        const hashedPassword = yield (0, bcryptjs_1.hash)(password, 10);
        const user = yield db_1.prismaClient.user.create({
            data: {
                email,
                password: hashedPassword,
                role,
                approved: role === 'STUDENT' ? true : false,
                organizationId,
            },
        });
        const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
        return res.status(201).json({
            message: 'User created successfully',
            user: userWithoutPassword,
        });
    }
    catch (error) {
        return res.status(400).json({
            error: 'Email already exists or invalid data',
        });
    }
}));
//login and get jwt
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield db_1.prismaClient.user.findUnique({
        where: {
            email
        }
    });
    if (!user) {
        return res.status(401).json({
            error: 'Invalid email or password'
        });
    }
    if (user.role === 'ADMIN' && !user.approved) {
        return res.status(410).json({
            error: "Admin not approved"
        });
    }
    const isValidPassword = yield (0, bcryptjs_1.compare)(password, user.password);
    if (!isValidPassword) {
        return res.status(401).json({
            error: 'Invalid email or password'
        });
    }
    const token = jsonwebtoken_1.default.sign({
        userId: user.id,
        role: user.role,
        organizationId: user.organizationId,
        approved: user.approved
    }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
}));
exports.default = router;
