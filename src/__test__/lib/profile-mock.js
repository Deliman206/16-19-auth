'use strict';

import faker from 'faker';
import Profile from '../../model/profile-model';
import { pCreateAccountMock, pRemoveAccountMock } from './user-account-mock';

const pCreateProfileMock = () => {
  const resultMock = {};

  return pCreateAccountMock()
    .then((accountSetMock) => {
      resultMock.accountSetMock = accountSetMock; // save information into result

      return new Profile({
        bio: faker.lorem.words(10),
        avatar: faker.random.image(),
        lastName: faker.name.lastName(),
        firstName: faker.name.lastName(),
        account: accountSetMock.account._id, // Sets up the relationship
      }).save();
    })
    .then((profile) => {
      resultMock.profile = profile;
      return resultMock;
    });
};
const pRemoveProfileMock = () => { return Promise.all([Profile.remove({}), pRemoveAccountMock(),])};

export default { pCreateProfileMock, pRemoveProfileMock }