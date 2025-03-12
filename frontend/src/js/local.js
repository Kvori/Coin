export function logIn(login, password) {
    const data = fetch('http://localhost:3000/login', {
        method: 'POST',
        body: JSON.stringify({
            login: login,
            password: password
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        const response = res.json()
        return response;
    })
    
    return data;
}

export function getBankData(token) {
    const response = (fetch('http://localhost:3000/accounts', {
        method: 'GET',
        headers: {
            Authorization: `Basic ${token}`,
            'Content-Type': 'application/json'
        }
    })).then(res => res.json());
    return response;
}

export function getAccountData(token, account) {
    const response = fetch(`http://localhost:3000/account/${account}`, {
        method: 'GET',
        headers: {
            Authorization: `Basic ${token}`,
            'Content-Type': 'application/json'
        }
    }).then(res => res.json());
    return response;
}

export function transaction(token, from, to, amount) {
    const response = fetch('http://localhost:3000/transfer-funds', {
        method: 'POST',
        headers: {
            Authorization: `Basic ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            from: from,
            to: to,
            amount: amount
        }),
    })

    return response;
}

export function createNewAccount(token) {
    const response = fetch(`http://localhost:3000/create-account`, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${token}`,
            'Content-Type': 'application/json'
        }
    }).then(res => res.json());

    return response;
}

export function getAllCurrencies() {
    const response = fetch('http://localhost:3000/all-currencies').then(res => res.json());

    return response;
}

export function getYourCurrencies(token) {
    const response = fetch('http://localhost:3000/currencies', {
        method: 'GET',
        headers: {
            Authorization: `Basic ${token}`,
            'Content-Type': 'application/json'
        }
    }).then(res => res.json());

    return response;
}

export function openCurrencyFeed() {
    const socket = new WebSocket('ws:localhost:3000/currency-feed');
    const links = document.querySelectorAll('.nav-link')

    socket.onopen = function () {
        console.log("Соединение установлено");
        console.log("Отправляем данные на сервер");
    };

    socket.onclose = function (event) {
        if (event.wasClean) {
            console.log(`Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
        } else {
            console.log('Соединение прервано');
        }
    };

    links.forEach(btn => {
        const classList = [...btn.classList];
        if (classList.includes('nav-currency')) return;
        btn.addEventListener('click', () => {
            socket.close(1000, 'соединение закрыто')
        })
    });

    return socket;
}

export function test() {
    const socket = WebSocket('ws:localhost:3000/currency-feed');
    socket.close(1000, 'закрываем');
}

export function currencyBuy(token, from, to, amount) {
    const response = fetch('http://localhost:3000/currency-buy', {
        method: 'POST',
        headers: {
            Authorization: `Basic ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            from: from,
            to: to,
            amount: amount
        }),
    })

    return response;
}

export function getBanks() {
    const response = fetch('http://localhost:3000/banks').then(res => res.json());

    return response;
}