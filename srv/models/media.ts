import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const mediaSchema = new mongoose.Schema({
  title: { type: String, index: true, required: true },
  content: { type: String, index: true, required: true },
  createdAt: Date,
  public : Boolean,
  url: String,
  published: Boolean,
  start : Date,
  end : Date,
  user: { type: Schema.ObjectId, ref: 'User', required: true },
  updated: [{
  	user : { type: Schema.ObjectId, ref: 'User' },
  	date: Date
  }],
  recycled : Boolean
});

var autoPopulateLead = function(next) {
  this.populate('user', 'username image')
  next();
};

mediaSchema.
  pre('findOne', autoPopulateLead).
  pre('find', autoPopulateLead);

const Media = mongoose.model('Media', mediaSchema);

export default Media;
