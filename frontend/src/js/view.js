/* eslint-disable no-unused-vars */
import { el, setChildren, mount } from "redom";
import { logIn, getAccountData, transaction, getBankData, createNewAccount, getAllCurrencies, getYourCurrencies, openCurrencyFeed, currencyBuy, getBanks } from './local.js';
import Plotly from 'plotly.js-dist';
import * as ymaps3 from 'ymaps3';
import Choices from "choices.js";
import mail from '../assets/images/mail.svg';
import arrowBack from '../assets/images/arrow-back.svg';
import plus from '../assets/images/plus.svg';
import placemark from '../assets/images/placemark.svg';
import spinner from '../assets/images/spinner.svg';
import spinnerWhite from '../assets/images/spinner-white.svg';
import Navigo from "navigo";
import choices from "../scss/choices.min.css";
import css from "../scss/style.css";
import normalize from "../scss/normalize.css";

const router = new Navigo('/');

const arrowBackSvg = el('img.arrow-back-svg', { src: arrowBack });

// Форматирование числа (округление до сотых и добавление пробелма после каждого 3-го целого числа. Пример: 1500.899849 --> 1 500.90)
function numberHandling(number) {
    const numberArr = String(number.toFixed(2)).split('.');
    let p = numberArr[0];
    // eslint-disable-next-line no-unused-vars
    let i = 0, res = "", b = 3, c = 3, t = p.length, d = 0, sec = "";
    t--
    while (i < p.length) {
        i == b ? res = res + " " : i == i
        i == b ? b = b + 3 : i == i
        res = res + String(p[t])
        t--
        i++
    }
    let pp = res.length - 1
    while (d < res.length) {
        sec = sec + String(res[pp])
        pp--
        d++
    }
    let numberStr
    if (numberArr.length > 1) {
        numberStr = sec + '.' + numberArr[1];
    } else {
        numberStr = sec;
    }

    return numberStr;
}

function rootCreate() {
    const header = headerCreate();
    const main = el('main');
    const rootContainer = el('div.container.root-container');

    setChildren(document.body, [header, main]);
    setChildren(main, rootContainer);

    return rootContainer;
}

function loaderCreate() {
    const spinnerContainer = el('div.spinner-container');
    const spinnerSvg = el('img.spinner-svg', { src: spinner });

    setTimeout(() => {
        spinnerSvg.classList.add('spinner-transform');
    }, 3);

    setChildren(spinnerContainer, spinnerSvg);
    return spinnerContainer;
}

// Создание формы входа пользователя
export function loginFormCreate(container) {
    const login = el('div.login');
    const loginContainer = el('div.login-container');
    const loginTitle = el('h2.login-title', 'Вход в аккаунт');
    const loginForm = el('form.login-form');
    const loginInputsContainer = el('div.login-input-container');
    const loginInputLoginContainer = el('div.login-input-login-container');
    const loginInputLogin = el('input.login-input.login-input-login');
    const loginValidateLogin = el('span.validate-login');
    const loginLabelLogin = el('label.login-label');
    const loginInputPasswordContainer = el('div.login-input-password-container');
    const loginInputPassword = el('input.login-input.login-input-password', { type: 'password' });
    const loginValidatePassword = el('span.validate-password');
    const loginLabelPassword = el('label.password-label');
    const loginBtnSubmit = el('button.btn-reset.blue-btn.login-btn-submit', 'Войти');

    loginInputLogin.placeholder = 'Placeholder';
    loginInputPassword.placeholder = 'Placeholder';

    loginLabelLogin.textContent = 'Логин';
    loginLabelPassword.textContent = 'Пароль';

    loginInputLogin.addEventListener('input', () => {
        loginInputLogin.classList.remove('invalid');
        loginValidateLogin.textContent = '';
    })

    loginInputPassword.addEventListener('input', () => {
        loginInputPassword.classList.remove('invalid');
        loginValidatePassword.textContent = '';
    })

    loginBtnSubmit.addEventListener('click', () => {
        const loginStr = loginInputLogin.value.trim();
        const password = loginInputPassword.value.trim();

        inputValidate(loginInputLogin, loginValidateLogin, 'Логин должен быть не менее 6-и символов и не включать пробелы');
        inputValidate(loginInputPassword, loginValidatePassword, 'Пароль должен быть не менее 6-и символов и не включать пробелы')

        if (loginInputsContainer.querySelectorAll('.invalid').length > 0) return;

        login.classList.add('login-load');
        logIn(loginStr, password).then(res => {
            if (res.name) return
            if (res.error.length > 0) {
                if (res.error == 'No such user') {
                    loginInputLogin.classList.add('invalid')
                    loginValidateLogin.textContent = 'Пользователя с таким логином не существует';
                    return;
                }
                if (res.error == 'Invalid password') {
                    loginInputPassword.classList.add('invalid')
                    loginValidatePassword.textContent = 'Неверный пароль';
                    return;
                }
            } else {
                const token = res.payload.token;
                localStorage.setItem('token', token);
                router.navigate(`/accounts`);
            }
        });
    });

    setChildren(loginContainer, login);
    setChildren(login, [loginTitle, loginForm, loginBtnSubmit]);
    setChildren(loginInputsContainer, [loginInputLoginContainer, loginInputPasswordContainer]);
    setChildren(loginInputLoginContainer, [loginInputLogin, loginLabelLogin, loginValidateLogin]);
    setChildren(loginInputPasswordContainer, [loginInputPassword, loginLabelPassword, loginValidatePassword]);
    setChildren(loginForm, loginInputsContainer);
    setChildren(container, loginContainer);
}

function inputValidate(input, validateBlock, inputDscr) {
    if (input.value.trim().length < 6 || input.value.trim().includes(' ')) {
        input.classList.add('invalid')
        validateBlock.textContent = inputDscr;
    }
}

// Создание шапки страницы
export function headerCreate() {
    const header = el('header.header');
    const headerContainer = el('div.container.header-container');
    const headerLogo = el('div.header-logo');

    headerLogo.textContent = 'Coin.';
    headerLogo.href = '#';

    setChildren(header, headerContainer);
    setChildren(headerContainer, headerLogo);

    return header;
}

// Создание навигации
export function navCreate() {
    const headerContainer = document.querySelector('.header-container');
    const nav = el('nav.header-nav');
    const ATMs = el('a.nav-link.nav-atms', 'Банкоматы', { href: '/banks' });
    const accounts = el('a.nav-link.nav-accounts', 'Счета', { href: '/accounts' });
    const currency = el('a.nav-link.nav-currency', 'Валюта', { href: '/currency' });
    const logOut = el('a.nav-link.nav-log-out', 'Выйти', { href: '/' });

    currency.addEventListener('click', (e) => {
        e.preventDefault();
        router.navigate('/currency');
    });

    accounts.addEventListener('click', (e) => {
        e.preventDefault();
        router.navigate(`/accounts`);
    });

    logOut.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token')
        router.navigate('/');
    });

    ATMs.addEventListener('click', (e) => {
        e.preventDefault();
        router.navigate('/banks');
    })

    setChildren(nav, [ATMs, accounts, currency, logOut]);
    mount(headerContainer, nav)
}

