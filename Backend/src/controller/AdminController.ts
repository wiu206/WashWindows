import { Contorller } from "../abstract/Contorller";
import { Request, Response } from "express";
import { AdminService } from "../Service/AdminService";
import { resp } from "../utils/resp";
import { DBResp } from "../interfaces/DBResp";
import { User } from "../interfaces/User";
import { verifyToken } from "../utils/token";


export class AdminController extends Contorller {
    protected service: AdminService;

    constructor() {
        super();
        this.service = new AdminService();
    }
    public async getAllUserPointsAndClicked(Request: Request, Response: Response) {
            const res: resp<Array<DBResp<User>> | undefined> = {
                code: 200,
                message: "",
                body: undefined
            }

            const authHeader = Request.headers['authorization'];
            if (!authHeader) {
                res.code = 401;
                res.message = "未提供認證資訊";
                Response.status(401).send(res);
                return;
            }

            const token = authHeader.split(' ')[1];
            const decoded = verifyToken(token) as { _id: string, userRole: string };
            if (decoded.userRole !== 'admin') { // 檢查是否為管理員
                res.code = 403;
                res.message = "權限不足";
                Response.status(403).send(res);
            }
            const dbResp = await this.service.getAllUserPointsAndClicked();
            if (dbResp) {
                res.body = dbResp;
                res.message = "已找到所有有效用戶積分與點擊次數";
                Response.send(res);
            } else {
                res.code = 500;
                res.message = "伺服器異常";
                Response.status(500).send(res);
            }
        }
    public async resetUserPoints(Request: Request, Response: Response) {
        const resp = await this.service.resetUserPoints(Request);
        Response.status(resp.code).send(resp);
    }
    
    public async revokeUserById(Request: Request, Response: Response) {
        const resp = await this.service.revokeUserById(Request);
        Response.status(resp.code).send(resp);
    }


}