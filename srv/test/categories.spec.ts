import * as chai from 'chai';
import { describe, it } from 'mocha';

process.env.NODE_ENV = 'test';
import { app } from '../index';
import Category from '../models/category';

chai.use(require('chai-http')).should();

describe('Categories', () => {

  beforeEach(done => {
    Category.remove({}, err => {
      done();
    });
  });

  describe('Backend tests for categories', () => {

    it('should get all the categories', done => {
      chai.request(app)
        .get('/api/categories')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });

    it('should get categories count', done => {
      chai.request(app)
        .get('/api/categories/count')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('number');
          res.body.should.be.eql(0);
          done();
        });
    });

    it('should create new category', done => {
      const category = new Category({ title: 'Fluffy', content: 'Quod ei celebrari vilitatem intempestivam urgenti.', createdAt: new Date() });
      chai.request(app)
        .post('/api/category')
        .send(category)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.a.property('title');
          res.body.should.have.a.property('content');
          res.body.should.have.a.property('createdAt');
          done();
        });
    });

    it('should get a category by its id', done => {
      const category = new Category({ title: 'Category', content: 'Vocabulis appellatos fabricarum culpasse tribunos ut adminicula futurae molitioni pollicitos.', createdAt: 'Quod ei celebrari vilitatem intempestivam urgenti.' });
      category.save((error, newCategory) => {
        chai.request(app)
          .get(`/api/category/${newCategory.id}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('title');
            res.body.should.have.property('content');
            res.body.should.have.property('createdAt');
            res.body.should.have.property('_id').eql(newCategory.id);
            done();
          });
      });
    });

    it('should update a category by its id', done => {
      const category = new Category({ title: 'Category', content: 'Vocabulis appellatos fabricarum culpasse tribunos ut adminicula futurae molitioni pollicitos.', createdAt: 'Quod ei celebrari vilitatem intempestivam urgenti.' });
      category.save((error, newCategory) => {
        chai.request(app)
          .put(`/api/category/${newCategory.id}`)
          .send({ content: 'Quod si qui longius in amicitia provecti essent.' })
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
    });

    it('should delete a category by its id', done => {
      const category = new Category({ title: 'Category', content: 'Vocabulis appellatos fabricarum culpasse tribunos ut adminicula futurae molitioni pollicitos.', createdAt: 'Quod ei celebrari vilitatem intempestivam urgenti.' });
      category.save((error, newCategory) => {
        chai.request(app)
          .del(`/api/category/${newCategory.id}`)
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
    });
  });

});


