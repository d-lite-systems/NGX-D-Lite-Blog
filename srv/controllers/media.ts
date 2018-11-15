import Media from '../models/media';
import BaseCtrl from './base';

import * as rimraf from 'rimraf';
import * as path from 'path';
import * as fs  from 'fs';

const uploadsDir = path.resolve(__dirname, '../../../../uploads');

export default class MediaCtrl extends BaseCtrl {
  model = Media;

  uploadfile = (req, res) => {
  	rimraf.sync(`${uploadsDir}/**/*`);

    let path = req.files[0].path
    let UTF8 = {
    encode: function(s){
      for(var c, i = -1, l = (s = s.split("")).length, o = String.fromCharCode; ++i < l;
        s[i] = (c = s[i].charCodeAt(0)) >= 127 ? o(0xc0 | (c >>> 6)) + o(0x80 | (c & 0x3f)) : s[i]
      );
      return s.join("");
    },
    decode: function(s){
      for(var a, b, i = -1, l = (s = s.split("")).length, o = String.fromCharCode, c = "charCodeAt"; ++i < l;
        ((a = s[i][c](0)) & 0x80) &&
        (s[i] = (a & 0xfc) == 0xc0 && ((b = s[i + 1][c](0)) & 0xc0) == 0x80 ?
        o(((a & 0x03) << 6) + (b & 0x3f)) : o(128), s[++i] = "")
      );
      return s.join("");
      }
    };
    console.log(req.files)
    
  	switch(req.files.mimetype) {
  		case 'image/png':
      	var imgfile = {
      		type: 'image',
      		file: req.files
      	}
        res.status(200).json(imgfile);
        break;
      case 'image/jpeg':
      	var imgfile = {
      		type: 'image',
      		file: req.files
      	}
        res.status(200).json(imgfile);
	    	break;
        default:
        res.status(200).json({
          type: 'file',
          file: req.files
        })
      }
    }
  // Delete by id
  removeMedia = (req, res) => {
    this.model.findOne({ _id: req.params.id }, (err, item) => {
      if (err) { return console.error(err); }
      let filePath = uploadsDir +'/'+ item.url; 
      fs.unlinkSync(filePath);
      this.model.findOneAndRemove({ _id: req.params.id }, (err) => {
        if (err) { return console.error(err); }
        
        res.sendStatus(200);
      });
    });
  }
}
