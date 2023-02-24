import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { TransactionDTO } from './dto/transaction.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionService: TransactionsService) {}

  @Get()
  async getDataTransaction(@Query() query: TransactionDTO) {
    return this.transactionService.getDataTransaction(query);
  }

  @Get('getUSD')
  async getUSDAmount() {
    const transactions = await this.transactionService.findAll();

    for (const transaction of transactions) {
      const date = new Date(transaction.timestamp * 1000);
      const time = this.transactionService.fomatDate(date);
      const data = await this.transactionService.getUSDAmount(
        transaction.coin.name,
        time,
      );
      transaction.usdAmount =
        data.data?.market_data?.current_price?.usd * transaction.amount;

      transaction.save();
      await this.transactionService.delay(5000);
    }

    return {
      message: 'Successfully!',
      status: HttpStatus.OK,
    };
  }
}
