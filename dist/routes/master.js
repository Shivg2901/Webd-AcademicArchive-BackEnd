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
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Approve an admin by the Master Admin
router.get('/pending-admins', auth_1.authMiddleware, auth_1.masterAdminOnly, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pendingAdmins = yield db_1.prismaClient.user.findMany({
            where: { role: 'ADMIN',
                approved: false },
        });
        res.json(pendingAdmins);
    }
    catch (error) {
        res.status(500).json({ error: 'Error approving admin' });
    }
}));
router.put('/approve-admin/:id', auth_1.authMiddleware, auth_1.masterAdminOnly, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedAdmin = yield db_1.prismaClient.user.update({
            where: { id: req.params.id },
            data: { approved: true },
        });
        res.status(200).json(updatedAdmin);
    }
    catch (error) {
        res.status(500).json({ error: 'Error approving admin' });
    }
}));
// Remove an admin by the Master Admin
router.delete('/admin/:id', auth_1.authMiddleware, auth_1.masterAdminOnly, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const adminToDelete = yield db_1.prismaClient.user.findUnique({
            where: { id },
        });
        if (!adminToDelete) {
            return res.status(404).json({ error: 'Admin not found' });
        }
        // Prevent the master admin from removing themselves
        if (adminToDelete.role === 'MASTER_ADMIN') {
            return res.status(403).json({ error: 'You cannot remove yourself as the Master Admin' });
        }
        yield db_1.prismaClient.user.delete({
            where: { id },
        });
        res.status(200).json({ message: 'Admin removed successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Error removing admin' });
    }
}));
exports.default = router;
