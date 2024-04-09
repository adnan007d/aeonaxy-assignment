"use strict";
// Get User
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = void 0;
// GET /api/v1/user/me
function getUser(req, res) {
    return res.json(req.user);
}
exports.getUser = getUser;
