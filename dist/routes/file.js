"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
//route to get back fileurl 
router.post('/upload', upload_1.upload.single('file'), (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).json({
            error: 'No file uploaded'
        });
    }
    const fileUrl = file.location;
    res.status(200).json({
        message: 'File upl;oaded successfully',
        fileUrl: fileUrl,
    });
});
exports.default = router;
