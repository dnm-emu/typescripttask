import { IAccountManager } from '../interfaces/IAccountManager.js';
import { IAccount } from '../interfaces/IAccount.js';
export declare class AccountManager implements IAccountManager {
    accounts: IAccount[];
    constructor();
    addAccount(account: IAccount): void;
    removeAccount(accountId: string): boolean;
    getAccount(accountId: string): IAccount | undefined;
    getAllAccounts(): IAccount[];
}
//# sourceMappingURL=AccountManager.d.ts.map