// Выделение активной кнопки навигации 
function navBtnsBg(btn) {
    const navBtns = document.querySelectorAll('.nav-link');

    navBtns.forEach(btn => {
        btn.style.backgroundColor = 'rgba(255, 255, 255, 1)';
    });
    if (!btn) return;
    const btnAccounts = document.querySelector(btn);
    btnAccounts.style.backgroundColor = 'rgba(160, 195, 255, 1)';
}

// Создание карточки счёта
class BankAccountCard {
    constructor(account, balance, mine, lastTransaction, token) {
        this.account = account;
        this.balance = balance;
        this.mine = mine;
        this.lastTransaction = lastTransaction;
        this.token = token;
    }

    createCard() {
        const cardContainer = el('div.card-container');
        const cardAccount = el('h5.card-account');
        const cardBalance = el('div.card-balance');
        const cardTransactionContainer = el('div.card-transaction-container');
        const cardTransactionTitle = el('span.card-transaction-title');
        const cardTransactionDate = el('sapn.card-transaction-date');
        const cardBtnOpen = el('button.btn-reset.blue-btn.card-btn-open');

        setChildren(cardContainer, [cardAccount, cardBalance, cardTransactionContainer, cardBtnOpen]);
        setChildren(cardTransactionContainer, [cardTransactionTitle, cardTransactionDate]);

        if (this.lastTransaction.length > 0) {
            const lastTransaction = this.lastTransaction.at(-1);
            const monthData = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']

            const date = new Date(lastTransaction.date);
            const day = date.getDate();
            const month = monthData[date.getMonth()];
            const year = date.getFullYear();
            const resultDate = day + ' ' + month + ' ' + year;
            cardTransactionDate.textContent = resultDate;
        } else {
            cardTransactionDate.textContent = '';
        }

        cardAccount.textContent = this.account;
        cardBalance.textContent = numberHandling(this.balance) + ' ₽';
        cardTransactionTitle.textContent = 'Последняя транзакция:';

        cardBtnOpen.textContent = 'Открыть';

        cardBtnOpen.addEventListener('click', () => {
            router.navigate(`/accounts/${this.account}`);
        })

        return cardContainer;
    }
}

// Создание блока карточек всех счетов
export function accountsCardsCreate(data, token) {
    const rootContainer = document.querySelector('.root-container');
    const accountsContainer = el('dib.accounts-container');
    const accountsTop = el('div.accounts-top');
    const accountsTopLeftContainer = el('div.accounts-sort-container');
    const accountsTopLeftTitle = el('h2.accounts-sort-title', 'Ваши счета');
    const accountsSortSelect = el('select.accounts-sort-select');
    const plusSvg = el('img.plus-svg', { src: plus });
    const createNewAccountBtn = el('btn.btn-reset.create-new-account-btn');
    const optionSortDefault = el('option.option-sort', 'Сортировка', { selected: true, disabled: true, hidden: true });
    const optionSortNumber = el('option.option-sort', 'По номеру');
    const optionSortBalance = el('option.option-sort', 'По балансу');
    const optionSortTransactions = el('option.option-sort', 'По последней транзакции');

    mount(createNewAccountBtn, plusSvg);
    createNewAccountBtn.append('Создать новый счёт');

    setChildren(accountsSortSelect, [optionSortDefault, optionSortNumber, optionSortBalance, optionSortTransactions]);
    setChildren(accountsTopLeftContainer, [accountsTopLeftTitle, accountsSortSelect]);
    setChildren(accountsTop, [accountsTopLeftContainer, createNewAccountBtn]);
    setChildren(rootContainer, [accountsTop, accountsContainer]);

    new Choices(accountsSortSelect, {
        searchEnabled: false,
        itemSelectText: ''
    });

    setChildren(accountsContainer, loaderCreate());

    console.log('data', data)
    data.then(res => {
        accountsContainer.innerHTML = '';
        res.payload.forEach(el => {
            const account = new BankAccountCard(el.account, el.balance, el.mine, el.transactions, token);

            mount(accountsContainer, account.createCard());
        });

        accountsSortSelect.addEventListener('change', (event) => {
            let payloadSort = [...res.payload];
            let sortValue;

            if (event.target.value == 'По номеру') {
                sortValue = 'account';
            }
            if (event.target.value == 'По балансу') {
                sortValue = 'balance';
            }
            if (event.target.value == 'По последней транзакции') {
                sortValue = 'transactions';
            }

            if (sortValue) {
                sortAccounts(payloadSort, sortValue)
                accountsContainer.innerHTML = '';

                payloadSort.forEach(el => {
                    const account = new BankAccountCard(el.account, el.balance, el.mine, el.transactions, token);

                    mount(accountsContainer, account.createCard());
                });
            }
        })
    })

    createNewAccountBtn.addEventListener('click', () => {
        createNewAccount(token);
        plusSvg.src = spinnerWhite;

        accountsCardsCreate(getBankData(token), token);
        plusSvg.src = plus;
    })
}

// Сортировка счетов
function sortAccounts(accounts, sortValue) {
    accounts.sort((a, b) => {
        if (sortValue == 'transactions') {
            if (a[sortValue].length > 0 && b[sortValue].length > 0) {
                if ((a[sortValue][0]).date < (b[sortValue][0]).date) {
                    return 1;
                }
                if ((a[sortValue][0]).date > (b[sortValue][0]).date) {
                    return -1;
                }
            } else {
                return 1;
            }
        } else {
            if (a[sortValue] < b[sortValue]) {
                return 1;
            }
            if (a[sortValue] > b[sortValue]) {
                return -1;
            }
        }
    })
}

