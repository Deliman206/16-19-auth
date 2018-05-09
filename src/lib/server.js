'use strict';

import express from 'express';
import mongoose from 'mongoose';
import logger from './logger';
import authRoutes from '../route/auth-router';
import loggerMiddleware from './logger-middleware';
import errorMiddleware from './error-middleware';
import profileRoute from '../route/profile-route';

const app = express();
let server = null;

app.use(loggerMiddleware);
app.use(authRoutes);
app.use(profileRoute);
app.all('*', (request, response) => {
  logger.log(logger.INFO, 'Returning 404 for catch-all route');
  return response.sendStatus(404);
});
app.use(errorMiddleware);

const startServer = () => {
  return mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      server = app.listen(process.env.PORT, () => {
        logger.log(logger.INFO, `Server is listening on port ${process.env.PORT}`);
      });
    });
};
const stopServer = () => {
  return mongoose.disconnect()
    .then(() => {
      server.close(() => {
        logger.log(logger.INFO, 'Server is off');
      });
    });
};

export { startServer, stopServer };
