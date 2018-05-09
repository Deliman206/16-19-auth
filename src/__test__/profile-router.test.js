'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pCreateAccountMock, pRemoveAccountMock } from './lib/user-account-mock';
import { pRemoveProfileMock } from './lib/profile-mock';

const apiURL = `http://localhost:${process.env.PORT}`;

describe('Verify routes /profile', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemoveProfileMock);

  test('POST - /profiles should get 200 status and new Profile', () => {
    let accountMock = null;
    return pCreateAccountMock()
      .then((accountSetMock) => {
        accountMock = accountSetMock;
        return superagent.post(`${apiURL}/profiles`)
        .set('Authorization', `Bearer ${accountSetMock.token}`) //capital 'A' is required by http protocol
          .send({
            bio: 'I am the cutest Bully ever!',
            firstName: 'Kona',
            lastName: 'Miller',
          })
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.account).toEqual(accountMock.account._id.toString());
        expect(response.body.firstName).toEqual('Kona');
        expect(response.body.lastName).toEqual('Miller');
      });
  });
  test('GET /profiles/:id Should recieve 200 status for retrieval of ID in DB', () => {
    let accountMock = null;
    return pCreateAccountMock()
      .then((accountSetMock) => {
        accountMock = accountSetMock;
        return superagent.get(`${apiURL}/profiles/${accountSetMock._id}`)
          .then((response) => {
            expect(response.status).toEqual(200);
          });
      });
  });
});