import { IAccountManager } from '../interfaces/IAccountManager.js';
import { IAccount } from '../interfaces/IAccount.js';

export class AccountManager implements IAccountManager {
  public accounts: IAccount[];

  constructor() {
    this.accounts = [];
  }

  addAccount(account: IAccount): void {
    this.accounts.push(account);
  }

  removeAccount(accountId: string): boolean {
    const initialCount = this.accounts.length;
    this.accounts = this.accounts.filter(account => account.id !== accountId);
    return this.accounts.length < initialCount;
  }

  getAccount(accountId: string): IAccount | undefined {
    return this.accounts.find(account => account.id === accountId);
  }

  getAllAccounts(): IAccount[] {
    return [...this.accounts];
  }
}
