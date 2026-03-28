export class Account {
    constructor(name) {
        this.id = Account.createId();
        this.name = name;
        this.transactions = [];
    }
    static createId() {
        const random = Math.random().toString(36).slice(2, 7);
        const timestamp = Date.now().toString(36).slice(-4);
        return `${random}${timestamp}`;
    }
    getBalance() {
        return this.transactions.reduce((acc, transaction) => {
            const delta = transaction.type === 'income' ? transaction.amount : -transaction.amount;
            return acc + delta;
        }, 0);
    }
    getSummary() {
        const totals = this.transactions.reduce((acc, transaction) => {
            if (transaction.type === 'income') {
                acc.incomeTotal += transaction.amount;
            }
            else if (transaction.type === 'expense') {
                acc.expenseTotal += transaction.amount;
            }
            return acc;
        }, { incomeTotal: 0, expenseTotal: 0 });
        return {
            totalIncome: totals.incomeTotal,
            totalExpense: totals.expenseTotal,
            balance: totals.incomeTotal - totals.expenseTotal,
        };
    }
    addTransaction(transaction) {
        this.transactions.push(transaction);
    }
    removeTransaction(transactionId) {
        const originalLength = this.transactions.length;
        this.transactions = this.transactions.filter(t => t.id !== transactionId);
        return this.transactions.length !== originalLength;
    }
    getSummaryString() {
        const { balance, totalIncome, totalExpense } = this.getSummary();
        return `${this.name} | Баланс: ${balance} | Доходы: ${totalIncome} | Расходы: ${totalExpense}`;
    }
    toString() {
        const balance = this.getBalance();
        return `${this.name} (Баланс: ${balance})`;
    }
}
//# sourceMappingURL=Account.js.map