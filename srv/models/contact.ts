import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const contactSchema = new mongoose.Schema({
  email: { type: String, index: true, required: true },
  name: { type: String, index: true, required: true },
  subject: { type: String, index: true, required: true },
  text: { type: String, index: true, required: true },
  createdAt: Date
});

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
