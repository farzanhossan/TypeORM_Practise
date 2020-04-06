// import { Request, Response, NextFunction, Router } from 'express';
import express from 'express'
import { UserController } from '../controllers/userControlller'
import { request } from 'http';


class UserRouter{
    public router: express.Router;
    userController = new UserController();
    constructor(){
        this.router = express.Router();
        this.routes();

    }

    routes(){
        try {
             this.router.get('/index',this.userController.index);
             this.router.get('/getAll',this.userController.getUsers);
             this.router.post('/create',this.userController.createUsers);
             this.router.put('/update/:id',this.userController.updateUsers);
             this.router.delete('/delete/:id',this.userController.deleteUsers);
             this.router.get('/oneToMany',this.userController.oneToMany);
             this.router.get('/manyToMany',this.userController.manyToMany);

         } catch (error) {
            if (error) throw error;
        }
        
    }

}

const userRouter = new UserRouter();
export default userRouter.router;