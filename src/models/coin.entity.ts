import { Column, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/common/base.common.entity';

@Table({
  tableName: 'coins',
  indexes: [],
})
export class CoinModel extends BaseModel {
  @Column
  symbol: string;

  @Column
  name: string;
}
