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

        this.router.get(`${this.url}getAllUserPoints`,(req, res)=>{
            this.Contorller.getAllUserPoints(req, res);
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
        
        this.router.post(`${this.url}updatePassword`, (req, res) => {
            this.Contorller.updatePassword(req, res);
        })
    }
}