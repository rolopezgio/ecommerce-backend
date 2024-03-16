const request = require('supertest');
const app = require('../app.js');
const expect = require('chai').expect;

describe('Sessions Router', () => {
  it('POST /api/session/login should log in a user', async () => {
    const res = await request(app)
      .post('/api/session/login')
      .send({ email: 'test@example.com', password: 'password' });
    expect(res.status).to.equal(200);
    expect(res.headers['location']).to.equal('/products');
  });

  it('POST /api/session/register should register a new user', async () => {
    const res = await request(app)
      .post('/api/session/register')
      .send({ nombre: 'Test User', email: 'test@example.com', password: 'password' });
    expect(res.status).to.equal(302);
    expect(res.headers['location']).to.equal('/login');
  });
});
