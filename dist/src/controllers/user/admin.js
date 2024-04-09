"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.addUser = exports.getUserById = exports.getAllUsers = void 0;
const drizzle_1 = __importDefault(require("../../db/drizzle"));
const schema_1 = require("../../db/schema");
const validations_1 = require("../../util/validations");
const drizzle_orm_1 = require("drizzle-orm");
const util_1 = require("../../util/util");
const serverless_1 = require("@neondatabase/serverless");
const { password: _, ...columnsWithoutPassword } = (0, drizzle_orm_1.getTableColumns)(schema_1.users);
// GET /admin/users
async function getAllUsers(req, res, next) {
    try {
        const pageQuery = validations_1.paginateSchema.parse(req.query);
        const filters = validations_1.userFilterSchema.parse(req.query);
        const whereOptions = (0, drizzle_orm_1.and)(filters.email ? (0, drizzle_orm_1.ilike)(schema_1.users.email, `%${filters.email}%`) : undefined, filters.name ? (0, drizzle_orm_1.ilike)(schema_1.users.name, `%${filters.name}%`) : undefined, filters.role ? (0, drizzle_orm_1.eq)(schema_1.users.role, filters.role) : undefined);
        const result = await drizzle_1.default
            .select(columnsWithoutPassword)
            .from(schema_1.users)
            .limit(pageQuery.limit)
            .offset(pageQuery.limit * (pageQuery.page - 1))
            .where(whereOptions);
        const countResult = await drizzle_1.default
            .select({ count: (0, drizzle_orm_1.count)() })
            .from(schema_1.users)
            .where(whereOptions);
        return res.json({ total: countResult[0]?.count, users: result });
    }
    catch (error) {
        return next(error);
    }
}
exports.getAllUsers = getAllUsers;
// GET /admin/users/:id
async function getUserById(req, res, next) {
    try {
        const id = Number(req.params.id);
        if (!id || isNaN(id)) {
            return next(new util_1.APIError(400, "Invalid user id"));
        }
        const result = await drizzle_1.default.select(columnsWithoutPassword).from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, id));
        if (result.length === 0) {
            return next(new util_1.APIError(404, "User not found"));
        }
        return res.json({ user: result[0] });
    }
    catch (error) {
        return next(error);
    }
}
exports.getUserById = getUserById;
// POST /admin/users
async function addUser(req, res, next) {
    try {
        const result = await drizzle_1.default.insert(schema_1.users).values(req.body).returning();
        return res.json({ user: result[0] });
    }
    catch (error) {
        if (error instanceof serverless_1.NeonDbError && error.code === "23505") {
            return next(new util_1.APIError(400, "User already exists"));
        }
        return next(error);
    }
}
exports.addUser = addUser;
// PUT /admin/users/:id
async function updateUser(req, res, next) {
    try {
        const id = Number(req.params.id);
        if (!id || isNaN(id)) {
            return next(new util_1.APIError(400, "Invalid user id"));
        }
        req.body.updated_at = new Date();
        const result = await drizzle_1.default
            .update(schema_1.users)
            .set(req.body)
            .where((0, drizzle_orm_1.eq)(schema_1.users.id, id))
            .returning();
        if (result.length === 0) {
            return next(new util_1.APIError(404, "User not found"));
        }
        return res.json({ user: result[0] });
    }
    catch (error) {
        if (error instanceof serverless_1.NeonDbError && error.code === "23505") {
            return next(new util_1.APIError(400, "User already exists"));
        }
        return next(error);
    }
}
exports.updateUser = updateUser;
// DELETE /admin/users/:id
async function deleteUser(req, res, next) {
    try {
        const id = Number(req.params.id);
        if (!id || isNaN(id)) {
            return next(new util_1.APIError(400, "Invalid user id"));
        }
        const result = await drizzle_1.default.delete(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, id));
        if (result.rowCount === 0) {
            return next(new util_1.APIError(404, "User not found"));
        }
        return res.json({ message: "User deleted" });
    }
    catch (error) {
        return next(error);
    }
}
exports.deleteUser = deleteUser;
