import { Route } from "../abstract/Route";
import { AdminController } from "../controller/AdminController";


export class AdminRoute extends Route {
    protected url: string;
    protected Contorller = new AdminController();

    constructor(){
        super()
        this.url = '/api/v1/admin/'
        this.setRoutes()
    }

    protected setRoutes(): void {
        
        this.router.get(`${this.url}getAllUser`, (req, res) => {
            this.Contorller.getAllUserPointsAndClicked(req, res);
        })

        this.router.put(`${this.url}resetUserPoints`, (req, res) => {
            this.Contorller.resetUserPoints(req, res);
        })

        this.router.delete(`${this.url}revokeUser`, (req, res) => {
            this.Contorller.revokeUserById(req, res);
        })
    }
}