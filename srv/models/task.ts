import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const taskSchema = new mongoose.Schema({
  actions: Array,
  categories:[{ type: Schema.ObjectId, ref: 'Category', required: true }],
  color: Object,
  comments: [{
    user: { type: Schema.ObjectId, ref: 'User', required: true },
    comment: { type: String, index: true },
    name: String,
    date: Date
  }],
  content: { type: String, index: true, required: true },
  createdAt: Date,
  draggable: Boolean,
  end: Date,
  media: { type: Schema.ObjectId, ref: 'Media' },
  public: Boolean,
  published: Boolean,
  recycled: Boolean,
  resizable: Object,
  start: Date,
  title: { type: String, index: true, required: true },
  updated: [{
  	user : { type: Schema.ObjectId, ref: 'User', required: true },
  	date: Date
  }],
  user: { type: Schema.ObjectId, ref: 'User', required: true },
});

var autoPopulateLead = function(next) {
  this.populate('user', 'username image')
    .populate('media', 'title url content')
    .populate('categories', 'title username content')
    .populate('comments.user', 'username image');
  next();
};

taskSchema.
  pre('findOne', autoPopulateLead).
  pre('find', autoPopulateLead);

const Task = mongoose.model('Task', taskSchema);

export default Task;
