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
router.get('/dashboard', auth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const submissions = yield db_1.prismaClient.submission.findMany({
        where: {
            organizationId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.organizationId,
            status: 'APPROVED',
        },
    });
    res.json(submissions);
}));
router.post('/upload', auth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    const { title, description, fileUrl, categoryId } = req.body;
    if (!req.user || !((_b = req.user) === null || _b === void 0 ? void 0 : _b.organizationId) || !((_c = req.user) === null || _c === void 0 ? void 0 : _c.userId)) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    if (!categoryId) {
        return res.status(400).json({ message: 'Category is required' });
    }
    try {
        const submission = yield db_1.prismaClient.submission.create({
            data: {
                title,
                description,
                fileUrl,
                status: 'PENDING',
                studentId: req.user.userId,
                organizationId: req.user.organizationId,
                categoryId,
            },
        });
        res.status(201).json(submission);
    }
    catch (error) {
        res.status(400).json({ error: 'Error uploading submission' });
    }
}));
router.put('/submission/:id/category', auth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { categoryId } = req.body;
    if (!categoryId) {
        return res.status(400).json({ message: 'Category is required' });
    }
    try {
        const submission = yield db_1.prismaClient.submission.update({
            where: { id },
            data: { categoryId },
        });
        res.status(200).json(submission);
    }
    catch (error) {
        res.status(400).json({ error: 'Error updating submission category' });
    }
}));
router.get('/submissions/category/:categoryId', auth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const { categoryId } = req.params;
    try {
        const submissions = yield db_1.prismaClient.submission.findMany({
            where: {
                categoryId,
                organizationId: (_d = req.user) === null || _d === void 0 ? void 0 : _d.organizationId,
                status: 'APPROVED',
            },
        });
        res.json(submissions);
    }
    catch (error) {
        res.status(400).json({ error: 'Error fetching submissions' });
    }
}));
router.post('/:submissionId/comment', auth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { submissionId } = req.params;
    const { content } = req.body;
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const comment = yield db_1.prismaClient.comment.create({
            data: {
                content: content,
                submissionId: submissionId,
                userId: req.user.userId,
            },
        });
        res.status(201).json(comment);
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ error: 'Error adding comment' });
    }
}));
router.get('/:submissionId/comments', auth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { submissionId } = req.params;
    try {
        const comments = yield db_1.prismaClient.comment.findMany({
            where: {
                submissionId: submissionId,
            },
        });
        res.status(200).json(comments);
    }
    catch (error) {
        res.status(400).json({ error: 'Error fetching comments' });
    }
}));
exports.default = router;
