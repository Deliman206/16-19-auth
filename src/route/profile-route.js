'use strict';

import { json } from 'body-parser';
import { Router } from 'express';
import HttpError from 'http-errors';
import Profile from '../model/profile-model';
import bearerAuthMiddleware from '../lib/bearer-auth-middleware';
import logger from '../lib/logger';

const profileRouter = new Router();
const jsonParser = json();

profileRouter.post('/profiles', bearerAuthMiddleware, (request, response, next) => {
  if (!request.account) return next(new HttpError(400, 'AUTH - invalid request'))

  return new Profile({
    ...request.body,
    account: request.account._id,
  })
    .save()
    .then((profile) => {
      logger.log(logger.INFO, 'PROFILE ROUTER: return 200 Status and new Profile');
      return response.json(profile);
    })
    .catch(next);
});

profileRouter.get('/profiles/:id', bearerAuthMiddleware, (request, response, next) => {
  return Profile.findById(request.params.id)
    .then((profile) => {
      if (!profile) {
        logger.log(logger.ERROR, 'PROFILE ROUTER: responding with 400 Status');
        return next(new HttpErrors(400, 'AUTH - invalid request'));
      }
      logger.log(logger.INFO, 'PROFILE ROUTER: responding with 200 status code');
      logger.log(logger.INFO, `PROFILE ROUTER: ${JSON.stringify(profile)}`);
      return response.json(profile);
    })
    .catch(next);
});

export default profileRouter;
