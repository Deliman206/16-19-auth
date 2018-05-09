'use strict';

import HttpError from 'http-errors';
import Account from '../model/user-account';

//Send same error in all blocks to increase security

export default (request, response, next) => {
  if (!request.headers.authorization) return next(new HttpError(400, 'Auth- invalid request'))
  
  // parse username and password that we can actually use
  const base64Authheader = request.headers.authorization.split('Basic ')[1];
  if (!base64Authheader) return next(new HttpError(400, 'Auth- invalid request'))

  const stringAuthHeader = Buffer.from(base64Authheader, 'base64').toString();
  // ES6 Notation: creates 2 local variables and assigns to matching array index;
  const [username, password] = stringAuthHeader.split(':');
  if (!username || !password) return next(new HttpError(400, 'Auth- invalid request'))

  return Account.findOne({ username })
    .then((account) => {
      if (!account) return next(new HttpError(400, 'Auth- invalid request'))
      return account.pVerifyPassword(password);
    })
    .then((account) => {
      request.account = account;
      return next(); // This is calling the next function in Server chain
    })
    .catch(next);
};
