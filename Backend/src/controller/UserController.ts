import { Contorller } from "../abstract/Contorller";
import { Request, response, Response } from "express";
import { UserService } from "../Service/UserService";
import { resp } from "../utils/resp";
import { DBResp } from "../interfaces/DBResp";
import { User } from "../interfaces/User";
require('dotenv').config()

export class UserController extends Contorller {
    protected service: UserService;

    constructor() {
        super();
        this.service = new UserService();
    }

    public async getAllUserPoints(Request: Request, Response: Response) {
        const res: resp<Array<DBResp<User>> | undefined> = {
            code: 200,
            message: "",
            body: undefined
        }
    
        const dbResp = await this.service.getAllUserPoints();
        if (dbResp) {
            res.body = dbResp;
            res.message = "已找到所有有效用戶積分";
            Response.send(res);
        } else {
            res.code = 500;
            res.message = "伺服器異常";
            Response.status(500).send(res);
        }
    }

    public async updateByUserId(Request: Request, Response: Response) {
        const resp = await this.service.updateByUserId(Request);
        Response.status(resp.code).send(resp);
    }

    public async updatePoitns(Request: Request, Response: Response) {
        const resp = await this.service.updatePoints(Request);
        Response.status(resp.code).send(resp);
    }

    public async deleteByUserId(Request: Request, Response: Response) {
        const resp = await this.service.deleteByUserId(Request);
        Response.status(resp.code).send(resp);
    }
    
    public async updatePassword(Request: Request, Response: Response) {
        const resp = await this.service.updatePassword(Request);
        Response.status(resp.code).send(resp);
    }
}