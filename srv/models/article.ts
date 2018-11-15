import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const articleSchema = new mongoose.Schema({
  title: { type: String, index: true, required: true },
  content: { type: String, index: true, required: true },
  createdAt: Date,
  public : Boolean,
  published: Boolean,
  start : Date,
  end : Date,
  media: { type: Schema.ObjectId, ref: 'Media' },
  user: { type: Schema.ObjectId, ref: 'User', required: true },
  categories:[{ type: Schema.ObjectId, ref: 'Category', required: true }],
  updated: [{
  	user : Object,
  	date: Date
  }],
  comments: [{
    user: Object,
    comment: { type: String, index: true },
    name : String,
    date : Date
  }],
  recycled : Boolean
});

var autoPopulateLead = function(next) {
  this.populate('user', 'username image')
    .populate('media', 'title url content')
    .populate('categories', 'title username content')
  next();
};

articleSchema.
  pre('findOne', autoPopulateLead).
  pre('find', autoPopulateLead);

const Article = mongoose.model('Article', articleSchema);

export default Article;
