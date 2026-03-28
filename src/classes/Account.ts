import { IAccount } from '../interfaces/IAccount.js';
import { ITransaction } from '../interfaces/ITransaction.js';
import { ISummary } from '../interfaces/ISummary.js';

export class Account implements IAccount {
  public readonly id: string;
  public name: string;
  public transactions: ITransaction[];

  constructor(name: string) {
    this.id = Account.createId();
    this.name = name;
    this.transactions = [];
  }

  private static createId(): string {
    const random = Math.random().toString(36).slice(2, 7);
    const timestamp = Date.now().toString(36).slice(-4);
    return `${random}${timestamp}`;
  }

  getBalance(): number {
    return this.transactions.reduce((acc, transaction) => {
      const delta = transaction.type === 'income' ? transaction.amount : -transaction.amount;
      return acc + delta;
    }, 0);
  }

  getSummary(): ISummary {
    const totals = this.transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === 'income') {
          acc.incomeTotal += transaction.amount;
        } else if (transaction.type === 'expense') {
          acc.expenseTotal += transaction.amount;
        }
        return acc;
      },
      { incomeTotal: 0, expenseTotal: 0 },
    );

    return {
      totalIncome: totals.incomeTotal,
      totalExpense: totals.expenseTotal,
      balance: totals.incomeTotal - totals.expenseTotal,
    };
  }

  addTransaction(transaction: ITransaction): void {
    this.transactions.push(transaction);
  }

  removeTransaction(transactionId: string): boolean {
    const originalLength = this.transactions.length;
    this.transactions = this.transactions.filter(t => t.id !== transactionId);
    return this.transactions.length !== originalLength;
  }

  getSummaryString(): string {
    const { balance, totalIncome, totalExpense } = this.getSummary();
    return `${this.name} | Баланс: ${balance} | Доходы: ${totalIncome} | Расходы: ${totalExpense}`;
  }

  toString(): string {
    const balance = this.getBalance();
    return `${this.name} (Баланс: ${balance})`;
  }
}
