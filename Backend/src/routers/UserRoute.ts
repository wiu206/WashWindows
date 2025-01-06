import { Route } from "../abstract/Route"
import { UserController } from "../controller/UserController";
import { logger } from "../middlewares/log";

export class UserRoute extends Route{
    
    protected url: string;
    protected Contorller = new UserController();

    constructor(){
        super()
        this.url = '/api/v1/user/'
        this.setRoutes()
    }

    protected setRoutes(): void {

        this.router.post(`${this.url}register`, (req, res) => {
            this.Contorller.register(req, res);
        })

        this.router.post(`${this.url}login`, (req, res) => {
            this.Contorller.login(req, res);
        })

        this.router.post(`${this.url}logout`, (req, res) => {
            this.Contorller.logout(req, res);
        })

        this.router.get(`${this.url}getAllPoints`,(req, res)=>{
            this.Contorller.getAllPoints(req, res);
        })

        this.router.put(`${this.url}updateByUserId`, (req, res) => {
            this.Contorller.updateByUserId(req, res);
        })

        this.router.put(`${this.url}updatePoints`, (req, res) => {
            this.Contorller.updatePoitns(req, res);
        })
        
        this.router.delete(`${this.url}deleteByUserId`, (req, res) => {
            this.Contorller.deleteByUserId(req, res);
        })
    }
}