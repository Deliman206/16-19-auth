'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pRemoveAccountMock } from './lib/user-account-mock';


const apiURL = `http://localhost:${process.env.PORT}/signup`;
jest.setTimeout(10000);

describe('AUTH Router', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemoveAccountMock);

  test('POST should return a 200 status code and a TOKEN', () => {
    return superagent.post(apiURL)
      .send({
        username: 'test1234',
        email: 'test@test.io',
        password: 'test',
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.token).toBeTruthy();
      });
  });
  test('POST should return a 400 status code', () => {
    return superagent.post(apiURL)
      .send({
        username: 'test5678',
        email: '',
        password: 'test',
      })
      .then(Promise.reject)
      .catch((error) => {
        expect(error.status).toEqual(400);
      });
  });
  test('POST should return a 409 status code', () => {
    return superagent.post(apiURL)
      .send({
        username: 'test9012',
        email: 'test@test.io',
        password: 'test',
      })
      .then(() => {
        return superagent.post(apiURL)
          .send({
            username: 'test',
            email: 'test@test.io',
            password: 'test',
          });
      })
      .then(Promise.reject)
      .catch((error) => {
        expect(error.status).toEqual(409);
      });
  });
});
