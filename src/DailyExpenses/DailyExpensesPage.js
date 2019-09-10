import React, { Component } from 'react';
import './DailyExpensesPage.css';
import { Link } from 'react-router-dom';
import BudgetContext from '../Utils/BudgetContext';

export default class ExpensesPage extends Component {
    static contextType = BudgetContext;
    constructor(props) {
        super(props)
        this.state = {
            itemName: '',
            itemPrice: '',
            frequency: ''
        }
    }
    handleItemNameChange = (e) => {
        this.setState({
            itemName: e
        })
    }
    handleItemPriceChange = (e) => {
        this.setState({
            itemPrice: e
        })
    }
    handleFrequencyChange = (e) => {
        this.setState({
            frequency: e
        })
    }
    handleDailyFormSubmit = (e) => {
        e.preventDefault();
        console.log('clicked')
        this.context.dailyItems = [...this.context.dailyItems, {name: this.state.itemName, price: this.state.itemPrice, frequency: this.state.frequency}]
    }
    calculateWeeklyTotal(arr) {
        let total = 0;
        for (let i = 0; i < arr.length; i++) {
            total = total + (arr[i].price * arr[i].frequency)
        }
        return total;
    }
    deleteItemFromTable = (arr, index) => {
        arr.splice(index, 1)
    }
    render(){
        console.log(this.context.dailyItems)
        return (
            <div>
                 <nav>
                    <h2>Wallet Watch</h2>
                    <section><p>Logout</p></section>
                    <Link to='/budget'><section>Home</section></Link>
                </nav>
                <section className="header">
                    <h2>Daily Expenses</h2>
                    <p>Use this page to keep track of your daily "one-offs", things like eating lunch out instead of bringing your own, or an energy drink
                        or coffee in the morning, to see how these items individually impact your monthly budget.
                    </p>
                </section>
                <form className="daily_item_add" onSubmit={(e) => this.handleDailyFormSubmit(e)}>
                    <label htmlFor="daily_item">Item Name</label>
                    <input className="daily_item" id="daily_item" type="text" value={this.state.itemName} onChange={(e) => this.handleItemNameChange(e.target.value)}/>
                    <label htmlFor="daily_price">Price</label>
                    <input className="daily_price" id="daily_price" type="number" value={this.state.itemPrice} onChange={(e) => this.handleItemPriceChange(e.target.value)}/>
                    <label htmlFor="frequency">Times Purchased Per Week</label>
                    <select onChange={(e) => this.handleFrequencyChange(e.target.value)}>
                        <option defaultValue={null}>--Select a number--</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                    </select>
                    <button type="submit">+</button>
                </form>
                <table>
                    <tbody>
                        <tr>
                            <th>Name</th>
                            <th>Frequency</th>
                            <th>Price</th>
                            <th>Weekly Cost</th>
                            <th>Monthly Cost</th>
                        </tr>
                    </tbody>
                    {this.context.dailyItems.map((item, index) => {
                        return <tbody key={index}><tr>
                            <td><button onClick={() => this.deleteItemFromTable(this.context.dailyItems, index)}>Delete</button>{item.name}</td>
                            <td>{item.frequency} days/wk</td>
                            <td>${parseFloat(item.price).toFixed(2)}</td>
                            <td>${(item.price * item.frequency).toFixed(2)}</td>
                            <td>${(item.price * item.frequency * 4).toFixed(2)}</td>
                        </tr>
                        </tbody>
                    })}
                    {!this.context.dailyItems.length ? null : <tbody>
                        <tr>
                            <th>Totals</th>
                            <th></th>
                            <th></th>
                            <th>${(this.calculateWeeklyTotal(this.context.dailyItems)).toFixed(2)}</th>
                            <th>${(this.calculateWeeklyTotal(this.context.dailyItems) * 4).toFixed(2)}</th>
                        </tr>
                    </tbody>}
                </table>
            </div>
        )
    }
}
