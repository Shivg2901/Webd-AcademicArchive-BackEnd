"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./routes/auth"));
const admin_1 = __importDefault(require("./routes/admin"));
const student_1 = __importDefault(require("./routes/student"));
const auth_2 = require("./middleware/auth");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/auth', auth_1.default);
app.use('/admin', auth_2.authMiddleware, auth_2.adminOnly, admin_1.default);
app.use('/student', auth_2.authMiddleware, student_1.default);
const PORT = process.env.PORT || 3111;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
