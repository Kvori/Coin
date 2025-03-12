describe('Проверка авторизации', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080');
  });

  it('Вход с пустыми полями логина и пароля не проходит', () => {
    cy.contains('Войти').click();
    cy.get('.validate-login').should('have.text', 'Логин должен быть не менее 6-и символов и не включать пробелы');
    cy.get('.validate-password').should('have.text', 'Пароль должен быть не менее 6-и символов и не включать пробелы');
  });

  it('Вход с полями логина и пароля менее 6-и символов и включающими пробелы не проходит', () => {
    cy.get('.login-input-login').type('asd');
    cy.get('.login-input-password').type('asd');

    cy.contains('Войти').click();

    cy.get('.validate-login').should('have.text', 'Логин должен быть не менее 6-и символов и не включать пробелы');
    cy.get('.validate-password').should('have.text', 'Пароль должен быть не менее 6-и символов и не включать пробелы');

    cy.get('.login-input-login').type('asd qwesd');
    cy.get('.login-input-password').type('asd asdqwd');

    cy.contains('Войти').click();

    cy.get('.validate-login').should('have.text', 'Логин должен быть не менее 6-и символов и не включать пробелы');
    cy.get('.validate-password').should('have.text', 'Пароль должен быть не менее 6-и символов и не включать пробелы');
  });

  it('Вход по не существующему логину и неверному паролю не проходит', () => {
    cy.get('.login-input-login').type('randomlogin');
    cy.get('.login-input-password').type('randompassword');

    cy.contains('Войти').click();

    cy.get('.validate-login').should('have.text', 'Пользователя с таким логином не существует');
    cy.get('.validate-password').should('have.text', '');

    cy.get('.login-input-login').clear().type('developer');

    cy.contains('Войти').click();

    cy.get('.validate-login').should('have.text', '');
    cy.get('.validate-password').should('have.text', 'Неверный пароль');
  });

  it('Вход по верному логину и паролю проходит', () => {
    cy.get('.login-input-login').type('developer');
    cy.get('.login-input-password').type('skillbox');

    cy.contains('Войти').click();

    cy.contains('Ваши счета');
  })
})

describe('Проверка навигации по разделу "счета"', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080');
    cy.get('.login-input-login').type('developer');
    cy.get('.login-input-password').type('skillbox');
    cy.contains('Войти').click();
  });

  it('Создание нового счёта', () => {
    cy.get('.accounts-container').children().then((cards) => {
      const cardsLength = cards.length;

      cy.contains('Создать новый счёт').click();
      cy.intercept('/accounts', () => {
        cy.get('.accounts-container').children().should('have.length', cardsLength + 1);
      })
    });
  })

  it('Открытие подробной информации о счёте и возврат на страницу всех счетов', () => {
    cy.get('.card-container:first-child').contains('Открыть').click();
    cy.contains('Просмотр счёта');
    cy.contains('Вернуться назад').click();
    cy.contains('Ваши счета');
  })

  it('Открытие подробной истории баланса при клике на график и на таблицу истории переводов и возврат на страницу подробной информации счёта', () => {
    cy.get('.card-container:first-child').contains('Открыть').click();
    cy.contains('Просмотр счёта');
    cy.get('.plotly').click();
    cy.contains('Соотношение входящих исходящих транзакций');
    cy.contains('Вернуться назад').click();
    cy.contains('Просмотр счёта');
    cy.get('.history-transactions-table').click();
    cy.contains('Соотношение входящих исходящих транзакций');
    cy.contains('Вернуться назад').click();
    cy.contains('Просмотр счёта');
  })
});

describe('Проверка переводов на счёт', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080');
    cy.get('.login-input-login').type('developer');
    cy.get('.login-input-password').type('skillbox');
    cy.contains('Войти').click();
  });
  
  it('Номер счёта получателя и сумма перевода должны быть заполнены', () => {
    cy.get('.card-container:first-child').contains('Открыть').click();  
    cy.get('.new-transaction-btn-send').click();
    cy.get('.new-transaction-error').contains('Номер счёта получателя и сумма перевода должны быть заполнены');  
    cy.get('#new-transaction-sum').type('1');
    cy.get('.new-transaction-btn-send').click();
    cy.get('.new-transaction-error').contains('Номер счёта получателя и сумма перевода должны быть заполнены');
    cy.get('#new-transaction-sum').clear();
    cy.get('#new-transaction-recipient').type('123123123123');
    cy.get('.new-transaction-btn-send').click();
    cy.get('.new-transaction-error').contains('Номер счёта получателя и сумма перевода должны быть заполнены');
  })

  it('Перевод на несуществующий счёт не проходит', () => {
    cy.get('.choices__inner').click()
    cy.get('.choices__list').contains('По балансу').click();
    cy.get('.card-container:first-child').contains('Открыть').click();
    cy.get('#new-transaction-recipient').type('123123123123');
    cy.get('#new-transaction-sum').type('1');
    cy.get('.new-transaction-btn-send').click();
    cy.get('.new-transaction-error').contains('Этого счёта не существует');
  })

  it('Перевод на существующий счёт (у нас есть хотя бы 1 счёт с не нулевым балансом)', () => {
    cy.get('.choices__inner').click()
    cy.get('.choices__list').contains('По балансу').click();
    cy.get('.card-container:first-child').contains('Открыть').click();
    cy.get('#new-transaction-recipient').type('61253747452820828268825011');
    cy.get('#new-transaction-sum').type('1');
    cy.get('.new-transaction-btn-send').click();
    cy.contains('Перевод прошел успешно!');
  })
})

describe('Проверка обмена валюты', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080');
    cy.get('.login-input-login').type('developer');
    cy.get('.login-input-password').type('skillbox');
    cy.contains('Войти').click();
    cy.contains('Валюта').click();
  });

  it('Попытка перевести пустую или отрицательную сумму не проходит', () => {
    cy.get('.choices__inner').eq(0).click();
    cy.get('.choices__list.is-active').contains('AUD').click();
    cy.get('.choices__inner').eq(1).click();
    cy.get('.choices__list.is-active').contains('UAH').click();
    cy.get('.currency-trade-btn-exchange').click();
    cy.get('.trade-error-container').should('contain.text', 'Не указана сумма перевода, или она отрицательная');
    cy.get('.currency-trade-input-sum').type('-1');
    cy.get('.currency-trade-btn-exchange').click();
    cy.get('.trade-error-container').should('contain.text', 'Не указана сумма перевода, или она отрицательная');
  })

  it('Обмен валюты', () => {    
    cy.get('.choices__inner').eq(0).click();
    cy.get('.choices__list.is-active').contains('BTC').click();
    cy.get('.choices__inner').eq(1).click();
    cy.get('.choices__list.is-active').contains('UAH').click();
    cy.get('.currency-trade-input-sum').type('1');
    cy.get('.currency-trade-btn-exchange').click();
    cy.contains('Обмен валюты прошел успешно!');
  })
})