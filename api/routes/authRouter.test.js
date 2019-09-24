const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

const should = chai.should();

chai.use(chaiHttp);
describe('test', () => {
  beforeEach(done => {
    done();
  });

  describe('authenticate user', () => {
    it('it should post login wrong', done => {
      const info = {
        email: 'nguyendinhtin27011998@gmail.com',
        password: 'not_admin',
      };
      chai
        .request(app)
        .post('/auth/login')
        .send(info)
        .end((err, res) => {
          should.not.exist(err);
          should.exist(res);
          res.status.should.be.equal(403);
          done();
        });
    });

    it('it should post login error', done => {
      const info = {
        email: '',
        password: '',
      };
      chai
        .request(app)
        .post('/auth/login')
        .send(info)
        .end((err, res) => {
          should.not.exist(err);
          should.exist(res);
          res.status.should.be.equal(400);
          done();
        });
    });

    it('it should post login invalid', done => {
      const info = {
        email: '',
        password: '',
      };
      chai
        .request(app)
        .post('/auth/login')
        .send(info)
        .end((err, res) => {
          should.not.exist(err);
          should.exist(res);
          res.status.should.be.equal(400);
          done();
        });
    });

    it('it should post code verification invalid', done => {
      const info = {
        email: '',
        code: '',
      };
      chai
        .request(app)
        .post('/auth/verifiedCode')
        .send(info)
        .end((err, res) => {
          should.not.exist(err);
          should.exist(res);
          res.status.should.be.equal(400);
          done();
        });
    });

    it('it should post code verification wrong', done => {
      const info = {
        email: 'nguyendinhtin27011998@gmail.com',
        code: '696969-696969',
      };
      chai
        .request(app)
        .post('/auth/verifiedCode')
        .send(info)
        .end((err, res) => {
          should.not.exist(err);
          should.exist(res);
          res.status.should.be.equal(403);
          done();
        });
    });
  });
});
