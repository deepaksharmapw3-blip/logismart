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
exports.testConnection = exports.supabase = exports.isSupabaseConfigured = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
// Check if Supabase is configured
const isSupabaseConfigured = () => {
    return !!(supabaseUrl && (supabaseKey || supabaseServiceKey));
};
exports.isSupabaseConfigured = isSupabaseConfigured;
// Create Supabase client only if configured
let supabaseInstance = null;
if ((0, exports.isSupabaseConfigured)()) {
    supabaseInstance = (0, supabase_js_1.createClient)(supabaseUrl, supabaseServiceKey || supabaseKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
    console.log('✅ Supabase client initialized');
}
else {
    console.log('⚠️  Supabase credentials not found. Using in-memory data store.');
}
exports.supabase = supabaseInstance;
// Test database connection
const testConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, exports.isSupabaseConfigured)() || !supabaseInstance) {
        return false;
    }
    try {
        const { data, error } = yield supabaseInstance.from('shipments').select('count').limit(1);
        if (error)
            throw error;
        console.log('✅ Supabase connection successful');
        return true;
    }
    catch (error) {
        console.error('❌ Supabase connection failed:', error);
        return false;
    }
});
exports.testConnection = testConnection;
exports.default = exports.supabase;
