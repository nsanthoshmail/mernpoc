"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts (Snippet)
const express_1 = __importDefault(require("express"));
const users_1 = require("./modules/users"); // Import from the index.ts
//import { authModule } from './modules/auth'; // Assuming auth has a similar index.ts
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Mount the user router
app.use('/api/v1/users', users_1.usersRouterModule.router);
// Mount the auth router (AuthService likely got usersModule.usersService injected in its index.ts)
//app.use('/api/v1/auth', authModule.router);
// ... other middleware, error handling ...
exports.default = app;
