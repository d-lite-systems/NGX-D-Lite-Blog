import * as express from 'express';
import * as path from 'path';
import * as multer from 'multer';
import * as fs from 'fs';

import ArticleCtrl from './../controllers/article';
import CategoryCtrl from './../controllers/category';
import ContactCtrl from './../controllers/contact';
import MediaCtrl from './../controllers/media';
import TaskCtrl from './../controllers/task';
import UserCtrl from './../controllers/user';

import Article from './../models/article';
import Category from './../models/category';
import Contact from './../models/contact';
import Media from './../models/media';
import Task from './../models/task';
import User from './../models/user';

const uploadsDir = path.resolve(__dirname, '../../../uploads');

if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
}
let storage: multer.StorageEngine = multer.diskStorage({

  destination: (req, file, cb) => {
    console.log(req.params.id)
    if (!fs.existsSync(uploadsDir+'/'+req.params.id)){
        fs.mkdirSync(uploadsDir+'/'+req.params.id);
    }
    cb(null, uploadsDir+'/'+req.params.id);
  },
  filename: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    cb(null, `${Math.random().toString(36).substring(7)}${ext}`);
  },
  onFileUploadStart: function (file) {
    console.log(file.originalname + ' is starting ...');
  },
  onFileUploadComplete: function (file) {
    console.log(file.fieldname + ' uploaded to  ' + file.path);
  }
});

let upload: multer.Instance = multer({ storage: storage });

export default function setRoutes(app) {

  const router = express.Router();

  const articleCtrl = new ArticleCtrl();
  const categoryCtrl = new CategoryCtrl();
  const contactCtrl = new ContactCtrl();
  const mediaCtrl = new MediaCtrl();
  const taskCtrl = new TaskCtrl();
  const userCtrl = new UserCtrl();
  
  // Articles
  router.route('/articles').get(articleCtrl.getAll);
  router.route('/articles/count').get(articleCtrl.count);
  router.route('/article').post(articleCtrl.insert);
  router.route('/article/:id').get(articleCtrl.get);
  router.route('/article/:id').put(articleCtrl.update);
  router.route('/article/:id').delete(articleCtrl.delete);

  // Categories
  router.route('/categories').get(categoryCtrl.getAll);
  router.route('/categories/count').get(categoryCtrl.count);
  router.route('/category').post(categoryCtrl.insert);
  router.route('/category/:id').get(categoryCtrl.get);
  router.route('/category/:id').put(categoryCtrl.update);
  router.route('/category/:id').delete(categoryCtrl.delete);

  // Contacts
  router.route('/contacts').get(contactCtrl.getAll);
  router.route('/contacts/count').get(contactCtrl.count);
  router.route('/contact').post(contactCtrl.sendMail);
  router.route('/contact/:id').get(contactCtrl.get);
  router.route('/contact/:id').put(contactCtrl.update);

  // Medias
  router.route('/medias').get(mediaCtrl.getAll);
  router.route('/medias/count').get(mediaCtrl.count);
  router.route('/media').post(mediaCtrl.insert);
  router.route('/upload/:id').post(upload.any(), mediaCtrl.uploadfile);
  router.route('/media/:id').get(mediaCtrl.get);
  router.route('/media/:id').put(mediaCtrl.update);
  router.route('/media/:id').delete(mediaCtrl.removeMedia);

  // Tasks
  router.route('/tasks').get(taskCtrl.getAll);
  router.route('/tasks/count').get(taskCtrl.count);
  router.route('/task').post(taskCtrl.insert);
  router.route('/task/:id').get(taskCtrl.get);
  router.route('/task/:id').put(taskCtrl.update);
  router.route('/task/:id').delete(taskCtrl.delete);


  // Users
  router.route('/login').post(userCtrl.login);
  router.route('/users').get(userCtrl.getAll);
  router.route('/users/count').get(userCtrl.count);
  router.route('/user').post(userCtrl.register);
  router.route('/user/:id').get(userCtrl.get);
  router.route('/user/:id').put(userCtrl.update);
  router.route('/user/:id').delete(userCtrl.delete);

  // Apply the routes to our appliarticleion with the prefix /api
  app.use('/api', router);

}
