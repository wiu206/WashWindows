import { Service } from "../abstract/Service";
import { logger } from "../middlewares/log";
import { Document } from "mongoose"
import { MongoDB } from "../utils/MongoDB";
import { DBResp } from "../interfaces/DBResp";
import { resp } from "../utils/resp";
import { User } from "../interfaces/User";
import { userModel } from "../orm/schemas/userSchemas";
import * as bcrypt from 'bcrypt';
import { generateToken, verifyToken } from "../utils/token";
import { Request } from "express";

export class UserService extends Service {

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
                _id: undefined,
                points: 0
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
    public async getAllUserPoints(): Promise<Array<DBResp<Document>> | undefined> {
        try {
            const users = await userModel
                .find({})
                .select('username points')  // 只需要顯示username 以及分數
                .sort({ points: -1 });  // 依points降序排序
            return users;
        } catch (error) {
            return undefined;
        }
    }

    public async updateByUserId(Request: Request): Promise<resp<DBResp<Document>|undefined>> {
        const resp: resp<DBResp<Document> | undefined> = {
            code: 200,
            message: "",
            body: undefined
        }
        try {
            const authHeader = Request.headers['authorization'];
            if (!authHeader) {
                resp.code = 401;
                resp.message = "未提供認證資訊";
                return resp;
            }
    
            const token = authHeader.split(' ')[1];
            const decoded = verifyToken(token) as { _id: string, userRole: string };
    
            // 檢查權限
            const { _id, username, email } = Request.body; // 從 body 取得要更新的用戶 ID
    
            if (decoded.userRole !== 'admin' && decoded._id !== _id) { // 檢查是否為管理員或本人
                resp.code = 403;
                resp.message = "權限不足";
                return resp;
            }
    
            if (!_id || !username || !email) {
                resp.code = 400;
                resp.message = "缺少必要資料";
                return resp;
            }
    
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                resp.code = 400;
                resp.message = "電子郵件格式錯誤";
                return resp;
            }
    
            const existingUser = await userModel.findById(_id);
            if (!existingUser) {
                resp.code = 404;
                resp.message = "找不到使用者";
                return resp;
            }
    
            if (existingUser.username === username && existingUser.email === email) {
                resp.code = 304;
                resp.message = "資料並未有更新";
                return resp;
            }
    
            existingUser.username = username;
            existingUser.email = email;
    
            await existingUser.save();
            
            resp.message = "更新資料成功";
            resp.body = existingUser;
            return resp;
    
        } catch (error) {
            resp.code = 500;
            resp.message = "伺服器異常";
            logger.error("user updating error: ", error);
        }
        return resp;
    }

    public async updatePoints(Request: Request): Promise<resp<DBResp<Document>|undefined>> {
        const resp: resp<DBResp<Document> | undefined> = {
            code: 200,
            message: "",
            body: undefined
        }
        try {
            const authHeader = Request.headers['authorization'];
            if (!authHeader) {
                resp.code = 401;
                resp.message = "未提供認證資訊";
                return resp;
            }

            const token = authHeader.split(' ')[1];
            const decoded = verifyToken(token) as { _id: string, userRole: string };
            const { _id, points } = Request.body;

            if (decoded.userRole !== 'admin' && decoded._id !== _id) { // 檢查是否為管理員或本人
                resp.code = 403;
                resp.message = "權限不足";
                return resp;
            }

            if (!_id || !points) {
                resp.code = 400;
                resp.message = "缺少必要資料";
                return resp;
            }
            const existingUser = await userModel.findById(_id);
            if (!existingUser) {
                resp.code = 404;
                resp.message = "找不到使用者";
                return resp;
            }
            existingUser.points = points;
            await existingUser.save();

            resp.message = "點數更新成功";
            resp.body = existingUser;
            return resp;
        }
        catch (error) {
            resp.code = 500;
            resp.message = "伺服器異常";
            logger.error("user updating points error: ", error);
        }
        return resp;
    }

    public async deleteByUserId(Request: Request): Promise<resp<DBResp<Document>|undefined>> {
        const resp: resp<DBResp<Document> | undefined> = {
            code: 200,
            message: "",
            body: undefined
        }
        try {
            const authHeader = Request.headers['authorization'];
            if (!authHeader) {
                resp.code = 401;
                resp.message = "未提供認證資訊";
                return resp;
            }

            const token = authHeader.split(' ')[1];
            const decoded = verifyToken(token) as { _id: string, userRole: string };
            const { _id, password } = Request.body;

            if (decoded.userRole !== 'admin' && decoded._id !== _id) { // 檢查是否為管理員或本人
                resp.code = 403;
                resp.message = "權限不足";
                return resp;
            }

            const user = await userModel.findById(_id);
            if (!user) {
                resp.code = 404;
                resp.message = "找不到使用者";
                return resp;
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                resp.code = 401;
                resp.message = "密碼錯誤";
                return resp;
            }

            user.delete();
            resp.message = "刪除帳號成功";
            return resp;
        } catch (error) {
            resp.code = 500;
            resp.message = "伺服器異常";
            logger.error("Delete By UserId error: ", error);
        }

        return resp;
    }
}