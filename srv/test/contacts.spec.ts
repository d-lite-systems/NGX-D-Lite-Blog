import * as chai from 'chai';
import { describe, it } from 'mocha';

process.env.NODE_ENV = 'test';
import { app } from '../index';
import Contact from '../models/contact';

chai.use(require('chai-http')).should();

describe('Contacts', () => {

  beforeEach(done => {
    Contact.remove({}, err => {
      done();
    });
  });

  describe('Backend tests for contacts', () => {

    it('should get all the contacts', done => {
      chai.request(app)
        .get('/api/contacts')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });

    it('should get contacts count', done => {
      chai.request(app)
        .get('/api/contacts/count')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('number');
          res.body.should.be.eql(0);
          done();
        });
    });

    it('should create new contact', done => {
      const contact = new Contact({ title: 'Fluffy', content: 'Quod ei celebrari vilitatem intempestivam urgenti.', createdAt: new Date() });
      chai.request(app)
        .post('/api/contact')
        .send(contact)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.a.property('title');
          res.body.should.have.a.property('content');
          res.body.should.have.a.property('createdAt');
          done();
        });
    });

    it('should get a contact by its id', done => {
      const contact = new Contact({ title: 'Contact', content: 'Vocabulis appellatos fabricarum culpasse tribunos ut adminicula futurae molitioni pollicitos.', createdAt: 'Quod ei celebrari vilitatem intempestivam urgenti.' });
      contact.save((error, newContact) => {
        chai.request(app)
          .get(`/api/contact/${newContact.id}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('title');
            res.body.should.have.property('content');
            res.body.should.have.property('createdAt');
            res.body.should.have.property('_id').eql(newContact.id);
            done();
          });
      });
    });

    it('should update a contact by its id', done => {
      const contact = new Contact({ title: 'Contact', content: 'Vocabulis appellatos fabricarum culpasse tribunos ut adminicula futurae molitioni pollicitos.', createdAt: 'Quod ei celebrari vilitatem intempestivam urgenti.' });
      contact.save((error, newContact) => {
        chai.request(app)
          .put(`/api/contact/${newContact.id}`)
          .send({ content: 'Quod si qui longius in amicitia provecti essent.' })
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
    });

    it('should delete a contact by its id', done => {
      const contact = new Contact({ title: 'Contact', content: 'Vocabulis appellatos fabricarum culpasse tribunos ut adminicula futurae molitioni pollicitos.', createdAt: 'Quod ei celebrari vilitatem intempestivam urgenti.' });
      contact.save((error, newContact) => {
        chai.request(app)
          .del(`/api/contact/${newContact.id}`)
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
    });
  });

});


