import { Contorller } from "../abstract/Contorller";
import { Request, response, Response } from "express";
import { AuthService } from "../Service/AuthService";

export class AuthController extends Contorller {
    protected service: AuthService;

    constructor() {
        super();
        this.service = new AuthService();
    }

    public async register(Request: Request, Response: Response) {
        const resp = await this.service.register(Request.body);
        Response.status(resp.code).send(resp);
    }

    public async login(Request: Request, Response: Response) {
        const resp = await this.service.login(Request.body);
        Response.status(resp.code).send(resp);
    }

    public async logout(Request: Request, Response: Response) {
        const resp = await this.service.logout(Request);
        Response.status(resp.code).send(resp);
    }
}