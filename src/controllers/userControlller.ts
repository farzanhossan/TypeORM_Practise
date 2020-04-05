require("dotenv").config();
let jwt = require("jsonwebtoken");
import User from "../models/User";
import Tournament from "../models/Tournament";
import Product from "../models/Product";
import RelatedProduct from "../models/RelatedProduct";
import UserTournaments from "../models/UserTournaments";
import Country from "../models/Country";
import Nid from "../models/Nid";
import BannerProduct from "../models/bannerProduct.db.schema";
import Products from "../models/product.db.schema";
require("dotenv").config();
import bcrypt from "bcrypt";
import { Op, QueryTypes, Model } from 'sequelize';

export class UserController {
  /// Belongs-To-Many
  belongsToMany = async (req: any, res: any, next: any) => {
    try {
      /// Relation
      User.belongsToMany(Tournament, {
        through: UserTournaments,
        foreignKey: "user_id"
      });
      Tournament.belongsToMany(User, {
        through: UserTournaments,
        foreignKey: "tournament_id"
      });
      ///

      let user = await User.findOne({
        where: { id: 2 },
        include: {
          model: Tournament,
          through: {
            attributes: []
          }  
        }
      });
      return res.status(200).json({
        user
      });
    } catch (error) {
      next(error);
    }
  };

    /// Belongs-To-Many Products
    selfJoin = async (req: any, res: any, next: any) => {
      try {
        /// Relation
        Product.belongsToMany(Product ,{
          through: RelatedProduct,
          as: 'Related_Product',
          foreignKey: 'product_id'
        });

        Product.belongsToMany(Product ,{
          through: RelatedProduct,
          as: 'Product',
          foreignKey: "related_product_id"
        });
        ///
  
        let product = await Product.findAll({
          include: {
            model: Product,
            as: "Related_Product",
            through:{
              attributes:[]
            }
          }
        });
        return res.status(200).json({
          product
        });
      } catch (error) {
        next(error);
      }
    };

  /// Belongs-To --- HasMany
  hasMany = async (req: any, res: any, next: any) => {
    try {
      /// Relation
      // User.belongsTo(Country, {
      //   foreignKey: "country_id"
      // });
      // Country.hasMany(User, {
      //   foreignKey: "country_id"
      // });
      BannerProduct.belongsTo(Products, {
        foreignKey: "product_id"
      });
      Products.hasMany(BannerProduct, {
        foreignKey: "product_id"
      });
      // //

      //Many To One
      // let user = await User.findAll({
      //   include: [{
      //     model: Country,
      //     where: { name: { [Op.in]: ['Bangladesh','India'] } }
      //   }]
      // });
      // return res.status(200).json({
      //   user
      // });

      // //One To Many
      // let country = await Country.findAll({
      //   where: { name: { [Op.in]: ['Bangladesh'] } },
      //   include: [User]
      // });
      // return res.status(200).json({
      //   country
      // });

      //Sub-Query
      // const users = await sequelize.query("SELECT * FROM `users` where country_id IN ('1')", 
      // { type: QueryTypes.SELECT });

      // const product = await BannerProduct.findAll({
      //         attributes: ['product_id']
      //       }).map((data: any) => data.get())

      // const user = await User.findAll({
      //   where: {
      //     country_id: {
      //       [Op.in]: await Country.findAll({
      //         attributes: ['id']
      //       }).map((country_id: any) => country_id.get("id"))
      //     }
      //   }
      // });
      const productList = await Products.findAll({
        where: {
          deleted_at: {[Op.eq]: null},
          id: {
            [Op.in]: await BannerProduct.findAll({
              attributes: ['product_id']
            }).map((data: any) => data.get("product_id"))
          }
        },
        include:{
          model: BannerProduct,
          order: [['id']],
          attributes:[]
        }
      });

      return res.status(200).json({
        productList
      });

    } catch (error) {
      next(error);
    }
  };

  /// Belongs-To --- HasOne
  belongsTo = async (req: any, res: any, next: any) => {
    try {
      /// Relation
      User.belongsTo(Country, {
        foreignKey: "country_id"
      });
      let user = await User.findAll({
        include: [Country]
      });
      return res.status(200).json({
        user
      });
    } catch (error) {
      next(error);
    }
  };

    /// Belongs-To --- HasOne
    hasOne = async (req: any, res: any, next: any) => {
      try {
        /// Relation
        User.hasOne(Nid, {
          as: 'EID',
          foreignKey: "user_id",
        });
        let users = await User.findOne({
          where: {id: 2},
          include: [
            {
                model: Nid,
                as: "EID"
            }],
           raw: true,
           required: false
        });
        return res.status(200).json({
          users
        });
      } catch (error) {
        next(error);
      }
    };

  /// Get All Users
  getUsers = async (req: any, res: any, next: any) => {
    try {
      const users = await User.findAll();
      return res.status(200).json({
        users
      });
    } catch (error) {
      next(error);
    }
  };

  /// Create User
  createUsers = async (req: any, res: any, next: any) => {
    try {
      let { name, email, password } = req.body;
      const users = await User.create({ name, email, password }).then(() => {
        return res.status(200).json({
          message: "successfully Created"
        });
      });
    } catch (error) {
      next(error);
    }
  };

  /// Update User
  updateUsers = async (req: any, res: any, next: any) => {
    try {
      let id = req.params.id;
      let { name, email, password } = req.body;
      const user = await User.update(
        { name, email, password },
        { where: { id: id } }
      ).then(() => {
        return res.status(200).json({
          message: "successfully Updated"
        });
      });
    } catch (error) {
      next(error);
    }
  };

  /// Delete User
  deleteUsers = async (req: any, res: any, next: any) => {
    try {
      let id = req.params.id;
      const user = await User.destroy({ where: { id: id } }).then(() => {
        return res.status(200).json({
          message: "successfully Deleted"
        });
      });
    } catch (error) {
      next(error);
    }
  };

  /// User Login

  userLogin = async (req: any, res: any, next: any) => {
    try {
      let { email, password } = req.body;
      let user = await User.findOne({ where: { email: email } });
      if (user == null) {
        return res.status(400).json({
          message: "Please Register"
        });
      }
      let getStatus = await bcrypt.compare(password, user.password);
      let userId = {
        id: user.id
      };
      if (getStatus) {
        let token = jwt.sign(userId, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: "6h"
        });
        return res.status(200).json({
          message: "Login Successful",
          token: token
        });
      } else {
        return res.status(400).json({
          message: "Email or Password Incorrect"
        });
      }
    } catch (error) {
      next(error);
    }
  };
}

// async getUsers(req: any, res: any, err: any){
//     try{
//         const users = await User.findAll();
//         return res.status(200).json({
//             users
//         })
//     }catch(err){
//         this.errHandler(req, res, err)
//     }

// }



// var options = {
//   include: etc
// };
// Sequelize.Model.validateIncludedElements(options);
// sequelize.query(q,Post, options).done(function(err,posts){
//     console.error(posts[0])
// })
