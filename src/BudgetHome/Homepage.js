import React, { Component } from 'react';
import './Homepage.css';
import {Link} from 'react-router-dom';
import BudgetContext from '../Utils/BudgetContext';

export default class Homepage extends Component {
    static contextType = BudgetContext;

    constructor(props) {
        super(props) 
        this.state = {
            netIncome: 0,
            expenses: 0,
            netIncomeInput: '',
            budgetItems: null,
            dailyItemTotal: ''
        }
    }
    handleUpdateNetIncome = (e) => {
        this.setState({
            netIncomeInput: e
        })
    }
    submitUpdateNetIncome = (e) => {
        e.preventDefault();
        this.setState({
            netIncome: this.state.netIncomeInput,
            netIncomeInput: ''
        })
        this.context.netIncome = this.state.netIncomeInput
    }
    calculateExpenses(arr) {
        let total = 0;
        
        for (let i = 0; i < arr.length; i++) {
            let strToInt = parseInt(arr[i].price, 10)
            total = total + strToInt;
            console.log(total)
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
    componentDidMount() {
        let expenses = this.calculateExpenses(this.context.budgetItems)
        let daily_total_monthly = this.calculateDailyItemsMonthlyTotal(this.context.dailyItems)
        this.setState({
            expenses: expenses,
            netIncome: this.context.netIncome,
            disposableIncome: this.context.disposableIncome,
            budgetItems: this.context.budgetItems,
            dailyItemTotal: daily_total_monthly
        })
    }
    render() {
        console.log(this.state.budgetItems)
        return (
            <div>
               <nav>
                    <h2>Wallet Watch</h2>
                    <section><p>Logout</p></section>
                </nav>
                <section className="income_display">
                    <section className="net_income">
                        <h2>Net Income</h2>
                        <p>${this.state.netIncome}</p>
                        <form className="update_net_income" onSubmit={(e) => this.submitUpdateNetIncome(e)}>
                            <input type="number" onChange={(e) => this.handleUpdateNetIncome(e.target.value)} value={this.state.netIncomeInput}/>
                            <button disabled={(this.state.netIncomeInput === '')}>Update Net Income</button>
                        </form>
                    </section>
                    <section className="disposable_income">
                        <h2>Disposable Income</h2>
                        <p>${this.state.netIncome - this.state.expenses}</p>
                        <p>Disposable Income Less Daily Expenses</p>
                        <p>${this.state.netIncome - this.state.expenses - this.state.dailyItemTotal}</p>

                        <h2>Total Daily Expenses Cost per Month</h2>
                        <p>${this.state.dailyItemTotal}</p>
                    </section>
                </section>
                <section className="cat_header"><h2>Categories</h2></section>
                <Link to='/add_item'><button>Add New Item</button></Link>
                <Link to="/daily_expense"><button>Daily Expenditures</button></Link>
                <section className="budget_items">
                    <table>
                        <tbody>
                            <tr>
                                <th>Budget Family</th>
                                <th>Monthly Budget</th>
                            </tr>
                        </tbody>
                    {this.state.budgetItems == null ? null : this.state.budgetItems.map((item, index) => {
                        return <tbody key={index}>
                            <tr>
                                <td>{item.name}</td>
                                <td>{item.price}</td>
                            </tr>
                        </tbody>
                        /*return <section key={index}>
                            <p>Name: {item.name}</p>
                            <p>Price: {item.price}</p>
                        </section>*/
                    })}
                    </table>
                </section>
            </div>
        )
    }
}