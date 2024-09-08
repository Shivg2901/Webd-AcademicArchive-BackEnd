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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("../config/db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const router = express_1.default.Router();
router.post('/create-admin-org', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { organizationName, adminEmail, adminPassword } = req.body;
    if (!organizationName || !adminEmail || !adminPassword) {
        return res.status(400).json({
            message: 'Organization name, admin email, and admin password are required'
        });
    }
    try {
        const hashedPassword = yield bcryptjs_1.default.hash(adminPassword, 10);
        const result = yield db_1.prismaClient.$transaction([
            db_1.prismaClient.organization.create({
                data: {
                    name: organizationName,
                },
            }),
            db_1.prismaClient.user.create({
                data: {
                    email: adminEmail,
                    password: hashedPassword,
                    role: 'ADMIN',
                    organization: {
                        create: {
                            name: organizationName,
                        },
                    },
                },
            }),
        ]);
        res.status(201).json({
            message: 'Organization and Admin created successfully',
            organization: result[0],
            admin: result[1],
        });
    }
    catch (error) {
        //console.log(error);
        res.status(500).json({
            message: 'Error creating organization or admin'
        });
    }
}));
exports.default = router;
