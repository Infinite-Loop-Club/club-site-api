import express from 'express';
import mongoose from 'mongoose';
import Logger from 'js-logger';
import cors from 'cors';
import chalk from 'chalk';
import 'dotenv/config';

import { requestLogger } from './middlewares';
import { UserRouter } from './routers';

const { PORT, DB_SERVER } = process.env;

Logger.useDefaults({
  defaultLevel: process.env.NODE_ENV === 'production' ? Logger.ERROR : Logger.DEBUG,
  formatter: messages => {
    messages.unshift(
      `[${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString()}]`
    );
  }
});

const server = express();

server.use(requestLogger);
server.use(cors());
server.use(express.json());

server.use('/user', UserRouter);

server.get('*', (_req, res) => {
  res.sendStatus(200);
});

server.listen(PORT, async () => {
  Logger.info(`Server started at port ${chalk.magenta(PORT)}`);
  Logger.info(`Listening for requests at: ${chalk.cyan(`http://127.0.0.1:${PORT}`)}`);

  try {
    Logger.debug(`Database server is at ${chalk.cyan(DB_SERVER)}.`);
    const options = { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true };
    await mongoose.connect(DB_SERVER, options);
    Logger.info(`Database connection ${chalk.greenBright('successful.')}`);
  } catch (err) {
    Logger.error(`Database connection ${chalk.redBright('failed.')}`);
    Logger.error(`Error: could not connect to the database at ${DB_SERVER}\n`, err);
  }
});