// Создание блока подробной информации о счёте
function createAccountData(token, account, details = false) {
    const rootContainer = document.querySelector('.root-container');
    const accountTop = el('div.accounts-top');
    const accountDscr = el('div.account-dscr');
    const accountDscrTop = el('div.account-dscr-top');
    const accountBlocks = el('div.account-blocks');
    const accountBlocksTop = el('div.account-blocks-top');
    const accountBlocksBottom = el('div.account-blocks-bottom');
    const accountTitle = el('h2.account-title', 'Просмотр счёта');

    const accountNumber = el('h3.account-number', '№ ' + account);
    const accountBalanceContainer = el('div.account-balance-container');
    const accountBalanceTitle = el('span.account-balance-title', 'Баланс');
    const accountBalanceSum = el('span.account-balance-sum');

    const dinamicBalanceContainer = el('div.dinamic-balance-container');
    const dinamicBalanceTitle = el('h5.dinamic-balance-title.account-blocks-titles', 'Динамика баланса');
    const dinamicBalanceGraphContainer = el('div.dinamic-balance-graph-container');
    const dinamicBalanceGraph = el('div.dinamic-balance-graph#dinamic-balance-graph-first');
    const dinamicBalanceRange = el('div.dinamic-balance-range');
    const dinamicBalanceMax = el('span.dinamic-balance-max');
    const dinamicBalanceMin = el('span.dinamic-balance-min', '0');

    const dinamicBalanceRatioContainer = el('div.dinamic-balance-container.dinamic-balance-ratio-container');
    const dinamicBalanceRatioTitle = el('h5.dinamic-balance-title.account-blocks-titles', 'Соотношение входящих исходящих транзакций');
    const dinamicBalanceRatioGraphContainer = el('div.dinamic-balance-graph-container');
    const dinamicBalanceRatioGraph = el('div.dinamic-balance-graph#dinamic-balance-graph-second');
    const dinamicBalanceRatioRange = el('div.dinamic-balance-range');
    const dinamicBalanceRatioMax = el('span.dinamic-balance-max');
    const dinamicBalanceRatioCenter = el('span.dinamic-balance-center');
    const dinamicBalanceRatioMin = el('span.dinamic-balance-min', '0');

    const historyTransactionsContainer = el('div.history-transactions-container')
    const historyTransactionsTitle = el('h5.history-transactions-title.account-blocks-titles', 'История переводов');
    const historyTransactionsTable = el('table.history-transactions-table');
    const historyTransactionsTableThead = el('thead.history-transactions-table-thead');
    const historyTransactionsTableTrMain = el('tr.history-transactions-table-tr-main');
    const historyTransactionsTableTbody = el('thead.history-transactions-table-tbody');
    const historyTransactionsTableThSender = el('th.history-transactions-table-th-sender', 'Счёт отправителя');
    const historyTransactionsTableThRecipient = el('th.history-transactions-table-th-recipient', 'Счёт получателя');
    const historyTransactionsTableThSum = el('th.history-transactions-table-th-sum', 'Сумма');
    const historyTransactionsTableThDate = el('th.history-transactions-table-th-date', 'Дата');

    if (details) {
        window.location.hash = 'details'
    } else {
        window.location.hash = ''
    }

    setChildren(rootContainer, [accountTop, accountDscr]);

    setChildren(accountDscr, [accountDscrTop, accountBlocks]);
    setChildren(accountDscrTop, [accountNumber, accountBalanceContainer]);
    setChildren(accountBalanceContainer, [accountBalanceTitle, accountBalanceSum]);

    setChildren(dinamicBalanceContainer, [dinamicBalanceTitle, dinamicBalanceGraphContainer]);
    setChildren(dinamicBalanceRange, [dinamicBalanceMax, dinamicBalanceMin]);
    setChildren(dinamicBalanceGraphContainer, loaderCreate())

    setChildren(historyTransactionsContainer, [historyTransactionsTitle, historyTransactionsTable]);
    setChildren(historyTransactionsTable, loaderCreate());
    setChildren(historyTransactionsTableThead, historyTransactionsTableTrMain);
    setChildren(historyTransactionsTableTrMain, [historyTransactionsTableThSender, historyTransactionsTableThRecipient, historyTransactionsTableThSum, historyTransactionsTableThDate]);

    if (details == false) {
        const newTransactionContainer = el('div.new-transaction-container');
        const newTransactionTitle = el('h5.new.transaction-title.account-blocks-titles', 'Новый перевод');
        const newTransactionLabelContainer = el('div.new-transaction-label-cantainer');
        const newTransactionLabelRecipient = el('label.new-transaction-label', 'Номер счёта получателя');
        const newTransactionLabelSum = el('label.new-transaction-label', 'Сумма перевода');
        const newTransactionForm = el('form.new-transaction-form');
        const newTransactionInputContainer = el('div.new-transaction-input-container');
        const newTransactionInputRecipientContainer = el('div.input-recipient-container');
        const newTransactionInputRecipient = el('input.new-transaction-input#new-transaction-recipient', { placeholder: 'placeholder', type: 'number' });
        const newTransactionInputSum = el('input.new-transaction-input#new-transaction-sum', { placeholder: 'placeholder', type: 'number' });
        const mailSvg = el('img.mail-svg', { src: mail })
        const newTransactionBtnSend = el('button.new-transaction-btn-send');

        const btnBack = el('button.btn-back.btn-reset');
        mount(btnBack, arrowBackSvg);
        btnBack.append('Вернуться назад');


        setChildren(accountTop, [accountTitle, btnBack]);

        setChildren(accountBlocks, [accountBlocksTop, accountBlocksBottom]);
        setChildren(accountBlocksTop, [newTransactionContainer, dinamicBalanceContainer]);

        setChildren(accountBlocksBottom, historyTransactionsContainer);

        setChildren(newTransactionContainer, [newTransactionTitle, newTransactionForm]);
        setChildren(newTransactionForm, [newTransactionLabelContainer, newTransactionInputContainer]);
        setChildren(newTransactionLabelContainer, [newTransactionLabelRecipient, newTransactionLabelSum]);
        setChildren(newTransactionInputContainer, [newTransactionInputRecipientContainer, newTransactionInputSum, newTransactionBtnSend]);
        setChildren(newTransactionInputRecipientContainer, newTransactionInputRecipient);

        mount(newTransactionBtnSend, mailSvg)
        newTransactionBtnSend.append('Отправить')

        let localAccounts = JSON.parse(localStorage.getItem('accounts'));

        if (localAccounts || localAccounts !== null) {
            const localAccountsBtn = el('btn.local-accounts-btn');
            const localAccountsList = el('div.local-accounts-list');

            newTransactionInputRecipient.addEventListener('input', () => {
                localAccountsList.innerHTML = '';

                if (localAccountsList.querySelectorAll('.local-account-button').length == 0) localAccountsList.classList.remove('dropdown-accounts-list');

                if (newTransactionInputRecipient.value.trim().length < 1) return

                localAccounts.forEach(localAccount => {
                    const localAccountItem = el('button.btn-reset.local-account-button', localAccount);

                    localAccountItem.addEventListener('click', (e) => {
                        e.preventDefault();
                        newTransactionInputRecipient.value = e.target.textContent;
                    })

                    if (String(localAccount).startsWith(String(newTransactionInputRecipient.value.trim()))) mount(localAccountsList, localAccountItem);
                })

                if (localAccountsList.querySelectorAll('.local-account-button').length > 0) localAccountsList.classList.add('dropdown-accounts-list');
            })

            localAccountsBtn.addEventListener('click', event => {
                event._isClickWithWindow = true;
                localAccountsList.innerHTML = '';

                localAccounts.forEach(localAccount => {
                    const localAccountItem = el('button.btn-reset.local-account-button', localAccount);

                    localAccountItem.addEventListener('click', (e) => {
                        e.preventDefault();
                        newTransactionInputRecipient.value = e.target.textContent;
                    })

                    mount(localAccountsList, localAccountItem);
                })

                localAccountsList.classList.toggle('dropdown-accounts-list');
            });

            document.body.addEventListener('click', event => {
                if (event._isClickWithWindow) return
                localAccountsList.classList.remove('dropdown-accounts-list');
            })

            mount(newTransactionInputRecipientContainer, localAccountsBtn);
            mount(newTransactionInputRecipientContainer, localAccountsList);
        }

        dinamicBalanceGraph.style.cursor = 'pointer';
        historyTransactionsTable.style.cursor = 'pointer';

        dinamicBalanceGraph.addEventListener('click', () => {
            createAccountData(token, account, true);
        })

        historyTransactionsTable.addEventListener('click', () => {
            createAccountData(token, account, true);
        })

        newTransactionInputRecipient.addEventListener('input', () => {
            if (document.querySelector('.new-transaction-error')) document.querySelector('.new-transaction-error').remove();
        })

        newTransactionInputSum.addEventListener('input', () => {
            if (document.querySelector('.new-transaction-error')) document.querySelector('.new-transaction-error').remove();
        })

        newTransactionBtnSend.addEventListener('click', (e) => {
            e.preventDefault();
            const recipient = newTransactionInputRecipient.value.trim();
            const amount = newTransactionInputSum.value.trim();

            if (newTransactionInputRecipient.value.length < 1 || newTransactionInputSum.value.length < 1) {
                if (document.querySelector('.new-transaction-error')) document.querySelector('.new-transaction-error').remove();
                const newTransactionError = el('div.new-transaction-error', 'Номер счёта получателя и сумма перевода должны быть заполнены');

                mount(newTransactionInputContainer, newTransactionError);
                return
            }

            if (newTransactionInputSum.value < 1) {
                if (document.querySelector('.new-transaction-error')) document.querySelector('.new-transaction-error').remove();
                const newTransactionError = el('div.new-transaction-error', 'Сумма перевода не может быть отрицательной');

                mount(newTransactionInputContainer, newTransactionError);
                return
            }

            mailSvg.src = spinnerWhite;
            const newTransaction = transaction(token, account, recipient, amount).then(res => res.json());

            newTransaction.then(res => {
                mailSvg.src = mail;
                if ((res.error).length == 0) {
                    let localAccountsSet = []

                    if (localAccounts || localAccounts !== null) {
                        localAccountsSet = [...localAccounts];
                    }

                    let accountIncludes = false
                    localAccountsSet.forEach(account => {
                        if (account == recipient) accountIncludes = true;
                    })

                    if (!accountIncludes) {
                        localAccountsSet.push(recipient);
                    }

                    localStorage.setItem('accounts', JSON.stringify(localAccountsSet));
                    createModalWindow('Перевод прошел успешно!');
                    createAccountData(token, account)
                } else {
                    if (document.querySelector('.new-transaction-error')) document.querySelector('.new-transaction-error').remove();
                    const newTransactionError = el('div.new-transaction-error');

                    if (res.error == 'Invalid account from') newTransactionError.textContent = 'Этот счёт не принадлежит нам';
                    if (res.error == 'Invalid account to') newTransactionError.textContent = 'Этого счёта не существует';
                    if (res.error == 'Invalid amount') newTransactionError.textContent = 'Не указана сумма перевода, или она отрицательная';
                    if (res.error == 'Overdraft prevented') newTransactionError.textContent = 'Мы попытались перевести больше денег, чем доступно на счёте списания';

                    mount(newTransactionInputContainer, newTransactionError);
                }
            });
        })

        btnBack.addEventListener('click', () => {
            router.navigate('/accounts');
        })
    } else {
        setChildren(dinamicBalanceRatioContainer, [dinamicBalanceRatioTitle, dinamicBalanceRatioGraphContainer]);
        setChildren(dinamicBalanceRatioGraphContainer, loaderCreate());
        setChildren(dinamicBalanceRatioRange, [dinamicBalanceRatioMax, dinamicBalanceRatioCenter, dinamicBalanceRatioMin]);

        const btnBack = el('button.btn-back.btn-reset');
        mount(btnBack, arrowBackSvg);
        btnBack.append('Вернуться назад')

        setChildren(accountTop, [accountTitle, btnBack]);
        setChildren(accountBlocks, [dinamicBalanceContainer, dinamicBalanceRatioContainer, historyTransactionsContainer]);

        dinamicBalanceContainer.style.width = '100%';
        dinamicBalanceContainer.style.padding = '25px 100px';
        dinamicBalanceContainer.style.marginBottom = '50px';

        btnBack.addEventListener('click', () => {
            createAccountData(token, account, false);
        })
    }

    getAccountData(token, account).then(res => {
        setChildren(dinamicBalanceGraphContainer, [dinamicBalanceGraph, dinamicBalanceRange]);
        setChildren(historyTransactionsTable, [historyTransactionsTableThead, historyTransactionsTableTbody]);
        setChildren(dinamicBalanceRatioGraphContainer, [dinamicBalanceRatioGraph, dinamicBalanceRatioRange])

        const balance = res.payload.balance;
        const transactions = res.payload.transactions;

        accountBalanceSum.textContent = numberHandling(balance) + ' ₽'

        let allTransactionsFromPeriod = [];
        let lastTransactionFromAnyMonthForPeriod = [];
        let balanceForPeriod = [];
        let balanceDinamic = [];
        let percentTransactionsEachMonth = [];
        let transactionsFromEachMonth = [];
        let maxTransactonsSum = 0;

        let periodFlag;
        if (details == false) {
            periodFlag = 6;
        } else {
            periodFlag = 12;
        }

        if (transactions.length > 0) {
            const nowDate = new Date();
            const nowMonth = nowDate.getMonth();
            const nowYear = nowDate.getFullYear();

            let monthFlag;
            let yearFlag;

            if (nowMonth < periodFlag - 1) {
                monthFlag = 13 - periodFlag + nowMonth;
                yearFlag = nowYear - 1;
            } else {
                monthFlag = nowMonth - periodFlag;
                yearFlag = nowYear;
            }
            const datePeriodMonthAgo = new Date(yearFlag, monthFlag, 1);

            transactions.forEach(transaction => {
                const transactionDate = new Date(transaction.date);

                if (transactionDate > datePeriodMonthAgo && transactionDate < nowDate) {
                    allTransactionsFromPeriod.push(transaction);
                }
            })

            const monthArr = [];
            for (let i = 0; i < periodFlag; i++) {
                let month = nowMonth - i;
                if (month >= 0) {
                    monthArr.unshift(month);
                } else {
                    month = 12 + month;
                    monthArr.unshift(month);
                }
            }

            monthArr.forEach(month => {
                let lastTransaction;
                let thisMonthTransactions = {
                    month: month,
                };
                let thisMonthTransactionsTo = 0;
                let thisMonthTransactionsFrom = 0;

                allTransactionsFromPeriod.forEach(transaction => {
                    const transactionMonth = (new Date(transaction.date)).getMonth();
                    if (transactionMonth === month) {
                        if (lastTransaction) {
                            if (lastTransaction.date < transaction.date) {
                                lastTransaction = transaction;
                            }
                        } else {
                            lastTransaction = transaction;
                        }
                        if (details) {
                            if (transaction.from == account) {
                                thisMonthTransactionsFrom = thisMonthTransactionsFrom + transaction.amount;
                            } else {
                                thisMonthTransactionsTo = thisMonthTransactionsTo + transaction.amount;
                            }
                        }
                    }
                })

                thisMonthTransactions.from = thisMonthTransactionsFrom;
                thisMonthTransactions.to = thisMonthTransactionsTo;
                thisMonthTransactions.all = thisMonthTransactionsFrom + thisMonthTransactionsTo;
                transactionsFromEachMonth.push(thisMonthTransactions);

                lastTransactionFromAnyMonthForPeriod.push(lastTransaction);
            })

            transactionsFromEachMonth.forEach(el => {
                let percentTransactionsInMonth = {};
                let percentTransactionsTo = el.to / (el.from + el.to);
                let percentTransactionsFrom = el.from / (el.from + el.to);

                percentTransactionsInMonth.from = percentTransactionsFrom;
                percentTransactionsInMonth.to = percentTransactionsTo;

                percentTransactionsEachMonth.push(percentTransactionsInMonth);
            })

            for (let i = periodFlag - 1; i > -1; i--) {
                let newBalance = balance;

                allTransactionsFromPeriod.reverse().forEach(transaction => {
                    if (i === 0 && !lastTransactionFromAnyMonthForPeriod[i]) {
                        if (transaction.to === account) {
                            newBalance = Number((newBalance - transaction.amount).toFixed(2));
                        } else {
                            newBalance = Number((newBalance + transaction.amount).toFixed(2));
                        }
                    }

                    if (lastTransactionFromAnyMonthForPeriod[i]) {
                        if (new Date(transaction.date) > new Date(lastTransactionFromAnyMonthForPeriod[i].date)) {
                            if (transaction.to === account) {
                                newBalance = Number((newBalance - transaction.amount).toFixed(2));
                            } else {
                                newBalance = Number((newBalance + transaction.amount).toFixed(2));
                            }
                        }
                    }
                })
                balanceForPeriod.push(newBalance);
            }

            balanceForPeriod = balanceForPeriod.reverse();

            for (let i = 0; i < periodFlag; i++) {
                if (!lastTransactionFromAnyMonthForPeriod[i]) {
                    if (i === 0) {
                        balanceDinamic.push(balanceForPeriod[0]);
                    } else {
                        if ((new Date(transactions[0].date)).getMonth() === (new Date(transactions.at(-1).date)).getMonth()) {
                            balanceDinamic.push(0);
                        } else {
                            balanceDinamic.push(balanceDinamic.at(-1));
                        }
                    }
                } else {
                    balanceDinamic.push(balanceForPeriod[i])
                }
            }
        }

        let maxBalanceDinamic = balanceDinamic.slice();
        maxBalanceDinamic.sort((a, b) => {
            if (a > b) {
                return 1;
            }
            if (a < b) {
                return -1;
            }
        });

        if (maxBalanceDinamic[periodFlag - 1]) {
            dinamicBalanceMax.textContent = numberHandling(maxBalanceDinamic[periodFlag - 1]) + ' ₽';
        } else {
            dinamicBalanceMax.textContent = '0 ₽'
        }

        const monthData = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
        const nowDate = new Date;
        const nowMonth = nowDate.getMonth();
        const xMonthArr = [];
        let x = nowMonth;
        for (let i = 0; i < periodFlag; i++) {
            if (x > -1) {
                xMonthArr.push(monthData[x]);
                x--;
            } else {
                x = 11;
                xMonthArr.push(monthData[x]);
            }
        }
        xMonthArr.reverse();

        const dataFirstGraph = [{
            x: xMonthArr,
            y: balanceDinamic,
            type: 'bar',
        }];

        let graphWidth;
        let tickSuffix;

        if (details == false) {
            graphWidth = 564 - dinamicBalanceRange.offsetWidth;
            tickSuffix = '';
        } else {
            graphWidth = 1120 - dinamicBalanceRange.offsetWidth;
            tickSuffix = ' ₽'
        }

        let maxY
        if (maxBalanceDinamic[periodFlag - 1]) {
            maxY = maxBalanceDinamic[periodFlag - 1];
        } else {
            maxY = 0;
        }

        const layoutFirstGraph = {
            autosize: false,
            width: graphWidth,
            height: 195,
            yaxis: {
                tickvals: [0, maxY],
                tickmode: 'array',
                ticksuffix: tickSuffix,
                side: 'right',
                linecolor: "#000",
                linewidth: 1,
                mirror: true,
                maxallowed: maxY
            },
            xaxis: {
                linecolor: "#000",
                linewidth: 1,
                mirror: true,
            },
            margin: {
                p: 0,
                t: 1,
                r: 2,
                b: 25,
                l: 1,
            },
            font: {
                size: 15
            },
            showlegend: false,
        };

        if (document.getElementById('dinamic-balance-graph-first')) Plotly.newPlot('dinamic-balance-graph-first', dataFirstGraph, layoutFirstGraph, { staticPlot: true });

        if (details == true) {
            let maxTransactionsFrom = 0;
            let balanceDinamicGreen = [];
            let balanceDinamicRed = [];

            for (let i = 0; i < periodFlag; i++) {
                let balanceGreen;
                let balanceRed;
                if (transactionsFromEachMonth[i]) {
                    if (transactionsFromEachMonth[i].all > maxTransactonsSum) {
                        maxTransactonsSum = transactionsFromEachMonth[i].all
                    }
                }

                if (percentTransactionsEachMonth[i]) {
                    if (String(percentTransactionsEachMonth[i].from) !== 'NaN') {
                        balanceGreen = transactionsFromEachMonth[i].all * percentTransactionsEachMonth[i].to;
                        balanceRed = transactionsFromEachMonth[i].all * percentTransactionsEachMonth[i].from;
                        if (balanceRed > maxTransactionsFrom) {
                            maxTransactionsFrom = balanceRed;
                        }
                    } else {
                        balanceRed = 0;
                        balanceGreen = 0;
                    }
                }
                balanceDinamicGreen.push(balanceGreen);
                balanceDinamicRed.push(balanceRed);
            }

            if (maxTransactionsFrom !== 0) {
                if (maxTransactionsFrom !== maxTransactonsSum) {
                    dinamicBalanceRatioCenter.textContent = numberHandling(Number(maxTransactionsFrom)) + ' ₽';
                }
            }

            if (maxTransactonsSum > 0) {
                dinamicBalanceRatioMax.textContent = numberHandling(Number(maxTransactonsSum)) + ' ₽';
            } else {
                dinamicBalanceRatioMax.textContent = '0 ₽';
            }

            const secondGraphGreen = {
                x: xMonthArr,
                y: balanceDinamicGreen,
                type: 'bar',
                marker: {
                    color: 'rgba(118, 202, 102, 1)'
                }
            };

            const secondGraphRed = {
                x: xMonthArr,
                y: balanceDinamicRed,
                type: 'bar',
                marker: {
                    color: 'rgba(253, 78, 93, 1)'
                }
            };

            const dataSecondGraph = [secondGraphRed, secondGraphGreen];

            let graphWidth;
            let tickSuffix;

            if (details == false) {
                graphWidth = 564 - dinamicBalanceRange.offsetWidth;
                tickSuffix = '';
            } else {
                graphWidth = 1120 - dinamicBalanceRange.offsetWidth;
                tickSuffix = ' ₽'
            }

            const layoutSecondGraph = {
                barmode: 'stack',
                autosize: false,
                width: graphWidth,
                height: 195,
                yaxis: {
                    tickvals: [0, maxTransactionsFrom, maxTransactonsSum],
                    tickmode: 'array',
                    ticksuffix: tickSuffix,
                    side: 'right',
                    linecolor: "#000",
                    linewidth: 1,
                    mirror: true,
                    maxallowed: maxTransactonsSum
                },
                xaxis: {
                    linecolor: "#000",
                    linewidth: 1,
                    mirror: true,
                },
                margin: {
                    p: 0,
                    t: 1,
                    r: 2,
                    b: 25,
                    l: 1,
                },
                font: {
                    size: 15
                },
                showlegend: false,
            };

            if (document.getElementById('dinamic-balance-graph-second')) Plotly.newPlot('dinamic-balance-graph-second', dataSecondGraph, layoutSecondGraph, { staticPlot: true });

            let top = (dinamicBalanceRatioRange.offsetHeight - dinamicBalanceRatioMin.offsetHeight - dinamicBalanceRatioMax.offsetHeight) *
                (1 - (maxTransactionsFrom / maxTransactonsSum));
            if (top > 140) {
                top = 140;
            }
            if (top < 20) {
                top = 20;
            }
            dinamicBalanceRatioCenter.style.top = `${top}px`;
        }

        const transactionsReverse = (transactions).reverse();
        let tableLength;

        if (details == false) {
            tableLength = 10;
        } else {
            tableLength = 25;
        }

        if (transactionsReverse.length > 0) {
            createHistoryTransactionsTable(transactionsReverse, tableLength, historyTransactionsTableTbody, account)
        }

        if (transactionsReverse.length > 25 && details) {
            const historyTransactionsTableBtnsContainer = el('div.history-transactions-table-btns-container');
            mount(historyTransactionsContainer, historyTransactionsTableBtnsContainer);

            let btnsLength = Math.trunc(transactionsReverse.length / 25);

            if (transactionsReverse.length % 25 > 0) {
                btnsLength = btnsLength + 1;
            }

            createBtnsPagination(btnsLength, 1, historyTransactionsTableBtnsContainer, transactionsReverse, tableLength, historyTransactionsTableTbody, account)
        }
    })
}

