import * as chai from 'chai';
import { describe, it } from 'mocha';

process.env.NODE_ENV = 'test';
import { app } from '../index';
import Media from '../models/media';

chai.use(require('chai-http')).should();

describe('Medias', () => {

  beforeEach(done => {
    Media.remove({}, err => {
      done();
    });
  });

  describe('Backend tests for medias', () => {

    it('should get all the medias', done => {
      chai.request(app)
        .get('/api/medias')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });

    it('should get medias count', done => {
      chai.request(app)
        .get('/api/medias/count')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('number');
          res.body.should.be.eql(0);
          done();
        });
    });

    it('should create new media', done => {
      const media = new Media({ title: 'Fluffy', content: 'Quod ei celebrari vilitatem intempestivam urgenti.', createdAt: new Date() });
      chai.request(app)
        .post('/api/media')
        .send(media)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.a.property('title');
          res.body.should.have.a.property('content');
          res.body.should.have.a.property('createdAt');
          done();
        });
    });

    it('should get a media by its id', done => {
      const media = new Media({ title: 'Media', content: 'Vocabulis appellatos fabricarum culpasse tribunos ut adminicula futurae molitioni pollicitos.', createdAt: 'Quod ei celebrari vilitatem intempestivam urgenti.' });
      media.save((error, newMedia) => {
        chai.request(app)
          .get(`/api/media/${newMedia.id}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('title');
            res.body.should.have.property('content');
            res.body.should.have.property('createdAt');
            res.body.should.have.property('_id').eql(newMedia.id);
            done();
          });
      });
    });

    it('should update a media by its id', done => {
      const media = new Media({ title: 'Media', content: 'Vocabulis appellatos fabricarum culpasse tribunos ut adminicula futurae molitioni pollicitos.', createdAt: 'Quod ei celebrari vilitatem intempestivam urgenti.' });
      media.save((error, newMedia) => {
        chai.request(app)
          .put(`/api/media/${newMedia.id}`)
          .send({ content: 'Quod si qui longius in amicitia provecti essent.' })
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
    });

    it('should delete a media by its id', done => {
      const media = new Media({ title: 'Media', content: 'Vocabulis appellatos fabricarum culpasse tribunos ut adminicula futurae molitioni pollicitos.', createdAt: 'Quod ei celebrari vilitatem intempestivam urgenti.' });
      media.save((error, newMedia) => {
        chai.request(app)
          .del(`/api/media/${newMedia.id}`)
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
    });
  });

});


