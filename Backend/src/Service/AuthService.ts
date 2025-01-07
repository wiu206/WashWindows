import { Service } from "../abstract/Service";
import { DBResp } from "../interfaces/DBResp";
import { User } from "../interfaces/User";
import { Document } from "mongoose"
import { logger } from "../middlewares/log";
import { userModel } from "../orm/schemas/userSchemas";
import { generateToken, verifyToken } from "../utils/token";
import { Request } from "express";
import { resp } from "../utils/resp";
import * as bcrypt from 'bcrypt';

export class AuthService extends Service {
    public async register(info: User): Promise<resp<DBResp<User>|undefined>> {
        const resp: resp<DBResp<User> | undefined> = {
            code: 200,
            message: "",
            body: undefined
        }
        try {
            if (!info.username || !info.password || !info.email || !info.userRole) {
                resp.code = 400;
                resp.message = "缺少必要資料";
                return resp;
            }
            // 檢查使用者名稱是否已存在
            const existingUsername = await userModel.findOne({ username: info.username });
            if (existingUsername) {
                resp.code = 400;
                resp.message = "Username已被使用";
                return resp;
            }
            // 檢查 email 是否已註冊
            const existingEmail = await userModel.findOne({ email: info.email });
            if (existingEmail) {
                resp.code = 400;
                resp.message = "Email已被註冊";
                return resp;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(info.email as string)) {
                resp.code = 400;
                resp.message = "電子郵件格式錯誤";
                return resp;
            }
            if (info.userRole !== 'user' && info.userRole !== 'admin') {
                resp.code = 400;
                resp.message = "無效的userRole";
                return resp;
            }
            // 密碼雜湊處理
            const hashedPassword = await bcrypt.hash(info.password, 10);
            const newUserInfo = {
                ...info,
                password: hashedPassword,
                points: 0,
                clicked: 0,
            };
    
            const res = new userModel(newUserInfo);
            resp.body = await res.save();
            resp.message = "註冊成功";
        } catch (error) {
            resp.code = 500;
            resp.message = "伺服器異常";
            logger.error(error);
        }
        return resp;
    }
    public async login(loginInfo: { email: string; password: string }): Promise<resp<{user: Document, token: string}|undefined>> {
        const resp: resp<{user: Document, token: string} | undefined> = {
            code: 200,
            message: "",
            body: undefined
        }
        try {
            const user = await userModel.findOne({ email: loginInfo.email });
            if (!user) {
                resp.code = 401;
                resp.message = "帳號或密碼錯誤";
                return resp;
            }
            
            const isPasswordValid = await bcrypt.compare(loginInfo.password, user.password);
            if (!isPasswordValid) {
                resp.code = 401;
                resp.message = "帳號或密碼錯誤";
                return resp;
            }
    
            // 根據userRole生成對應的 token
            const token = generateToken(
                user._id.toString(), 
                user.userRole as 'user' | 'admin'
            );
    
            resp.body = {
                user: user,
                token: token
            };
            resp.message = "登入成功";
            logger.info(`${user.userRole} ${user.username} login`);
        } catch (error) {
            resp.code = 500;
            resp.message = "伺服器異常";
            logger.error("Login error: ", error);
        }
        return resp;
    }

    public async logout(Request: Request): Promise<resp<string|undefined>> {
        const resp: resp<undefined> = {
            code: 200,
            message: "",
            body: undefined
        };
        try {
            const authHeader = Request.headers['authorization'];
            if (!authHeader) {
                resp.code = 401;
                resp.message = "未提供認證資訊";
                return resp;
            }

            const token = authHeader.split(' ')[1];
            const decoded = verifyToken(token);
            const { _id, userRole } = decoded as { _id: string, userRole: string }; 

            const user = await userModel.findById(_id);
            let username = '';
            if (user) {
                username = user.username;
            } else {
                resp.code = 400;
                resp.message = "找不到用戶";
                return resp;
            }
            
            resp.message = "登出成功";
            logger.info(`${userRole} ${username} logout`);

        } catch (error) {
            resp.code = 500;
            resp.message = "伺服器異常";
            logger.error("Logout error: ", error);
        }
        return resp;
    }
}
