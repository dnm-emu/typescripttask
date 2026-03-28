import { ITransaction } from './ITransaction.js';
import { ISummary } from './ISummary.js';
export interface IAccount {
    id: string;
    name: string;
    transactions: ITransaction[];
    getBalance(): number;
    getSummary(): ISummary;
    addTransaction(transaction: ITransaction): void;
    removeTransaction(transactionId: string): boolean;
    getSummaryString(): string;
    toString(): string;
}
//# sourceMappingURL=IAccount.d.ts.map