// Создание таблицы истории переводов
function createHistoryTransactionsTable(transactions, tableLength, tableBody, account) {
    tableBody.innerHTML = '';
    for (let i = 0; i < tableLength; i++) {
        if (!transactions[i]) return;

        const historyTransactionsTableTr = el('tr.history-transactions-table-tr');
        const historyTransactionsTableTdSender = el('td.history-transactions-table-td.history-transactions-table-td-sender');
        const historyTransactionsTableTdRecipient = el('td.history-transactions-table-td.history-transactions-table-td-recipient');
        const historyTransactionsTableTdSum = el('td.history-transactions-table-td.history-transactions-table-td-sum');
        const historyTransactionsTableTdDate = el('td.history-transactions-table-td.history-transactions-table-td-date');

        const accountSender = transactions[i].from;
        const accountRecipient = transactions[i].to;
        const accountMount = transactions[i].amount;
        const accountDate = new Date(transactions[i].date);
        const accountDateStr = accountDate.getDate() + '.' + (accountDate.getMonth() + 1) + '.' + accountDate.getFullYear();
        let accountSum;

        mount(tableBody, historyTransactionsTableTr)
        setChildren(historyTransactionsTableTr, [historyTransactionsTableTdSender, historyTransactionsTableTdRecipient, historyTransactionsTableTdSum, historyTransactionsTableTdDate]);

        historyTransactionsTableTdSender.textContent = accountSender;
        historyTransactionsTableTdRecipient.textContent = accountRecipient;

        if (account === accountSender) {
            accountSum = '-' + String(accountMount) + ' ₽';
            historyTransactionsTableTdSum.style.color = 'red';
        } else {
            accountSum = '+' + String(accountMount) + ' ₽';
            historyTransactionsTableTdSum.style.color = 'green';
        }

        historyTransactionsTableTdSum.textContent = accountSum;
        historyTransactionsTableTdDate.textContent = accountDateStr;
    }
}

