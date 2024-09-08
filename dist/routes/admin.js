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
router.get('/', auth_1.authMiddleware, auth_1.adminOnly, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.organizationId) {
        return res.json({
            message: "Unauthorized"
        });
    }
    const submissions = yield db_1.prismaClient.submission.findMany({
        where: {
            status: 'PENDING', organizationId: req.user.organizationId
        },
    });
    res.json(submissions);
}));
router.put('/:id/approve', auth_1.authMiddleware, auth_1.adminOnly, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const submission = yield db_1.prismaClient.submission.update({
        where: { id },
        data: {
            status: 'APPROVED'
        },
    });
    res.json(submission);
}));
router.put('/:id/reject', auth_1.authMiddleware, auth_1.adminOnly, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const submission = yield db_1.prismaClient.submission.update({
        where: { id },
        data: {
            status: 'REJECTED'
        },
    });
    res.json(submission);
}));
router.put('/:id', auth_1.authMiddleware, auth_1.adminOnly, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updatedSubmission = yield db_1.prismaClient.submission.update({
        where: { id },
        data: req.body,
    });
    res.json(updatedSubmission);
}));
router.delete('/:id', auth_1.authMiddleware, auth_1.adminOnly, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield db_1.prismaClient.submission.delete({
        where: { id }
    });
    res.json({
        message: 'Submission deleted'
    });
}));
exports.default = router;
