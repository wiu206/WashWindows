import { Service } from "../abstract/Service"
import { DBResp } from "../interfaces/DBResp"
import { Document } from "mongoose"
import { resp } from "../utils/resp";
import { Request } from "express";
import { verifyToken } from "../utils/token";
import { userModel } from "../orm/schemas/userSchemas";
import { logger } from "../middlewares/log";
import { User } from "../interfaces/User";

export class AdminService extends Service {

    public async getAllUserPointsAndClicked(): Promise<Array<DBResp<User>> | undefined> {
        try {
            const users = await userModel
                .find({ userRole: "user" })
                .select('username points clicked')
                .sort({ username: 1 });
            return users;
        } catch (error) {
            return undefined;
        }
    }

    public async resetUserPoints(Request: Request): Promise<resp<DBResp<Document>|undefined>> {
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

            if (decoded.userRole !== 'admin') { // 檢查是否為管理員
                resp.code = 403;
                resp.message = "權限不足";
                return resp;
            }

            const { _id } = Request.query;
            if (!_id){
                resp.code = 400;
                resp.message = "缺少必要資料";
                return resp;
            }

            const user = await userModel.findById(_id);
            if (!user) {
                resp.code = 404;
                resp.message = "找不到使用者";
                return resp;
            }

            user.points = 0;
            user.clicked = 0;

            resp.message = "分數重置成功";
            resp.body = await user.save();
            return resp;

        } catch (error) {
            resp.code = 500;
            resp.message = "伺服器異常";
            logger.error("Admin reset points error: ", error);
        }

        return resp;
    }

    public async revokeUserById(Request: Request): Promise<resp<DBResp<Document>|undefined>> {
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

            if (decoded.userRole !== 'admin') { // 檢查是否為管理員
                resp.code = 403;
                resp.message = "權限不足";
                return resp;
            }

            const { _id } = Request.query;
            if (!_id){
                resp.code = 400;
                resp.message = "缺少必要資料";
                return resp;
            }

            const user = await userModel.findById(_id);
            if (!user) {
                resp.code = 404;
                resp.message = "找不到使用者";
                return resp;
            }

            user.delete();
            resp.message = "刪除帳號成功";
            return resp;

        } catch (error) {
            resp.code = 500;
            resp.message = "伺服器異常";
            logger.error("Admin revoke user by id error: ", error);
        }

        return resp;
    }
}