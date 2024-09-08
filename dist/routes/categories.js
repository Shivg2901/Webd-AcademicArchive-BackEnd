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
//admin creates category
router.post('/create', auth_1.adminOnly, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({
            message: 'Category name is required'
        });
    }
    try {
        const category = yield db_1.prismaClient.category.create({
            data: { name }
        });
        return res.status(201).json({
            message: 'Category creted', category
        });
    }
    catch (error) {
        return res.status(400).json({
            error: 'Error creating category'
        });
    }
}));
//fetch categories
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield db_1.prismaClient.category.findMany();
        return res.status(200).json(categories);
    }
    catch (error) {
        return res.status(400).json({
            error: 'Error fetching categories'
        });
    }
}));
exports.default = router;
