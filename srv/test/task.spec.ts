import * as chai from 'chai';
import { describe, it } from 'mocha';

process.env.NODE_ENV = 'test';
import { app } from '../index';
import Task from '../models/task';

chai.use(require('chai-http')).should();

describe('Tasks', () => {

  beforeEach(done => {
    Task.remove({}, err => {
      done();
    });
  });

  describe('Backend tests for tasks', () => {

    it('should get all the tasks', done => {
      chai.request(app)
        .get('/api/tasks')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });

    it('should get tasks count', done => {
      chai.request(app)
        .get('/api/tasks/count')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('number');
          res.body.should.be.eql(0);
          done();
        });
    });

    it('should create new task', done => {
      const task = new Task({ title: 'Fluffy', content: 'Quod ei celebrari vilitatem intempestivam urgenti.', createdAt: new Date() });
      chai.request(app)
        .post('/api/task')
        .send(task)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.a.property('title');
          res.body.should.have.a.property('content');
          res.body.should.have.a.property('createdAt');
          done();
        });
    });

    it('should get a task by its id', done => {
      const task = new Task({ title: 'Task', content: 'Vocabulis appellatos fabricarum culpasse tribunos ut adminicula futurae molitioni pollicitos.', createdAt: 'Quod ei celebrari vilitatem intempestivam urgenti.' });
      task.save((error, newTask) => {
        chai.request(app)
          .get(`/api/task/${newTask.id}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('title');
            res.body.should.have.property('content');
            res.body.should.have.property('createdAt');
            res.body.should.have.property('_id').eql(newTask.id);
            done();
          });
      });
    });

    it('should update a task by its id', done => {
      const task = new Task({ title: 'Task', content: 'Vocabulis appellatos fabricarum culpasse tribunos ut adminicula futurae molitioni pollicitos.', createdAt: 'Quod ei celebrari vilitatem intempestivam urgenti.' });
      task.save((error, newTask) => {
        chai.request(app)
          .put(`/api/task/${newTask.id}`)
          .send({ content: 'Quod si qui longius in amicitia provecti essent.' })
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
    });

    it('should delete a task by its id', done => {
      const task = new Task({ title: 'Task', content: 'Vocabulis appellatos fabricarum culpasse tribunos ut adminicula futurae molitioni pollicitos.', createdAt: 'Quod ei celebrari vilitatem intempestivam urgenti.' });
      task.save((error, newTask) => {
        chai.request(app)
          .del(`/api/task/${newTask.id}`)
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
    });
  });

});


