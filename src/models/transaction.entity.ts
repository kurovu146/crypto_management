import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/common/base.common.entity';
import { CoinModel } from './coin.entity';

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
}
const TRANSACTION_TYPE = DataType.ENUM(...Object.values(TransactionType));

@Table({
  tableName: 'transactions',
  indexes: [],
})
export class TransactionModel extends BaseModel {
  @Column
  timestamp: number;

  @Column({
    type: TRANSACTION_TYPE,
    field: 'transaction_type',
  })
  transactionType: TransactionType;

  @ForeignKey(() => CoinModel)
  @Column({
    field: 'coin_id',
  })
  coinId: number;
  @BelongsTo(() => CoinModel)
  coin: CoinModel;

  @Column({
    field: 'amount',
    type: DataType.DOUBLE,
  })
  amount: number;

  @Column({
    field: 'usd_amount',
    type: DataType.DOUBLE,
  })
  usdAmount: number;
}
