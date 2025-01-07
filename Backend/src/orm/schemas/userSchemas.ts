import { model, Schema } from "mongoose";
import { User } from "../../interfaces/User";

export const userSchemas = new Schema<User>({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    userRole: { type: String, required: true},
    points: { type: Number, required: true },
    clicked: { type: Number, required: true },
}, {versionKey: false})

export const userModel = model<User>('users', userSchemas);