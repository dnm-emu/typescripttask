import { ITransaction } from '../interfaces/ITransaction.js';
import { TransactionType } from '../interfaces/TransactionType.js';

export class Transaction implements ITransaction {
  public readonly id: string;
  public amount: number;
  public type: TransactionType;
  public date: Date;
  public description: string;

  constructor(amount: number, type: TransactionType, date: string | Date, description: string) {
    this.id = Transaction.createId();
    this.amount = amount;
    this.type = type;
    this.date = Transaction.normalizeDate(date);
    this.description = description;
  }

  private static createId(): string {
    const randomPart = Math.random().toString(36).slice(2, 8);
    const timePart = Date.now().toString(36).slice(-3);
    return `${randomPart}${timePart}`;
  }

  private static normalizeDate(source: string | Date): Date {
    if (source instanceof Date) {
      return source;
    }
    return new Date(source);
  }

  toString(): string {
    const localizedDate = this.date.toLocaleDateString('ru-RU');
    const sign = this.type === 'income' ? '+' : '-';
    const formattedAmount = `${sign}${this.amount}`;
    return [localizedDate, formattedAmount, this.description].join(' | ');
  }
}
