import React, { Component } from 'react';
import './Homepage.css';
import {Link} from 'react-router-dom';
import config from '../config';
import BudgetContext from '../Utils/BudgetContext';
import LogoutButton from '../Utils/LogoutButton';
import AddItem from '../AddItems/AddItems';

export default class Homepage extends Component {
    static contextType = BudgetContext;

    constructor(props) {
        super(props) 
        this.state = {
            netIncome: 0,
            expenses: 0,
            netIncomeInput: '',
            budgetItems: null,
            dailyItemTotal: 0,
            incomeId: '',
            authError: false,
            addItem: false,
            error: null
        }
    }
    handleUpdateNetIncome = (e) => {
        this.setState({
            netIncomeInput: e
        })
    }
    submitAddNetIncome = (e) => {
        e.preventDefault();
        let user = sessionStorage.getItem('user')
        let income = {
            user_name: user,
            amount: this.state.netIncomeInput
        }
        
        let url = `${config.API_ENDPOINT}/net_income`
        fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(income)
        })
        .then(res => {
            if(!res.ok) {
                return res.json().then(e => Promise.reject(e))
            }
            return res.json()
        })
        .then(resJson => {
           
            this.setState({
                netIncome: resJson.amount,
                netIncomeInput: '',
                incomeId: resJson.id
            })
        })
        .catch(e => {
            this.setState({
                error: e
            })
        })
    }
    submitUpdateNetIncome = (e) => {
        e.preventDefault()
        let id = this.state.incomeId;
        let item = {
            amount: this.state.netIncomeInput
        }
        let url = `${config.API_ENDPOINT}/net_income/${id}`
        fetch(url, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(item)
        })
        .then(res => {
            if(!res.ok) {
                return res.json().then(e => Promise.reject(e))
            }
        })
        .then(resJson => {
            this.setState({
                netIncome: this.state.netIncomeInput,
                netIncomeInput: '',
            })
        })
        .catch(e => {
            this.setState({
                error: e
            })
        })
    }
    calculateExpenses(arr) {
        let total = 0;
        
        for (let i = 0; i < arr.length; i++) {
            let strToInt = parseInt(arr[i].amount, 10)
            total = total + strToInt;
        }
        return total;
    }
    calculateDailyItemsMonthlyTotal(arr) {
        let total= 0;
        for (let i=0; i< arr.length; i++) {
            total = total + (arr[i].price * arr[i].frequency * 4)
        }
        return total;
    }
    getUserData() {
        let user = sessionStorage.getItem('user')
        let url = `${config.API_ENDPOINT}/budget_items/${user}`
        fetch(url, {
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(res => {
            if(!res.ok) {
                return res.json().then(e => Promise.reject(e))
            }
            return res.json()
        })
        .then(resJson => {
            let expenses = this.calculateExpenses(resJson)
            this.setState({
                budgetItems: resJson,
                expenses: expenses
            })
        })
        .catch(e => {
            this.setState({
                error: e
            })
        })
        let incomeUrl = `${config.API_ENDPOINT}/net_income/${user}`
        fetch(incomeUrl, {
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(res => {
            if(!res.ok) {
                return res.json().then(e => Promise.reject(e))
            }
            return res.json()
        })
        .then(resJson => {
            this.setState({
                netIncome: resJson[0].amount,
                incomeId: resJson[0].id
            })
        }).catch(e => {
            this.setState({
                error: e
            })
        })
        let dailyUrl = `${config.API_ENDPOINT}/daily_items/${sessionStorage.getItem('user')}`
        fetch(dailyUrl, {
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(res => {
            if (!res.ok){
                return res.json().then(e => Promise.reject(e))
            }
            return res.json()
        })
        .then(resJson => {
            this.setState({
                dailyItemTotal: this.calculateDailyItemsMonthlyTotal(resJson)
            })
        })
        .catch(e => {
            this.setState({
                error: e
            })
        })
    }
    componentDidMount() {
        let token = sessionStorage.getItem('walletwatch-client-auth-token')
        let authToken = {
            authToken: token
        }
        fetch(`${config.API_ENDPOINT}/auth`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(authToken)
        })
        .then(res => {
            if(!res.ok) {
                return res.json().then(e => Promise.reject(e))
            }
            return res.json()
        })
        .then(resJson => {
            this.getUserData()
        })
        .catch(error => {
            this.setState({
                error: error
            })
            this.props.history.push('/error')
        })
    }
    deleteMonthlyItem = (id) => {
        let arr = this.state.budgetItems
        for(let i = 0; i < arr.length; i++) {
            if (arr[i].id === id) {
                arr.splice(i, 1)
            }
        }
        this.setState({
            budgetItems: arr
        })
        let user = sessionStorage.getItem('user')
        let url = `${config.API_ENDPOINT}/budget_items/${user}/${id}`
        fetch(url, {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(res => {
            if(!res.ok) {
                return res.json().then(e => Promise.reject(e))
            }
        })
        .then(resJson => {
            let expenses = this.calculateExpenses(this.state.budgetItems)
            this.setState({
                expenses: expenses
            })
        })
        .catch(e => {
            this.setState({
                error: e
            })
        })
    }
    handleLogout = () => {
        sessionStorage.clear();
        this.props.history.push('/budget')
    }
    handleAddItemClick = () => {
        this.setState({
            addItem: true
        })
    }
    handleCancelItemAdd = () => {
        this.setState({
            addItem: false
        })
    }
    render() {
        return (
            <div>
                {this.state.addItem ? <AddItem className="add_monthly_item_popup" handleCancel={this.handleCancelItemAdd} /> : null}
               <nav>
                   <h2>WalletWatch</h2>
                    <section><LogoutButton handleLogout={this.handleLogout}/></section>
                </nav>
                <section className="homepage_wrapper">
                    <section className="income_display_wrapper">
                        <section className="income_display">
                            <section className="net_income">
                                <p className="income_header">{window.sessionStorage.user}'s Income</p>
                                <p>${this.state.netIncome}</p>
                                <form className="update_net_income" onSubmit={(e) => this.submitUpdateNetIncome(e)}>
                                    <section className="update_income_container">
                                        <input type="number" onChange={(e) => this.handleUpdateNetIncome(e.target.value)} value={this.state.netIncomeInput}/>
                                    </section>
                                    {this.state.netIncome === 0 ? <button onClick={(e) => this.submitAddNetIncome(e)}disabled={this.state.netIncomeInput === ''}>Add Net Income</button> 
                                        : <button onClick={(e) => this.submitUpdateNetIncome(e)}disabled={this.state.netIncomeInput === ''}>Update Income</button>}
                                </form>
                            </section>
                            <section>
                                <p className="income_header">Total Daily Expenses</p>
                                <p>${parseFloat(this.state.dailyItemTotal).toFixed(2)}</p>
                            </section>
                            <section className="disposable_income">
                                <p className="income_header">Disposable Income</p>
                                <p>${parseFloat(this.state.netIncome - this.state.expenses - this.state.dailyItemTotal).toFixed(2)}</p>
                            </section>
                        </section>
                    </section>
                    <section className="budget_items_wrapper">
                        <section className="budget_items">
                            <section className="cat_header">
                                <h2>Categories</h2>
                                <button onClick={() => this.handleAddItemClick()}>Add New Item</button>
                                <Link to="/daily_expense"><button>Daily Expenditures</button></Link>
                            </section>
                                <table className="monthly_table">
                                    <tbody>
                                        <tr>
                                            <th>Budget Family</th>
                                            <th>Monthly Budget</th>
                                        </tr>
                                    </tbody>
                                {this.state.budgetItems == null ? null : this.state.budgetItems.map((item, index) => {
                                    return <tbody key={item.id}>
                                        <tr>
                                            <td>
                                                <button onClick={() => this.deleteMonthlyItem(item.id)}>X</button>
                                                {item.category}
                                            </td>
                                            <td>${parseFloat(item.amount).toFixed(2)}</td>
                                        </tr>
                                    </tbody>
                                })}
                                </table>
                        </section>
                    </section>
                </section>
            </div>
        )
    }
}