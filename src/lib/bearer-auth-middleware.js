'use strict';

import HttpError from 'http-errors';
import jsonWebToken from 'jsonwebtoken';
import Account from '../model/user-account';

const promisify = callbackStyleFunction => (...args) => {
// here I ahve 2 set of arguements
// fn -> the function we want to promisify
// the set of arguemnets of the original function
// console.log('hound')    console.log is the callbackStylefunction 
// hound is the args
  return new Promise((resolve, reject) => {
    callbackStyleFUnction(...args,(error, data) => {
      if (error) return reject(error)
      return resolve(data);
    });
  });
};

export default (request, response, next) => {
  if(!request.headers.authorization) return next(new HttpError(400, 'AUTH - invalid request'))

  const token = request.headers.authorization.split('Bearer ')[1];

  if (!token) return next(new HttpError(400, 'AUTH - invalid request'))

  return promisify(jsonWebToken.verify)(token, process.env.SOUND_CLOUD_SECRET)
    .catch((error) => Promise.reject(new HttpError(400, `AUTH- jsonWebTOken Error: ${error}`)))
    .then((decryptedToken) => { //this is a tokenSeed not just decryptedData
      return Account.findOne({ tokenSeed: decryptedToken.tokenSeed });
    })
    .then((account) => {
      if (!account) return next(new HttpError(400, 'AUTH - invalid request'))
      request.account = account;
      return next();
    })
    .catch(next);
}