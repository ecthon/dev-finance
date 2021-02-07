const Modal = {
    open(){
        // Abrir modal
        // Adicionar a class "active" ao modal
        document.querySelector('.modal-overlay')
        .classList
        .add('active')
        
    },
    close(){
        // Fechar o modal
        // Remover a class "active" do modal
        document.querySelector('.modal-overlay')
        .classList
        .remove('active')
    }
}

const transactions = [
    {
        description: 'Luz',
        amount: -50000,
        date: '23/01/2021',
    },
    {
        description: 'Criação',
        amount: 500000,
        date: '23/01/2021',
    },
    {
        description: 'Internet',
        amount: -20000,
        date: '23/01/2021',
    },
    {
        description: 'AP',
        amount: -80000,
        date: '23/01/2021',
    },
]

const Transaction = {
    all: transactions,
    add(transaction) {
        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index) {
        Transaction.all.splice(index, 1)
        App.reload()
    },

    // somar as entradas
    incomes() {
        let income = 0
        Transaction.all.forEach(transaction => {
            if(transaction.amount > 0)  {
                income += transaction.amount;
            }
        })
        return income;
    },

    // somar as saídas
    expenses() {
        let expense = 0
        Transaction.all.forEach(transaction => {
            if(transaction.amount < 0)  {
                expense += transaction.amount
            }
        })
        return expense
    },

    // Total
    total() {
        return Transaction.incomes() + Transaction.expenses()    
    }
}

// Substituir os dados do HTML  com os dados do JS
const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),
    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction)

        DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction) {
        const CSSclass = transaction.amount > 0 ? "income": "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td><img src="./assets/minus.svg" alt="Remover transação"></td>
        `
        return html
    },

    updateBalance() {
        document
        .getElementById('incomeDisplay')
        .innerHTML = Utils.formatCurrency(Transaction.incomes())
        
        document
        .getElementById('expenseDisplay')
        .innerHTML = Utils.formatCurrency(Transaction.expenses())
        
        document
        .getElementById('totalDisplay')
        .innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = {
    formatAmount(value) {
        value = Number(value) * 100
        return value
    },

    formatDate(date) {
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g,"")

        value = Number(value)/100
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })
        return signal + value
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    formatData() {},
    validateField() {
        const { description, amount, date} = Form.getValues()
        if(description.trim() === "" ||amount.trim() === "" || date.trim() === "") {
            throw new Error("Por favor, preencha todos os campos")
        }
    },

    formatValues() {
        let { description, amount, date} = Form.getValues()

        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)

        return {
            description,
            amount,
            date
        }
    },

    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event) {
        event.preventDefault()

        try {
            Form.validateField()
            const transaction = Form.formatValues()
            Transaction.add(transaction)
            Form.clearFields()
            Modal.close()
        } catch (error) {
            alert(error.message)
        }

        // verificar se todos os compos foram preenchidos
        Form.validateField()
        // formatar os dados para Salvar
        Form.formatData()
    }
}

const App = {
    init() {
        Transaction.all.forEach(transaction => {
            DOM.addTransaction(transaction)
        })
        
        DOM.updateBalance()  
    },
    reload() {
        DOM.clearTransactions()
        App.init()
    },
}

App.init()

Transaction.add({
    description: 'Alo',
    amount: 200,
    date: '23/02/2021'
})