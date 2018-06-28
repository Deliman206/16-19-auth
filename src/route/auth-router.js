'use strict';

import { Router } from 'express';
import { json } from 'body-parser';
import Account from '../model/user-account';
import logger from '../lib/logger';

const authRouter = new Router();
const jsonParser = json();

authRouter.post('/signup', jsonParser, (request, response, next) => { 
  logger.log(logger.INFO, `Request Information ${JSON.stringify(request.body)}`);
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
authRouter.get('/all', (request, response, next) => {
  return Account.find({})
    .then((data) => {
      return response.json(data);
    })
    .catch(next);
});

export default authRouter;
