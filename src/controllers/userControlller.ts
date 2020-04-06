require("dotenv").config();
let jwt = require("jsonwebtoken");
require("dotenv").config();
import bcrypt from "bcrypt";
import {getRepository} from 'typeorm'
import {User} from '../entity/User';
import {Country} from '../entity/Country';
import { Tournament } from "../entity/Tournament";

export class UserController {
  
  index = async (req: any, res: any, next: any) => {
    try {
      console.log("index");
      
    } catch (error) {
      next(error);
    }
  };

  getUsers = async (req: any, res: any, next: any) => {
    try {
      const user = await getRepository(User).find();
      return res.status(200).json({
        message: "All Users",
        user: user
      });
      
    } catch (error) {
      next(error);
    }
  };

  createUsers = async (req: any, res: any, next: any) => {
    try {
      let { name, email, password, phoneNumber, country } = req.body;
      const users = await getRepository(User).create({name, email,password,phoneNumber,country}).save(); 

      // //Active Records 
      // const user = new User();
      // user.name = name;
      // user.email = email;
      // user.password = password;
      // user.phoneNumber= phoneNumber;
      // user.country = country_id
      // const users = await user.save();

      return res.status(200).json({
        message: "Created Users",
        user: users
      });
      
    } catch (error) {
      next(error);
    }
  };

  updateUsers = async (req: any, res: any, next: any) => {
    try {
      let { id } = req.params;
      let { name, email, password, phoneNumber } = req.body;
      const user = await getRepository(User).findOne(id);
      if(user){
        const users = await getRepository(User).merge(user, {name, email,password,phoneNumber}).save(); 
        return res.status(200).json({
          message: "Updated Users",
          user: user
        });
      }
      return res.status(401).json({
        message: "There is no user",
      });
    } catch (error) {
      next(error);
    }
  };

  deleteUsers = async (req: any, res: any, next: any) => {
    try {
      let { id } = req.params;
      const user = await getRepository(User).findOne(id);
      if(user){
        const users = await getRepository(User).delete(id)  ; 
        return res.status(200).json({
          message: "successfully Deleted"
        });
      }
      return res.status(401).json({
        message: "There is no user",
      });
    } catch (error) {
      next(error);
    }
  };

  oneToMany = async (req: any, res: any, next: any) => {
    try {
      // //ManyToONe
      // const result = await getRepository(User).find({ relations: ["country"] });

      //OneToMany
      const result = await  getRepository(Country).find({relations: ["user"]});
      return res.status(200).json({
        message: "OneToMany Relations",
        Result: result
      });
      
    } catch (error) {
      next(error);
    }
  };

  manyToMany = async (req: any, res: any, next: any) => {
    try {
     // Get Through User
      const result =await getRepository(User).createQueryBuilder("user")
        .innerJoin("user.userTournament", "userTournament")
        .innerJoin("userTournament.tournament", "tournament", "tournament.id = :tournamentId", { tournamentId: '2' })
        .getMany();

        // const user = await getRepository(User);
        // const result = await user.find({
        //   relations: ['userTournament'],
        //   where: []
        // });

      // //Get Through Tournament
      // const result =await getRepository(Tournament).createQueryBuilder("tournament")
      //   .innerJoin("tournament.userTournament", "userTournament")
      //   .innerJoin("userTournament.user", "user", "user.id = :userId", { userId: '1' })
      //   .getMany();


      // const user = await getRepository(User).findOne(1);
      // const result = await user.tournaments;
     
      return res.status(200).json({
        message: "ManyToMany Relations",
        Result: result
      });
      
    } catch (error) {
      next(error);
    }
  };

}
