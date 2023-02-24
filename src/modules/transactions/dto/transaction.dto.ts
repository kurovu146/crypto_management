import { IsOptional, IsString } from 'class-validator';

export class TransactionDTO {
  @IsOptional()
  @IsString()
  token: string;

  @IsOptional()
  @IsString()
  date: string;
}