// Создание кнопок погинации для таблицы истории переводов
function createBtnsPagination(btnsLength, btnNumber = 1, btnsPaginationContainer, transactions, tableLength, tableBody, account) {
    btnsPaginationContainer.innerHTML = '';
    const btnsContainer = el('div.btn-pagination-container');

    if (btnsLength > 10) {
        if (btnNumber > btnsLength - 3) {
            const btn = el('button.btn-reset.table-btn-number', 1);
            const threeDotsSpan = el('span.three-dots-span', ' . . . ');
            const firstPageTransactions = transactions.slice(0, 26)

            btn.addEventListener('click', () => {
                createHistoryTransactionsTable(firstPageTransactions, tableLength, tableBody, account)
                createBtnsPagination(btnsLength, 1, btnsPaginationContainer, transactions, tableLength, tableBody, account)
            })

            mount(btnsContainer, btn)
            mount(btnsContainer, threeDotsSpan);

            for (let i = btnsLength - 4; i < btnsLength + 1; i++) {
                const thisPageTransactions = transactions.slice((i - 1) * 25, (25 * i + 1))
                const btn = el('button.btn-reset.table-btn-number', i);
                if (btnNumber == i) {
                    btn.classList.add('active-btn-pagination');
                }

                btn.addEventListener('click', () => {
                    createHistoryTransactionsTable(thisPageTransactions, tableLength, tableBody, account)
                    createBtnsPagination(btnsLength, i, btnsPaginationContainer, transactions, tableLength, tableBody, account)
                })

                mount(btnsContainer, btn);
            }
            mount(btnsPaginationContainer, btnsContainer);
            return
        }

        if (btnNumber < 4) {
            for (let i = 1; i < 7; i++) {
                if (i == 6) {
                    i = btnsLength;
                    const threeDotsSpan = el('span.three-dots-span', ' . . . ');
                    mount(btnsContainer, threeDotsSpan);
                }

                const thisPageTransactions = transactions.slice((i - 1) * 25, (25 * i + 1))
                const btn = el('button.btn-reset.table-btn-number', i);

                if (btnNumber == i) {
                    btn.classList.add('active-btn-pagination');
                }

                btn.addEventListener('click', () => {
                    createHistoryTransactionsTable(thisPageTransactions, tableLength, tableBody, account)
                    createBtnsPagination(btnsLength, i, btnsPaginationContainer, transactions, tableLength, tableBody, account)
                })

                mount(btnsContainer, btn);
            }
            mount(btnsPaginationContainer, btnsContainer);
        } else {
            const btn = el('button.btn-reset.table-btn-number', 1);
            const threeDotsSpan = el('span.three-dots-span', ' . . . ');
            const firstPageTransactions = transactions.slice(0, 26)

            btn.addEventListener('click', () => {
                createHistoryTransactionsTable(firstPageTransactions, tableLength, tableBody, account)
                createBtnsPagination(btnsLength, 1, btnsPaginationContainer, transactions, tableLength, tableBody, account)
            })

            mount(btnsContainer, btn)
            mount(btnsContainer, threeDotsSpan);

            for (let i = btnNumber - 2; i < btnNumber + 4; i++) {
                if (i == btnNumber + 3) {
                    i = btnsLength;
                    const threeDotsSpan = el('span.three-dots-span', ' . . . ');
                    mount(btnsContainer, threeDotsSpan);
                }

                const thisPageTransactions = transactions.slice((i - 1) * 25 + 1, (25 * i + 1))
                const btn = el('button.btn-reset.table-btn-number', i);

                if (btnNumber == i) {
                    btn.classList.add('active-btn-pagination');
                }

                btn.addEventListener('click', () => {
                    createHistoryTransactionsTable(thisPageTransactions, tableLength, tableBody, account)
                    createBtnsPagination(btnsLength, i, btnsPaginationContainer, transactions, tableLength, tableBody, account)
                })

                mount(btnsContainer, btn);
            }
            mount(btnsPaginationContainer, btnsContainer);
        }
    } else {
        for (let i = 1; i <= btnsLength; i++) {
            const thisPageTransactions = transactions.slice((i - 1) * 25, (25 * i + 1))
            const btn = el('button.btn-reset.table-btn-number', i);

            if (btnNumber == i) {
                btn.classList.add('active-btn-pagination');
            }

            btn.addEventListener('click', () => {
                createHistoryTransactionsTable(thisPageTransactions, tableLength, tableBody, account)
                createBtnsPagination(btnsLength, i, btnsPaginationContainer, transactions, tableLength, tableBody, account)
            })

            mount(btnsContainer, btn);
        }
        mount(btnsPaginationContainer, btnsContainer);
    }
}

