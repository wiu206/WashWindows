import { model, Schema } from "mongoose";
import { User } from "../../interfaces/User";

export const userSchemas = new Schema<User>({
    username: { type: String, required: false },
    password: { type: String, required: true },
    email: { type: String, required: true},
    points: { type: Number, required: false},
}, {versionKey: false})

export const userModel = model<User>('users', userSchemas);