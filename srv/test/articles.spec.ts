import * as chai from 'chai';
import { describe, it } from 'mocha';

process.env.NODE_ENV = 'test';
import { app } from '../index';
import Article from '../models/article';

chai.use(require('chai-http')).should();

describe('Articles', () => {

  beforeEach(done => {
    Article.remove({}, err => {
      done();
    });
  });

  describe('Backend tests for articles', () => {

    it('should get all the articles', done => {
      chai.request(app)
        .get('/api/articles')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });

    it('should get articles count', done => {
      chai.request(app)
        .get('/api/articles/count')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('number');
          res.body.should.be.eql(0);
          done();
        });
    });

    it('should create new article', done => {
      const article = new Article({ title: 'Fluffy', content: 'Quod ei celebrari vilitatem intempestivam urgenti.', createdAt: new Date() });
      chai.request(app)
        .post('/api/article')
        .send(article)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.a.property('title');
          res.body.should.have.a.property('content');
          res.body.should.have.a.property('createdAt');
          done();
        });
    });

    it('should get a article by its id', done => {
      const article = new Article({ title: 'Article', content: 'Vocabulis appellatos fabricarum culpasse tribunos ut adminicula futurae molitioni pollicitos.', createdAt: 'Quod ei celebrari vilitatem intempestivam urgenti.' });
      article.save((error, newArticle) => {
        chai.request(app)
          .get(`/api/article/${newArticle.id}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('title');
            res.body.should.have.property('content');
            res.body.should.have.property('createdAt');
            res.body.should.have.property('_id').eql(newArticle.id);
            done();
          });
      });
    });

    it('should update a article by its id', done => {
      const article = new Article({ title: 'Article', content: 'Vocabulis appellatos fabricarum culpasse tribunos ut adminicula futurae molitioni pollicitos.', createdAt: 'Quod ei celebrari vilitatem intempestivam urgenti.' });
      article.save((error, newArticle) => {
        chai.request(app)
          .put(`/api/article/${newArticle.id}`)
          .send({ content: 'Quod si qui longius in amicitia provecti essent.' })
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
    });

    it('should delete a article by its id', done => {
      const article = new Article({ title: 'Article', content: 'Vocabulis appellatos fabricarum culpasse tribunos ut adminicula futurae molitioni pollicitos.', createdAt: 'Quod ei celebrari vilitatem intempestivam urgenti.' });
      article.save((error, newArticle) => {
        chai.request(app)
          .del(`/api/article/${newArticle.id}`)
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
    });
  });

});


