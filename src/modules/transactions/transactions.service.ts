import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import axios from 'axios';
import { CoinModel } from 'src/models/coin.entity';
import {
  TransactionModel,
  TransactionType,
} from 'src/models/transaction.entity';
import { TransactionDTO } from './dto/transaction.dto';
import { Op } from 'sequelize';

@Injectable()
export class TransactionsService {
  async getDataTransaction(query: TransactionDTO) {
    const tokens = await CoinModel.findAll();
    const result = [];

    if (query.date && query.token) {
      const timestamp = new Date(query.date);
      const coin = await CoinModel.findOne({ where: { symbol: query.token } });
      const transactions = await TransactionModel.findAll({
        where: {
          timestamp: {
            [Op.between]: [
              timestamp.getTime() / 1000,
              timestamp.getTime() / 1000 + 86400,
            ],
          },
          coinId: coin.id,
        },
      });
      let portfolio = 0;

      for (const transaction of transactions) {
        const usdAmount =
          transaction.transactionType == TransactionType.DEPOSIT
            ? -transaction.usdAmount
            : transaction.usdAmount;
        portfolio += usdAmount;
      }

      return {
        token: query.token,
        portfolio,
      };
    }

    if (query.date) {
      const timestamp = new Date(query.date);
      const tokens = await CoinModel.findAll();

      for (const token of tokens) {
        let portfolio = 0;
        const transactions = await TransactionModel.findAll({
          where: {
            coinId: token.id,
            timestamp: {
              [Op.between]: [
                timestamp.getTime() / 1000,
                timestamp.getTime() / 1000 + 86400,
              ],
            },
          },
        });

        for (const transaction of transactions) {
          const usdAmount =
            transaction.transactionType == TransactionType.DEPOSIT
              ? -transaction.usdAmount
              : transaction.usdAmount;
          portfolio += usdAmount;
        }

        result.push({
          portfolio,
          token: token.symbol,
        });
      }

      return result;
    }

    if (query.token) {
      const coin = tokens.find((item) => {
        if (item.symbol == query.token) return item;
      });
      let portfolio = 0;
      const transactions = await TransactionModel.findAll({
        where: {
          coinId: coin.id,
        },
      });

      for (const transaction of transactions) {
        const usdAmount =
          transaction.transactionType == TransactionType.DEPOSIT
            ? -transaction.usdAmount
            : transaction.usdAmount;
        portfolio += usdAmount;
      }

      return {
        portfolio,
        token: query.token,
      };
    }

    if (!tokens) {
      throw new HttpException('Token not found!', HttpStatus.NOT_FOUND);
    }

    for (const token of tokens) {
      let portfolio = 0;
      const transactions = await TransactionModel.findAll({
        where: {
          coinId: token.id,
        },
      });

      for (const transaction of transactions) {
        const usdAmount =
          transaction.transactionType == TransactionType.DEPOSIT
            ? -transaction.usdAmount
            : transaction.usdAmount;
        portfolio += usdAmount;
      }

      result.push({
        portfolio,
        token: token.symbol,
      });
    }

    return result;
  }

  async findAll() {
    return TransactionModel.findAll({ include: [CoinModel] });
  }

  async getUSDAmount(coin: string, time: string) {
    const data = await axios({
      method: 'GET',
      url: `https://api.coingecko.com/api/v3/coins/${coin}/history?date=${time}`,
    }).catch(() => {
      throw new ForbiddenException('API not available');
    });

    return data;
  }

  async getHello(coin: string, time: string) {
    const data = await axios({
      method: 'GET',
      url: `https://api.coingecko.com/api/v3/coins/${coin}/history?date=${time}`,
    }).catch(() => {
      throw new ForbiddenException('API not available');
    });

    return data;
  }

  async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  fomatDate(date) {
    const year = date.getFullYear();
    const month = date.getMonth(); // getMonth returns a zero-based index of the month: 0-11
    const day = date.getDate(); // 0 - 31
    const addZero = (num) => `${num}`.padStart(2, '0');

    return addZero(day) + '-' + addZero(month + 1) + '-' + year;
  }
}
