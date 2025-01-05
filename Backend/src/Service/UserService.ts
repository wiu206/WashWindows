import { Service } from "../abstract/Service";
import { logger } from "../middlewares/log";
import { Document } from "mongoose"
import { MongoDB } from "../utils/MongoDB";
import { DBResp } from "../interfaces/DBResp";
import { resp } from "../utils/resp";
import { User } from "../interfaces/User";
import { userModel } from "../orm/schemas/userSchemas";
import * as bcrypt from 'bcrypt';

export class UserService extends Service {

    public async register(info: User): Promise<resp<DBResp<User>|undefined>> {
        const resp: resp<DBResp<User> | undefined> = {
            code: 200,
            message: "",
            body: undefined
        }
        try {
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
            resp.message = "register successfully";
        } catch (error) {
            resp.code = 500;
            resp.message = "伺服器異常";
            logger.error(error);
        }
        return resp;
    }
    public async login(loginInfo: { email: string; password: string }): Promise<resp<DBResp<Document>|undefined>> {
        const resp: resp<DBResp<Document> | undefined> = {
            code: 200,
            message: "",
            body: undefined
        }
        try {
            // 查找使用者是否存在
            const user = await userModel.findOne({ email: loginInfo.email });
            // 如果找不到使用者
            if (!user) {
                resp.code = 401;
                resp.message = "帳號或密碼錯誤";
                return resp;
            }
            // 驗證密碼
            const isPasswordValid = await bcrypt.compare(loginInfo.password, user.password);

            if (!isPasswordValid) {
                resp.code = 401;
                resp.message = "帳號或密碼錯誤";
                return resp;
            }

            resp.body = user;
            resp.message = "登入成功";
        } catch (error) {
            resp.code = 500;
            resp.message = "伺服器異常";
            logger.error("Login error: ", error);
        }
    
        return resp;
    }

    public async getAllUserPoints(): Promise<Array<DBResp<Document>> | undefined> {
        try {
            // 查詢所有使用者，只選取需要的欄位
            const users = await userModel
                .find({})
                .select('username points')  // 只需要顯示username 以及分數
                .sort({ points: -1 });  // 依points降序排序
            return users;
        } catch (error) {
            return undefined;
        }
    }

    public async updateByUserId(info: {_id: string, username: string, email: string}): Promise<resp<DBResp<Document>|undefined>> {
        const resp: resp<DBResp<Document> | undefined> = {
            code: 200,
            message: "",
            body: undefined
        }
        try {
            if (!info._id || !info.username || !info.email) {
                resp.code = 400;
                resp.message = "缺少必要資料";
                return resp;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(info.email)) {
                resp.code = 400;
                resp.message = "電子郵件格式錯誤";
                return resp;
            }

            const existingUser = await userModel.findById(info._id);
            if (!existingUser) {
                resp.code = 404;
                resp.message = "找不到使用者";
                return resp;
            }

            if (existingUser.username === info.username && existingUser.email === info.email) {
                resp.code = 304;
                resp.message = "資料並未有更新";
                return resp;
            }
            existingUser.username = info.username;
            existingUser.email = info.email;

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

    public async updatePoints(info: {_id: string, points: number}): Promise<resp<DBResp<Document>|undefined>> {
        const resp: resp<DBResp<Document> | undefined> = {
            code: 200,
            message: "",
            body: undefined
        }
        try {
            if (!info._id || !info.points) {
                resp.code = 400;
                resp.message = "缺少必要資料";
                return resp;
            }
            const existingUser = await userModel.findById(info._id);
            if (!existingUser) {
                resp.code = 404;
                resp.message = "找不到使用者";
                return resp;
            }
            existingUser.points = info.points;
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

    public async deleteByUserId(info: {_id: string, password: string}): Promise<resp<DBResp<Document>|undefined>> {
        const resp: resp<DBResp<Document> | undefined> = {
            code: 200,
            message: "",
            body: undefined
        }
        try {
            const user = await userModel.findById(info._id);
            if (!user) {
                resp.code = 404;
                resp.message = "找不到使用者";
                return resp;
            }
            const isPasswordValid = await bcrypt.compare(info.password, user.password);
            if (!isPasswordValid) {
                resp.code = 401;
                resp.message = "提供的密碼錯誤";
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