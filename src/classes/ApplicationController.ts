import { AccountManager } from './AccountManager.js';
import { Account } from './Account.js';
import { Transaction } from './Transaction.js';
import { IAccount } from '../interfaces/IAccount.js';
import { escapeCsvValue } from '../utils/escapeCsvValue.js';
import { formatCurrency, formatDate } from '../lib/budget-utils.js';

type ViewName = 'accounts-overview' | 'account-details';

export class ApplicationController {
  public readonly accountManager: AccountManager;
  private activeView: ViewName = 'accounts-overview';
  private openedAccountId: string | null = null;

  constructor() {
    this.accountManager = new AccountManager();
  }

  start(): void {
    this.bootstrapDemoData();
    this.showAccountsOverview();
  }

  private bootstrapDemoData(): void {
    type SeedTx = {
      amount: number;
      type: 'income' | 'expense';
      date: string;
      description: string;
    };

    const demo: { title: string; transactions: SeedTx[] }[] = [
      {
        title: 'Личный бюджет',
        transactions: [
          { amount: 1000, type: 'income', date: '2023-01-01T00:00:00Z', description: 'Зарплата' },
          { amount: 200, type: 'expense', date: '2023-01-05T00:00:00Z', description: 'Продукты' },
          {
            amount: 150,
            type: 'expense',
            date: '2023-01-09T00:00:00Z',
            description: 'Коммунальные услуги',
          },
        ],
      },
      {
        title: 'Копилка на отпуск',
        transactions: [
          { amount: 500, type: 'income', date: '2023-04-01T00:00:00Z', description: 'Премия' },
          { amount: 600, type: 'income', date: '2023-01-01T00:00:00Z', description: 'Возврат долга' },
          {
            amount: 300,
            type: 'expense',
            date: '2023-01-05T00:00:00Z',
            description: 'Билеты на самолёт',
          },
          { amount: 200, type: 'expense', date: '2023-01-09T00:00:00Z', description: 'Номер в отеле' },
        ],
      },
    ];

    for (const { title, transactions } of demo) {
      const account = new Account(title);
      for (const row of transactions) {
        account.addTransaction(
          new Transaction(row.amount, row.type, row.date, row.description),
        );
      }
      this.accountManager.addAccount(account);
    }
  }

  private getRootContainer(): HTMLElement | null {
    return document.getElementById('app');
  }

  showAccountsOverview(): void {
    this.activeView = 'accounts-overview';
    this.openedAccountId = null;

    const container = this.getRootContainer();
    if (!container) {
      return;
    }

    const accounts = this.accountManager.getAllAccounts();

    const accountsMarkup =
      accounts.length === 0
        ? '<p class="empty-message">Нет счетов. Создайте новый счёт.</p>'
        : accounts
            .map(account => {
              const balance = account.getBalance();
              const balanceClass = balance >= 0 ? 'positive' : 'negative';
              const formattedBalance = formatCurrency(balance);

              return `
                <article class="account-card" data-account-id="${account.id}">
                  <div class="account-info">
                    <h3>${account.name}</h3>
                    <p class="balance">
                      Баланс:
                      <span class="${balanceClass}">${formattedBalance}</span>
                    </p>
                  </div>
                  <button
                    class="btn btn-primary"
                    data-action="open-account"
                    data-account-id="${account.id}"
                  >
                    Открыть
                  </button>
                </article>
              `;
            })
            .join('');

    container.innerHTML = `
      <div class="main-container">
        <h1>💰 Управление личными финансами</h1>
        <section class="accounts-list">
          <h2>Список счетов</h2>
          ${accountsMarkup}
        </section>
        <div class="actions">
          <button class="btn btn-success" data-action="create-account">
            ➕ Создать новый счёт
          </button>
        </div>
      </div>
    `;

    this.attachOverviewHandlers(container);
  }

