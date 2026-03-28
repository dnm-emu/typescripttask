import { ITransaction } from '../interfaces/ITransaction.js';
import { TransactionType } from '../interfaces/TransactionType.js';
export declare class Transaction implements ITransaction {
    readonly id: string;
    amount: number;
    type: TransactionType;
    date: Date;
    description: string;
    constructor(amount: number, type: TransactionType, date: string | Date, description: string);
    private static createId;
    private static normalizeDate;
    toString(): string;
}
//# sourceMappingURL=Transaction.d.ts.map