'use strict';

import { json } from 'body-parser';
import { Router } from 'express';
import HttpError from 'http-errors';
import Account from '../model/user-account';
import basicAuthMiddleware from '../lib/basic-auth-middleware';
import logger from '../lib/logger';

const authRouter = new Router();
const jsonParser = json();

authRouter.post('/signup', jsonParser, (request, response, next) => {
  return Account.create(request.body.email, request.body.username, request.body.password)
    .then((account) => {
      delete request.body.password;
      logger.log(logger.INFO, 'AUTH - creating TOKEN');
      return account.pCreateToken();
    })
    .then((token) => {
      logger.log(logger.INFO, 'AUTH - returning a 200 code and a token');
      return response.json({ token });
    })
    .catch(next);
});

authRouter.get('/login', basicAuthMiddleware, (request, response, next) => {
  if (!request.account) return next(new HttpError(400, 'Auth- invalid request'))
  return request.account.pCreateToken()
    .then((token) => {
      logger.log(logger.INFO, 'Responding with 200 status and Token');
      return response.json({ token });
    })
    .catch(next)
});

export default authRouter;
