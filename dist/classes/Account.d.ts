import { IAccount } from '../interfaces/IAccount.js';
import { ITransaction } from '../interfaces/ITransaction.js';
import { ISummary } from '../interfaces/ISummary.js';
export declare class Account implements IAccount {
    readonly id: string;
    name: string;
    transactions: ITransaction[];
    constructor(name: string);
    private static createId;
    getBalance(): number;
    getSummary(): ISummary;
    addTransaction(transaction: ITransaction): void;
    removeTransaction(transactionId: string): boolean;
    getSummaryString(): string;
    toString(): string;
}
//# sourceMappingURL=Account.d.ts.map