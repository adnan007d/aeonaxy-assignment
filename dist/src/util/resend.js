"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const env_1 = require("../env");
const resend_1 = require("resend");
const logger_1 = __importDefault(require("./logger"));
const resend = new resend_1.Resend(env_1.env.RESEND_API_KEY);
async function sendMail({ to, subject, html }) {
    const { data, error } = await resend.emails.send({
        from: env_1.env.RESEND_FROM_EMAIL, // "Acme <onboarding@resend.dev>"
        to,
        subject,
        html,
    });
    if (error) {
        return logger_1.default.error(error);
    }
    logger_1.default.info("Email sent successfully to ", to, data);
}
exports.sendMail = sendMail;
