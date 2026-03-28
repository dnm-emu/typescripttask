export class AccountManager {
    constructor() {
        this.accounts = [];
    }
    addAccount(account) {
        this.accounts.push(account);
    }
    removeAccount(accountId) {
        const initialCount = this.accounts.length;
        this.accounts = this.accounts.filter(account => account.id !== accountId);
        return this.accounts.length < initialCount;
    }
    getAccount(accountId) {
        return this.accounts.find(account => account.id === accountId);
    }
    getAllAccounts() {
        return [...this.accounts];
    }
}
//# sourceMappingURL=AccountManager.js.map