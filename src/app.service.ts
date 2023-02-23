import { HttpService } from '@nestjs/axios';
import { ForbiddenException, Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AppService {
  constructor(private http: HttpService) {}
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
