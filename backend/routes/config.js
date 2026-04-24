"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '..', '..', '.env') });
const router = (0, express_1.Router)();
// GET /api/config - Return frontend configuration
router.get('/', (req, res) => {
    res.json({
        success: true,
        data: {
            googleMapsApiKey: process.env.VITE_GOOGLE_MAPS_API_KEY || '',
        },
        timestamp: new Date().toISOString(),
    });
});
exports.default = router;
