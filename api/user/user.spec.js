const assert = require('assert');
const request = require('supertest');
const should = require('should');
const app = require('../../app');

describe('GET /users', () => {
  it('should return 200 status code and user array', done => {
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
          });
          done();
        });
  });
});

describe('GET /users/:id', () => {
  it('should return 200 status code and user object', done => {
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

  it('should return 400 status code on string id', (done) => {
    request(app)
        .get('/users/abc')
        .expect(400)
        .end((err, res) => {
          if (err) throw err;
          res.body.should.have.property('error');
          done();
        });
  });

  it('should return 404 status code on no user', (done) => {
    request(app)
        .get('/users/4')
        .expect(404)
        .end((err, res) => {
          if (err) throw err;
          res.body.should.have.property('error');
          done();
        });
  });
});

describe('DELETE /users/:id', () => {
  it('should return 204 status code', done => {
    request(app)
        .delete('/users/1')
        .expect(204)
        .end((err, res) => {
          if (err) throw err;
          done();
        });
  });

  it('should return 400 status code on string id', (done) => {
    request(app)
        .delete('/users/abc')
        .expect(400)
        .end((err, res) => {
          if (err) throw err;
          res.body.should.have.property('error');
          done();
        });
  });

  it('should return 404 status code on no user', (done) => {
    request(app)
        .delete('/users/4')
        .expect(404)
        .end((err, res) => {
          if (err) throw err;
          res.body.should.have.property('error');
          done();
        });
  });
});

describe('POST /users', () => {
  it('should return 201 status code and new user object', done => {
    const name = 'Daniel';

    request(app)
        .post('/users')
        .expect(201)
        .send({
          name: name
        })
        .end((err, res) => {
          if (err) throw err;
          res.body.should.have.property('id', 4);
          res.body.should.have.property('name', name);
          done();
        });
  });

  it('should return 400 status code on string id', (done) => {
    request(app)
        .post('/users')
        .expect(400)
        .send({
          name: ' '
        })
        .end((err, res) => {
          if (err) throw err;
          res.body.should.have.property('error');
          done();
        });
  });
});
