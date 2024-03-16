const request = require('supertest');
const app = require('../app.js');
const expect = require('chai').expect;

describe('Carts Router', () => {
  it('POST /api/carts should create a new cart', async () => {
    const res = await request(app).post('/api/carts');
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('_id');
  });

  it('GET /api/carts/:id should return status 200 and a single cart', async () => {
    const res = await request(app).get('/api/carts/1');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('products');
  });
});
