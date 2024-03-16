const request = require('supertest');
const app = require('../app.js');
const expect = require('chai').expect;

describe('Prueba Products', () => {
  it('GET /api/products should return status 200 and an array of products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('GET /api/products/:id should return status 200 and a single product', async () => {
    const res = await request(app).get('/api/products/1');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('title');
    expect(res.body).to.have.property('description');
    expect(res.body).to.have.property('price');
    expect(res.body).to.have.property('stock');
  });

  it('POST /api/products should create a new product', async () => {
    const newProduct = {
      title: 'Test Product',
      description: 'This is a test product',
      price: 10.99,
      category: 'Test',
      stock: 10
    };

    const res = await request(app)
      .post('/api/products')
      .send(newProduct);
      
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('_id');
  });
});
