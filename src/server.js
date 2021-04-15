import express from 'express';
import mongoose from 'mongoose';
import Logger from 'js-logger';
import cors from 'cors';
import chalk from 'chalk';
import 'dotenv/config';

import { requestLogger } from 'middlewares';
import { PostRouter, UserRouter } from 'routers';

const { PORT, HOST, DEV_DB_SERVER, TEST_DB_SERVER, PROD_DB_SERVER, NODE_ENV } = process.env;

const DB_SERVER =
  NODE_ENV === 'production' ? PROD_DB_SERVER : NODE_ENV === 'test' ? TEST_DB_SERVER : DEV_DB_SERVER;
const LOGGER_LEVEL =
  NODE_ENV === 'production' ? Logger.ERROR : NODE_ENV === 'test' ? Logger.OFF : Logger.DEBUG;

Logger.useDefaults({
  defaultLevel: LOGGER_LEVEL,
  formatter: messages => {
    messages.unshift(
      `[${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString()}]`
    );
  }
});

const app = express();

if (NODE_ENV !== 'test') app.use(requestLogger);
app.use(cors());
app.use(express.json());

app.use('/user', UserRouter);
app.use('/post', PostRouter);

app.get('*', (_req, res) => {
  res.sendStatus(200);
});

const server = app.listen(PORT, HOST);

server.once('listening', async () => {
  const { address, port } = server.address();
  Logger.info(`Server started at port ${chalk.magenta(port)}`);
  Logger.info(`Listening for requests at: ${chalk.cyan(address + ':' + port)}`);

  try {
    Logger.debug(`Database server is at ${chalk.cyan(DB_SERVER)}`);
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    };
    await mongoose.connect(DB_SERVER, options);
    Logger.info(`Database connection ${chalk.greenBright('successful')}`);
  } catch (err) {
    Logger.error(`Database connection ${chalk.redBright('failed.')}`);
    Logger.error(`Error: could not connect to the database at ${DB_SERVER}\n`, err);
  }
});

server.on('error', err => {
  Logger.error(chalk.red(err.name));
  Logger.warn(chalk.yellow(err.message));
  Logger.info(err.stack);
});

module.exports = server;
