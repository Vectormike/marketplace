import request from 'supertest';
import { expect } from 'chai';
import app from '../src/loaders';

describe('Authentication tests', () => {
  it('register a user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Victor',
        email: 'victorjonah199@gmail.com',
        phoneNumber: '08086249721',
        password: 'Redeemer40',
      });
    expect(201);
  });
});
