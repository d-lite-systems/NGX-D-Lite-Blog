import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';

import User from '../models/user';
import BaseCtrl from './base';

export default class UserCtrl extends BaseCtrl {
  model = User;

    // Insert
  register = (req, res) => {
    const obj = new this.model(req.body);
    obj.createdAt = new Date();
    this.model.count((err, count) => {
      if (err) { return console.error(err); }
      if (count===0) {
        obj.role = 'admin';
      } else {
        obj.role = 'user';
      }
      obj.image = undefined;
      obj.save((err, item) => {
        // 11000 is the code for duplicate key error
        if (err && err.code === 11000) {
          res.sendStatus(400);
        }
        if (err) {
          return console.error(err);
        }
        res.status(200).json(item);
      });
    });
  }


  login = (req, res) => {
    this.model.findOne({ email: req.body.email }, (err, user) => {
      if (!user) { return res.sendStatus(403); }
      user.comparePassword(req.body.password, (error, isMatch) => {
        if (!isMatch) { return res.sendStatus(403); }
        const token = jwt.sign({ user: user }, process.env.APP_SECRET, { expiresIn: 60000 }); // , { expiresIn: 10 } seconds
        res.status(200).json({ token: token });
      });
    });
  }

}
