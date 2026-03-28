import { AccountManager } from './AccountManager.js';
export declare class ApplicationController {
    readonly accountManager: AccountManager;
    private activeView;
    private openedAccountId;
    constructor();
    start(): void;
    private bootstrapDemoData;
    private getRootContainer;
    showAccountsOverview(): void;
    private attachOverviewHandlers;
    private showCreateAccountForm;
    private handleCreateAccountSubmit;
    private openAccountDetails;
    private renderAccountDetails;
    private attachAccountDetailsHandlers;
    private showAddTransactionForm;
    private handleAddTransactionSubmit;
    private removeTransaction;
    private confirmAndDeleteAccount;
    private showExportForm;
    private handleExportSubmit;
}
//# sourceMappingURL=ApplicationController.d.ts.map