// Создание блока валют
function createCurrencyBlock(currencyAllList, yourCurrencies, token) {
    const rootContainer = document.querySelector('.root-container');
    const currencyTitle = el('h2.currency-title', 'Валютный обмен');
    const currencyBlocksContainer = el('div.currency-blocks-container')
    const currencyBlockLeft = el('div.currency-block-left');

    const currencyYourBlock = el('div.currency-your-block');
    const currencyYourTitle = el('h5.currency-your-title');
    const currencyYourAccountsList = el('ul.list-reset.currency-your-accouts-list');

    const currencyTradeBlock = el('div.currency-trade-block');
    const currencyTradeTitle = el('h5.currency-trade-title', 'Обмен валюты');
    const currencyTradeFormContainer = el('div.currency-trade-form-container');
    const currencyTradeForm = el('form.currency-trade-form');
    const currencyTradeFormTop = el('div.currency-trade-form-top');
    const currencyTradeFormBottom = el('div.currency-trade-form-bottom');
    const currencyTradeSelectFrom = el('select.currency-trade-select-from');
    const currencyTradeLabelFrom = el('label.currency-trade-label-from', 'Из');
    const currencyTradeSelectTo = el('select.currency-trade-select-to');
    const currencyTradeLabelTo = el('label.currency-trade-label-to', 'в');
    const currencyTradeInputSum = el('input.currency-trade-input-sum', { type: 'number' });
    const currencyTradeLabelSum = el('label.currency-trade-label-sum', 'Сумма');
    const currencyTradeBtnExchange = el('button.btn-reset.blue-btn.currency-trade-btn-exchange', 'Обменять');

    const currencyCourseBlock = el('div.currency-course-block');
    const currencyCourseTitle = el('h5.currency-course-title', 'Изменение курсов в реальном времени');
    const currencyCourseList = el('ul.list-reset.currency-course-list');

    setChildren(rootContainer, [currencyTitle, currencyBlocksContainer]);
    setChildren(currencyBlocksContainer, [currencyBlockLeft, currencyCourseBlock]);
    setChildren(currencyBlockLeft, [currencyYourBlock, currencyTradeBlock]);

    setChildren(currencyYourBlock, [currencyYourTitle, currencyYourAccountsList]);
    setChildren(currencyTradeBlock, [currencyTradeTitle, currencyTradeFormContainer])
    setChildren(currencyTradeFormContainer, [currencyTradeForm, currencyTradeBtnExchange])
    setChildren(currencyTradeForm, [currencyTradeFormTop, currencyTradeFormBottom])
    setChildren(currencyTradeFormTop, [currencyTradeLabelFrom, currencyTradeSelectFrom, currencyTradeLabelTo, currencyTradeSelectTo]);
    setChildren(currencyTradeFormBottom, [currencyTradeLabelSum, currencyTradeInputSum]);

    setChildren(currencyCourseBlock, [currencyCourseTitle, currencyCourseList]);

    setChildren(currencyYourAccountsList, loaderCreate());
    setChildren(currencyCourseList, loaderCreate());

    openCurrencyFeed().onmessage = function (event) {
        const data = JSON.parse(event.data);
        if (currencyCourseList.querySelector('.spinner-container')) currencyCourseList.querySelector('.spinner-container').remove();
        createCourseItem(currencyCourseList, data.from, data.to, data.rate, data.change);
    };

    Promise.all([currencyAllList, yourCurrencies]).then(([currencyAllList, yourCurrencies]) => {
        currencyYourAccountsList.innerHTML = '';
        currencyAllList.payload.forEach(currency => {
            const currencyTradeSelectOptionFrom = el('option.currency-trade-select-option', `${currency}`);
            const currencyTradeSelectOptionTo = el('option.currency-trade-select-option', `${currency}`);

            mount(currencyTradeSelectFrom, currencyTradeSelectOptionFrom);
            mount(currencyTradeSelectTo, currencyTradeSelectOptionTo);

        });

        new Choices(currencyTradeSelectFrom, {
            searchEnabled: false,
            itemSelectText: ''
        });

        new Choices(currencyTradeSelectTo, {
            searchEnabled: false,
            itemSelectText: ''
        });

        const accounts = yourCurrencies.payload;
        for (const property in accounts) {
            const currencyTradeAccount = el('li.currency-your-accouts-item');
            const currencyTradeAccountCode = el('span.currency-your-accouts-item-code', accounts[property].code);
            const brokenLine = el('div.broken-line');

            const currencyTradeAccountAmount = el('span.currency-your-accouts-item-amount', numberHandling(accounts[property].amount));

            setChildren(currencyTradeAccount, [currencyTradeAccountCode, brokenLine, currencyTradeAccountAmount]);
            mount(currencyYourAccountsList, currencyTradeAccount);
        }
    })

    currencyTradeInputSum.addEventListener('input', () => {
        if (document.querySelector('.trade-error-container')) document.querySelector('.trade-error-container').remove();
    })

    currencyTradeBtnExchange.addEventListener('click', () => {
        if (document.querySelector('.trade-error-container')) document.querySelector('.trade-error-container').remove();

        if (currencyTradeSelectFrom.value == currencyTradeSelectTo.value) {
            const tradeError = el('div.trade-error-container', 'Указан одинаковый счёт валют');
            mount(currencyTradeBlock, tradeError);
            return
        }

        const newTrade = currencyBuy(token, currencyTradeSelectFrom.value, currencyTradeSelectTo.value, currencyTradeInputSum.value).then(res => res.json());

        if (currencyTradeInputSum.value < 1) {
            const tradeError = el('div.trade-error-container', 'Не указана сумма перевода, или она отрицательная');
            mount(currencyTradeBlock, tradeError);
            return
        }

        newTrade.then(res => {

            if (res.error.length == 0) {
                currencyYourAccountsList.innerHTML = '';
                const accounts = res.payload;

                for (const property in accounts) {
                    const currencyTradeAccount = el('li.currency-your-accouts-item');
                    const currencyTradeAccountCode = el('span.currency-your-accouts-item-code', accounts[property].code);
                    const brokenLine = el('div.broken-line');

                    const currencyTradeAccountAmount = el('span.currency-your-accouts-item-amount', numberHandling(accounts[property].amount));

                    setChildren(currencyTradeAccount, [currencyTradeAccountCode, brokenLine, currencyTradeAccountAmount]);
                    mount(currencyYourAccountsList, currencyTradeAccount);
                }

                currencyTradeSelectFrom.selectedIndex = 0;
                currencyTradeSelectTo.selectedIndex = 0;
                currencyTradeInputSum.value = '';

                createModalWindow('Обмен валюты прошел успешно!');
            } else {
                const tradeError = el('div.trade-error-container');

                if (res.error == 'Unknown currency code') {
                    tradeError.textContent = 'Что-то пошло не так, попробуйте позже или обратитесь в поддержку.'
                }
                if (res.error == 'Invalid amount') {
                    tradeError.textContent = 'Не указана сумма перевода, или она отрицательная'
                }
                if (res.error == 'Not enough currency') {
                    tradeError.textContent = 'На валютном счёте списания нет средств'
                }
                if (res.error == 'Overdraft prevented') {
                    tradeError.textContent = 'Попытка перевести больше, чем доступно на счёте списания.'
                }

                mount(currencyTradeBlock, tradeError);
            }
        });
    })
}

