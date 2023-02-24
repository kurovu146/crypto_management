import { Sequelize } from 'sequelize-typescript';
import { CoinModel } from 'src/models/coin.entity';
import { TransactionModel } from 'src/models/transaction.entity';

const models = [CoinModel, TransactionModel];

const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      await initDatabase();
    },
  },
];

const sequelize = new Sequelize(
  'postgres://tuanvu:admin@localhost:5432/crypto',
  {
    dialect: 'postgres',
  },
);

async function initDatabase() {
  // sequelize model
  sequelize.addModels(models);

  return await sequelize.sync().then(async () => {
    console.log('generate database done');
  });
}

export { databaseProviders, models, initDatabase, sequelize };
