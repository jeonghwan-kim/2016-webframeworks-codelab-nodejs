const assert = require('assert');
const request = require('supertest');
const app = require('../../app');

describe('GET /users', () => {
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
          assert.equal((res.body instanceof Array), true);
          done();
        });
  });
});
