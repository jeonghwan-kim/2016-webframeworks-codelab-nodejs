const assert = require('assert');
const request = require('supertest');
const should = require('should');
const app = require('../../app');
const syncDatabase = require('../../bin/sync-database');
const models = require('../../models');

describe('GET /users', () => {
  const users = [{name: 'chris'},{name: 'bek'},{name: 'tim'}]

  before('sync database', (done) => {
    syncDatabase().then(() => done());
  });

  before('inset seed user data', (done) => {
    models.User.bulkCreate(users).then(() => done());
  })

  it('should return 200 status code', (done) => {
    request(app)
        .get('/users')
        .expect(200)
        .end(done);
  });

  it('should return array', (done) => {
    request(app)
        .get('/users')
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          res.body.should.be.an.instanceof(Array).and.have.length(3);
          res.body.map(user => {
            user.should.have.properties('id', 'name');
            user.id.should.be.a.Number();
            user.name.should.be.a.String();
          })
          done();
        });
  });
});

describe('GET /users/:id', () => {
  const users = [{name: 'chris'},{name: 'bek'},{name: 'tim'}]

  before('sync database', (done) => {
    syncDatabase().then(() => done());
  });

  before('inset seed user data', (done) => {
    models.User.bulkCreate(users).then(() => done());
  })

  it('should return 200 status code', (done) => {
    request(app)
        .get('/users/1')
        .expect(200)
        .end(done);
  });

  it('should return 404 status code', (done) => {
    request(app)
        .get('/users/4')
        .expect(404)
        .end((err, res) => {
          if (err) throw err;
          res.body.should.have.property('error');
          done();
        });
  });

  it('should return object', (done) => {
    request(app)
        .get('/users/1')
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          res.body.should.be.an.instanceof(Object)
          res.body.should.have.properties('id', 'name');
          res.body.id.should.be.a.Number();
          res.body.name.should.be.a.String();
          done();
        });
  });
});

describe('POST /users', () => {
  before('sync database', (done) => {
    syncDatabase().then(() => done());
  });

  it('should return 201 status code', (done) => {
    request(app)
        .post('/users')
        .send({
          name: 'foo'
        })
        .expect(201)
        .end(done);
  });

  it('should return new user object', (done) => {
    request(app)
        .post('/users')
        .send({
          name: 'foo'
        })
        .expect(201)
        .end((err, res) => {
          if (err) throw err;
          res.body.should.be.an.instanceof(Object)
          res.body.should.have.properties('id', 'name');
          res.body.id.should.be.a.Number();
          res.body.name.should.be.a.String();
          done();
        });
  });
});
