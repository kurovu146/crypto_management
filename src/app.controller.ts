import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import * as xlsx from 'xlsx';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('read')
  async readFile() {
    const data = xlsx.read('src/transaction.csv', {
      type: 'file',
      cellDates: true,
    });
    const items: any = xlsx.utils.sheet_to_json(data.Sheets['Sheet1']);

    for (const item of items) {
      const date = new Date(item.timestamp * 1000);
      const time = this.appService.fomatDate(date);
      const result = await this.appService.getHello(item.name, time);
      console.log(result.data?.market_data?.current_price?.usd);

      await this.appService.delay(5000);
    }

    return items;
  }
}