// Создание строки изменения курса в реальном времени
function createCourseItem(container, from, to, rate, change) {
    const courseItem = el('li.course-item');
    const fromTo = el('span.course-from-to', `${from}/${to}`);
    const brokenLine = el('div.broken-line');
    const rateCourse = el('span.course-rate', rate);
    const changeCourse = el('div.course-change');

    if (change === 1) {
        rateCourse.classList.add('triangle-green');
        brokenLine.classList.add('green-line');
    }

    if (change === -1) {
        rateCourse.classList.add('triangle-red');
        brokenLine.classList.add('red-line');
    }

    if (container.querySelectorAll('li').length > 20) {
        container.querySelectorAll('li')[20].remove();
    }

    setChildren(courseItem, [fromTo, brokenLine, rateCourse, changeCourse]);

    container.prepend(courseItem)
}

// Создание блока Банкоматы
async function createATMsBlock() {
    const rootContainer = document.querySelector('.root-container');
    await ymaps3.ready;

    const ATMsTitle = el('h2.atms-title', 'Карта банкоматов');
    const mapContainer = el('div.map-container');


    const { YMap, YMapDefaultSchemeLayer, YMapMarker, YMapDefaultFeaturesLayer } = ymaps3;
    const map = new YMap(
        mapContainer,
        {
            location: {
                center: [37.588144, 55.733842],
                zoom: 10
            }
        }
    );

    getBanks().then(res => {
        const banks = res.payload;
        banks.forEach(bank => {
            const placemarkContainer = el('div.placemark')
            const placemarkSvg = el('img.placemark-svg', { src: placemark });

            mount(placemarkContainer, placemarkSvg)

            map.addChild(new YMapMarker({
                coordinates: [bank.lon, bank.lat],
            }, placemarkContainer));
        })
    });

    map.addChild(new YMapDefaultSchemeLayer());
    map.addChild(new YMapDefaultFeaturesLayer({ zIndex: 1800 }))

    setChildren(rootContainer, [ATMsTitle, mapContainer]);
}

