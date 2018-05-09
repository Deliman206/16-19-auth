'use strict';

import faker from 'faker';
import Account from '../../model/user-account';

const pCreateAccountMock = () => {
  const mock = {};
  mock.request = {
    email: faker.internet.email(),
    username: faker.internet.userName(),
    password: faker.lorem.words(3),
  };
  return Account.create(mock.request.email, mock.request.username, mock.request.password)
    .then((account) => {
      mock.account = account;
      return account.pCreateToken();
    })
    .then((token) => {
      mock.token = token;
      return Account.findById(mock.account._id);
    })
    .then((account) => {
      mock.account = account;
      return mock;
    });
};

const pRemoveAccountMock = () => Account.remove({});

export { pCreateAccountMock, pRemoveAccountMock };
