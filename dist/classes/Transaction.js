export class Transaction {
    constructor(amount, type, date, description) {
        this.id = Transaction.createId();
        this.amount = amount;
        this.type = type;
        this.date = Transaction.normalizeDate(date);
        this.description = description;
    }
    static createId() {
        const randomPart = Math.random().toString(36).slice(2, 8);
        const timePart = Date.now().toString(36).slice(-3);
        return `${randomPart}${timePart}`;
    }
    static normalizeDate(source) {
        if (source instanceof Date) {
            return source;
        }
        return new Date(source);
    }
    toString() {
        const localizedDate = this.date.toLocaleDateString('ru-RU');
        const sign = this.type === 'income' ? '+' : '-';
        const formattedAmount = `${sign}${this.amount}`;
        return [localizedDate, formattedAmount, this.description].join(' | ');
    }
}
//# sourceMappingURL=Transaction.js.map