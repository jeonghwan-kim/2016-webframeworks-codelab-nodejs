const request = require('supertest');
const should = require('should');
const app = require('../../app');

describe('GET /users', () => {
  it('should return 200 statu code and user array', done => {
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