function createModalWindow(text) {
    const modalWindowContainer = el('div.modal-window-container');
    const modalWindow = el('div.modal-window');
    const modalWindowText = el('div.modal-window-text', text);
    const modalWindowBtn = el('button.btn-reset.blue-btn.modal-window-btn', 'Ок');

    setChildren(modalWindowContainer, modalWindow);
    setChildren(modalWindow, [modalWindowText, modalWindowBtn]);
    mount(document.body, modalWindowContainer);

    setTimeout(() => {
        modalWindowContainer.classList.add('modal-opacity');
        modalWindow.classList.add('modal-transform');
    }, 3);

    modalWindowBtn.addEventListener('click', () => {
        modalWindowContainer.remove();
    })

    modalWindow.addEventListener('click', event => {
        event._isClickWithModal = true;
    })

    document.body.addEventListener('click', event => {
        if (event._isClickWithModal) return
        modalWindowContainer.remove();
    })
}

// Navigate router

router.on('/', () => {
    const token = localStorage.getItem('token');
    if (token) {
        router.navigate('/accounts');
    }
    loginFormCreate(rootCreate());
})

router.on('/accounts', () => {
    rootCreate();

    const token = localStorage.getItem('token');

    if (!token) {
        router.navigate('/');
        return
    }

    navCreate();
    navBtnsBg('.nav-accounts');
    accountsCardsCreate(getBankData(token), token);

})

router.on('/currency', () => {
    const token = localStorage.getItem('token');

    if (!token) {
        router.navigate('/');
        return
    }

    rootCreate();
    navCreate();
    navBtnsBg('.nav-currency');
    createCurrencyBlock(getAllCurrencies(), getYourCurrencies(token), token);
})

router.on('/banks', () => {
    const token = localStorage.getItem('token');

    if (!token) {
        router.navigate('/');
        return
    }

    rootCreate();
    navCreate();
    navBtnsBg('.nav-atms');
    createATMsBlock();
})

router.on('/accounts/:account', ({ data: { account } }) => {
    const token = localStorage.getItem('token');
    let details = false

    if (window.location.hash == '#details') {
        details = true
    }

    if (!token) {
        router.navigate('/');
        return
    }
    rootCreate();
    navCreate();
    createAccountData(token, account, details);
    navBtnsBg();
})

router.resolve();