import * as dotenv from 'dotenv';
import * as express from 'express';
import * as morgan from 'morgan';
import * as mongoose from 'mongoose';
import * as path from 'path';
import * as modRewrite from 'connect-modrewrite';
import * as swaggerUi from 'swagger-ui-express';
import * as YAML  from 'yamljs';

import setRoutes from './router/router';

/** 
 * Load default swagger from yaml file
 */
const defaultSwagger = YAML.load('./config/default.yaml');
const uploadsDir = path.resolve(__dirname, '../../../uploads');

const app = express();
dotenv.load({ path: '.env' });
app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, '../ngx-blog-d-lite')));
app.use('/api/uploads', express.static(path.join(__dirname, './../../uploads')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/** 
 * Set Swagger interface.
 */
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(defaultSwagger ));

/*
 * Set headers to allow cross origin request.
 */
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(modRewrite([
  '!^/api/.*|\\.html|\\.js|\\.css|\\.swf|\\.jp(e?)g|\\.png|\\.ico|\\.gif|\\.svg|\\.mp3|\\.mp4|\\.ogg|\\.mts|\\.eot|\\.ttf|\\.woff|\\.txt|\\.pdf$ / [L]'
]))


let mongodbURI;
if (process.env.NODE_ENV === 'test') {
  mongodbURI = process.env.MONGODB_TEST_URI;
} else {
  mongodbURI = process.env.MONGODB_URI;
  app.use(morgan('dev'));
}

mongoose.Promise = global.Promise;
// After upgrading to version 5.2.10. Any of the options below should stop the warnings
mongoose.connect(mongodbURI, { useNewUrlParser: true, useCreateIndex: true })
  .then(db => {
    console.log('Connected to MongoDB');

    setRoutes(app);

    app.get('/*', function(req, res) {
      res.sendFile(path.join(__dirname, '../ngx-blog-d-lite/index.html'));
    });

    if (!module.parent) {
      app.listen(app.get('port'), () => console.log(`Angular D-Lite Blog listening on port ${app.get('port')}`));
    }
  })
  .catch(err => console.error(err));

export { app };
