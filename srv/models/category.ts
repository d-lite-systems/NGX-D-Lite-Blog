import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const categorySchema = new mongoose.Schema({
  title: { type: String, index: true, required: true },
  content: { type: String, index: true, required: true },
  createdAt: Date,
  public : Boolean,
  published: Boolean,
  start : Date,
  end : Date,
  media: { type: Schema.ObjectId, ref: 'Media' },
  user: { type: Schema.ObjectId, ref: 'User', required: true },
  updated: [{
  	user : Object,
  	date: Date
  }],
  comments: [{
    user: Object,
    comment: Object,
    name : String,
    date : Date
  }],
  recycled : Boolean
});

var autoPopulateLead = function(next) {
  this.populate('user', 'username image')
      .populate('media', 'title url content')    
  next();
};

categorySchema.
  pre('findOne', autoPopulateLead).
  pre('find', autoPopulateLead);

const Category = mongoose.model('Category', categorySchema);

export default Category;
