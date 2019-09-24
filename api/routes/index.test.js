const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

const should = chai.should();

chai.use(chaiHttp);
describe('test', () => {
  beforeEach(done => {
    done();
  });

  describe('/GET appview data', () => {
    it('it should GET negotiation data', done => {
      chai
        .request(app)
        .get('/api/apps/negotiation')
        .end((err, res) => {
          should.not.exist(err);
          should.exist(res);
          res.body.should.be.a('object');
          res.body.should.have.property('shops');
          done();
        });
    });

    it('it should GET ezicompare data', done => {
      chai
        .request(app)
        .get('/api/apps/ezicompare')
        .end((err, res) => {
          should.not.exist(err);
          should.exist(res);
          res.body.should.be.a('object');
          res.body.should.have.property('shops');
          done();
        });
    });
  });
});

describe('test', () => {
  beforeEach(done => {
    done();
  });

  describe('/GET landingpage data', () => {
    it('it should GET a object', done => {
      chai
        .request(app)
        .get('/api/apps')
        .end((err, res) => {
          res.body.should.be.a('object');
          res.body.should.have.property('statistics');
          done();
        });
    });

    it('it should GET a objects', done => {
      chai
        .request(app)
        .get('/api/apps')
        .end((err, res) => {
          res.body.should.be.a('object');
          res.body.should.have.property('statistics');
          done();
        });
    });
  });

  describe('test', () => {
    beforeEach(done => {
      done();
    });

    describe('/GET data shopview', () => {
      it('it should GET a object', done => {
        chai
          .request(app)
          .get('/shopview/ezicompare/danbilr.myshopify.com')
          .end((err, res) => {
            res.body.should.be.a('object');
            done();
          });
      });
    });
  });
});

describe('test', () => {
  beforeEach(done => {
    done();
  });

  describe('/GET user data', () => {
    const user = { email: 'Huy111@gmail.com', password: 'Huy111', name: 'Huy111', role: 'Admin' };

    it('it should GET user data', done => {
      chai
        .request(app)
        .get('/api/users')
        .end((err, res) => {
          should.not.exist(err);
          should.exist(res);
          res.body.should.be.a('object');
          res.body.should.have.property('users');
          done();
        });
    });

    it('it should POST user data', done => {
      chai
        .request(app)
        .post('/api/users')
        .send({ user })
        .end((err, res) => {
          should.not.exist(err);
          should.exist(res);
          res.body.should.be.a('object');
          res.body.should.have.property('user');
          done();
        });
    });

    it('it should PATCH user data', done => {
      chai
        .request(app)
        .patch(`/api/users/${user.email}`)
        .send({ user })
        .end((err, res) => {
          res.status.should.be.equal(204);
          done();
        });
    });

    it('it should DELETE user data', done => {
      chai
        .request(app)
        .delete(`/api/users/${user.email}`)
        .end((err, res) => {
          res.status.should.be.equal(204);
          done();
        });
    });
  });
});

// test send mail
describe('test', () => {
  beforeEach(done => {
    done();
  });
  describe('/GET mails data', () => {
    const mail = { subject: 'Hello 2018', body: 'Hi vn' };

    it('it should GET mails data', done => {
      chai
        .request(app)
        .get('/api/mails')
        .end((err, res) => {
          should.not.exist(err);
          should.exist(res);
          res.body.should.be.a('object');
          res.body.should.have.property('mails');
          done();
        });
    });
    it('it should POST mails data', done => {
      chai
        .request(app)
        .post('/api/mails')
        .send({ subject: 'Hello 2018', body: 'Hi vn' })
        .end((err, res) => {
          should.not.exist(err);
          should.exist(res);
          res.body.should.be.a('object');
          res.body.should.have.property('mails');
          done();
        });
    });
    it('it should PATCH mails data', done => {
      chai
        .request(app)
        .patch('/api/mails')
        .send({ mail })
        .send()
        .end((err, res) => {
          res.status.should.be.equal(404);
          done();
        });
    });
    it('it should DELETE mails data', done => {
      chai
        .request(app)
        .delete(`/api/mails/${mail.subject}`)
        .end((err, res) => {
          res.status.should.be.equal(204);
          done();
        });
    });
  });
});