  private attachOverviewHandlers(container: HTMLElement): void {
    container.onclick = event => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const action = target.getAttribute('data-action');
      if (action === 'create-account') {
        this.showCreateAccountForm();
        return;
      }

      if (action === 'open-account') {
        const accountId = target.getAttribute('data-account-id');
        if (accountId) {
          this.openAccountDetails(accountId);
        }
      }
    };
  }

  private showCreateAccountForm(): void {
    const container = this.getRootContainer();
    if (!container) {
      return;
    }

    container.innerHTML = `
      <div class="form-container">
        <h2>Создание нового счёта</h2>
        <form id="createAccountForm">
          <div class="form-group">
            <label for="accountName">Название счёта:</label>
            <input type="text" id="accountName" required placeholder="Введите название счёта" />
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-success">Создать</button>
            <button type="button" class="btn btn-secondary" data-action="cancel-create-account">
              Отмена
            </button>
          </div>
        </form>
      </div>
    `;

    const form = document.getElementById('createAccountForm') as HTMLFormElement | null;
    const cancelButton = container.querySelector(
      '[data-action="cancel-create-account"]',
    ) as HTMLButtonElement | null;

    if (form) {
      form.onsubmit = event => {
        event.preventDefault();
        this.handleCreateAccountSubmit();
      };
    }

    if (cancelButton) {
      cancelButton.onclick = () => this.showAccountsOverview();
    }
  }

  private handleCreateAccountSubmit(): void {
    const nameInput = document.getElementById('accountName') as HTMLInputElement | null;
    const rawName = nameInput?.value ?? '';
    const trimmedName = rawName.trim();

    if (!trimmedName) {
      alert('Пожалуйста, введите название счёта');
      return;
    }

    const account = new Account(trimmedName);
    this.accountManager.addAccount(account);
    this.showAccountsOverview();
  }

  private openAccountDetails(accountId: string): void {
    const account = this.accountManager.getAccount(accountId);
    if (!account) {
      alert('Счёт не найден');
      this.showAccountsOverview();
      return;
    }

    this.activeView = 'account-details';
    this.openedAccountId = accountId;
    this.renderAccountDetails(account);
  }

  private renderAccountDetails(account: IAccount): void {
    const container = this.getRootContainer();
    if (!container) {
      return;
    }

    const summary = account.getSummary();
    const transactions = account.transactions;

    const summaryBalanceClass = summary.balance >= 0 ? 'positive' : 'negative';
    const formattedBalance = formatCurrency(summary.balance);
    const formattedIncome = formatCurrency(summary.totalIncome);
    const formattedExpense = formatCurrency(summary.totalExpense);

    const transactionsMarkup =
      transactions.length === 0
        ? '<p class="empty-message">Нет транзакций. Добавьте первую транзакцию.</p>'
        : `
          <div class="transactions-list">
            ${transactions
              .map(transaction => {
                const formattedAmount = formatCurrency(transaction.amount);
                const signedAmount =
                  transaction.type === 'income'
                    ? `+${formattedAmount}`
                    : `-${formattedAmount}`;

                const formattedDate = formatDate(transaction.date);

                return `
                  <article class="transaction-card ${transaction.type}">
                    <div class="transaction-info">
                      <div class="transaction-main">
                        <span class="transaction-amount ${transaction.type}">
                          ${signedAmount}
                        </span>
                        <span class="transaction-description">${transaction.description}</span>
                      </div>
                      <div class="transaction-meta">
                        <span class="transaction-date">${formattedDate}</span>
                        <button
                          class="btn btn-danger btn-small"
                          data-action="delete-transaction"
                          data-account-id="${account.id}"
                          data-transaction-id="${transaction.id}"
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  </article>
                `;
              })
              .join('')}
          </div>
        `;

    container.innerHTML = `
      <div class="account-view">
        <div class="account-header">
          <button class="btn btn-secondary" data-action="back-to-accounts">
            ← Назад к списку
          </button>
          <h1>${account.name}</h1>
        </div>

        <section class="account-summary">
          <div class="summary-card">
            <h3>Сводка</h3>
            <div class="summary-item">
              <span>Баланс:</span>
              <span class="${summaryBalanceClass}">${formattedBalance}</span>
            </div>
            <div class="summary-item">
              <span>Доходы:</span>
              <span class="positive">${formattedIncome}</span>
            </div>
            <div class="summary-item">
              <span>Расходы:</span>
              <span class="negative">${formattedExpense}</span>
            </div>
          </div>
        </section>

        <section class="transactions-section">
          <div class="section-header">
            <h2>Транзакции</h2>
            <button
              class="btn btn-success"
              data-action="show-add-transaction"
              data-account-id="${account.id}"
            >
              ➕ Добавить транзакцию
            </button>
          </div>
          ${transactionsMarkup}
        </section>

        <div class="account-actions">
          <button
            class="btn btn-primary"
            data-action="export-transactions"
            data-account-id="${account.id}"
          >
            📥 Экспорт в CSV
          </button>
          <button
            class="btn btn-danger"
            data-action="delete-account"
            data-account-id="${account.id}"
          >
            🗑️ Удалить счёт
          </button>
        </div>
      </div>
    `;

    this.attachAccountDetailsHandlers(container, account.id);
  }

  private attachAccountDetailsHandlers(container: HTMLElement, accountId: string): void {
    container.onclick = event => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const action = target.getAttribute('data-action');
      if (!action) return;

      switch (action) {
        case 'back-to-accounts':
          this.showAccountsOverview();
          break;
        case 'show-add-transaction':
          this.showAddTransactionForm(accountId);
          break;
        case 'delete-account':
          this.confirmAndDeleteAccount(accountId);
          break;
        case 'export-transactions':
          this.showExportForm(accountId);
          break;
        case 'delete-transaction': {
          const transactionId = target.getAttribute('data-transaction-id');
          if (transactionId) {
            this.removeTransaction(accountId, transactionId);
          }
          break;
        }
      }
    };
  }

  private showAddTransactionForm(accountId: string): void {
    const account = this.accountManager.getAccount(accountId);
    if (!account) return;

    const container = this.getRootContainer();
    if (!container) return;

    const today = new Date().toISOString().split('T')[0];

    container.innerHTML = `
      <div class="form-container">
        <h2>Добавление транзакции</h2>
        <form id="addTransactionForm">
          <div class="form-group">
            <label for="transactionAmount">Сумма (₽):</label>
            <input
              type="number"
              id="transactionAmount"
              step="0.01"
              min="0.01"
              required
              placeholder="0.00"
            />
          </div>
          <div class="form-group">
            <label for="transactionType">Тип транзакции:</label>
            <select id="transactionType" required>
              <option value="income">Доход</option>
              <option value="expense">Расход</option>
            </select>
          </div>
          <div class="form-group">
            <label for="transactionDate">Дата:</label>
            <input type="date" id="transactionDate" value="${today}" required />
          </div>
          <div class="form-group">
            <label for="transactionDescription">Описание:</label>
            <input
              type="text"
              id="transactionDescription"
              required
              placeholder="Введите описание"
            />
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-success">Добавить</button>
            <button
              type="button"
              class="btn btn-secondary"
              data-action="cancel-add-transaction"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    `;

    const form = document.getElementById('addTransactionForm') as HTMLFormElement | null;
    const cancelButton = container.querySelector(
      '[data-action="cancel-add-transaction"]',
    ) as HTMLButtonElement | null;

    if (form) {
      form.onsubmit = event => {
        event.preventDefault();
        this.handleAddTransactionSubmit(accountId);
      };
    }

    if (cancelButton) {
      cancelButton.onclick = () => this.openAccountDetails(accountId);
    }
  }

  private handleAddTransactionSubmit(accountId: string): void {
    const account = this.accountManager.getAccount(accountId);
    if (!account) return;

    const amountInput = document.getElementById('transactionAmount') as HTMLInputElement | null;
    const typeInput = document.getElementById('transactionType') as HTMLSelectElement | null;
    const dateInput = document.getElementById('transactionDate') as HTMLInputElement | null;
    const descriptionInput = document.getElementById(
      'transactionDescription',
    ) as HTMLInputElement | null;

    if (!amountInput || !typeInput || !dateInput || !descriptionInput) {
      return;
    }

    const amount = parseFloat(amountInput.value);
    if (!Number.isFinite(amount) || amount <= 0) {
      alert('Сумма должна быть положительным числом');
      return;
    }

    const type = typeInput.value as 'income' | 'expense';
    const date = new Date(`${dateInput.value}T00:00:00Z`);
    const description = descriptionInput.value.trim();

    if (!description) {
      alert('Пожалуйста, введите описание');
      return;
    }

    const transaction = new Transaction(amount, type, date, description);
    account.addTransaction(transaction);
    this.openAccountDetails(accountId);
  }

  private removeTransaction(accountId: string, transactionId: string): void {
    if (!confirm('Вы уверены, что хотите удалить эту транзакцию?')) {
      return;
    }

    const account = this.accountManager.getAccount(accountId);
    if (!account) return;

    if (account.transactions.length === 0) {
      alert('Нет транзакций для удаления');
      this.openAccountDetails(accountId);
      return;
    }

    const success = account.removeTransaction(transactionId);
    if (success) {
      this.openAccountDetails(accountId);
    } else {
      alert('Транзакция не найдена');
    }
  }

  private confirmAndDeleteAccount(accountId: string): void {
    const confirmed = confirm(
      'Вы уверены, что хотите удалить этот счёт? Все транзакции будут удалены.',
    );
    if (!confirmed) {
      return;
    }

    const success = this.accountManager.removeAccount(accountId);
    if (success) {
      this.showAccountsOverview();
    } else {
      alert('Счёт не найден');
    }
  }

  private showExportForm(accountId: string): void {
    const account = this.accountManager.getAccount(accountId);
    if (!account) return;

    const container = this.getRootContainer();
    if (!container) return;

    const suggestedName = account.name.toLowerCase().replace(/\s+/g, '_');

    container.innerHTML = `
      <div class="form-container">
        <h2>Экспорт транзакций в CSV</h2>
        <form id="exportForm">
          <div class="form-group">
            <label for="fileName">Имя файла (без расширения):</label>
            <input
              type="text"
              id="fileName"
              required
              placeholder="transactions"
              value="${suggestedName}"
            />
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-success">Экспортировать</button>
            <button type="button" class="btn btn-secondary" data-action="cancel-export">
              Отмена
            </button>
          </div>
        </form>
      </div>
    `;

    const form = document.getElementById('exportForm') as HTMLFormElement | null;
    const cancelButton = container.querySelector(
      '[data-action="cancel-export"]',
    ) as HTMLButtonElement | null;

    if (form) {
      form.onsubmit = event => {
        event.preventDefault();
        this.handleExportSubmit(accountId);
      };
    }

    if (cancelButton) {
      cancelButton.onclick = () => this.openAccountDetails(accountId);
    }
  }

  private handleExportSubmit(accountId: string): void {
    const account = this.accountManager.getAccount(accountId);
    if (!account) return;

    const fileNameInput = document.getElementById('fileName') as HTMLInputElement | null;
    const rawName = fileNameInput?.value ?? '';
    const trimmedName = rawName.trim();

    if (!trimmedName) {
      alert('Пожалуйста, введите имя файла');
      return;
    }

    const transactions = account.transactions;
    if (transactions.length === 0) {
      alert('Нет транзакций для экспорта');
      this.openAccountDetails(accountId);
      return;
    }

    const headers = ['Дата', 'Тип', 'Сумма', 'Описание'];
    const rows = transactions.map(transaction => [
      formatDate(transaction.date),
      transaction.type === 'income' ? 'Доход' : 'Расход',
      transaction.amount.toString(),
      transaction.description,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row =>
        row
          .map(cell => escapeCsvValue(cell.toString()))
          .join(','),
      ),
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${trimmedName}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert('Транзакции успешно экспортированы в CSV-файл');
    this.openAccountDetails(accountId);
  }
}
