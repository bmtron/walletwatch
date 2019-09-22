import React, { Component } from 'react';
import './DailyExpensesPage.css';
import { Link } from 'react-router-dom';
import BudgetContext from '../Utils/BudgetContext';
import config from '../config'

export default class ExpensesPage extends Component {
    static contextType = BudgetContext;
    constructor(props) {
        super(props)
        this.state = {
            itemName: '',
            itemPrice: '',
            frequency: '',
            itemsArray: [],
            error: null
        }
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
            this.getUserDailyData()
        })
        .catch(error => {
            this.setState({
                error: error
            })
            this.props.history.push('/error')
        })
    }
    getUserDailyData() {
        let url = `${config.API_ENDPOINT}/daily_items/${sessionStorage.getItem('user')}`
        fetch(url, {
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
                itemsArray: resJson
            })
        })
        .catch(e => {
            this.setState({
                error: e
            })
        })
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
        let url = `${config.API_ENDPOINT}/daily_items`;
        let item = {
            item_name: this.state.itemName,
            user_name: sessionStorage.getItem('user'),
            price: parseFloat(this.state.itemPrice, 2),
            frequency: this.state.frequency
        }
        fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(item)
        })
        .then(res => {
            if (!res.ok) {
                return res.json().then(e => Promise.reject(e))
            }
            return res.json()
        })
        .then(resJson => {
            this.setState({
                itemsArray: [...this.state.itemsArray, {item_name: resJson.item_name, price: resJson.price, frequency: resJson.frequency, id: resJson.id}],
                itemName: '',
                itemPrice: '',
                frequency: ''
            })
            this.context.dailyItems = [...this.context.dailyItems, {item_name: resJson.item_name, price: resJson.price, frequency: resJson.frequency, id: resJson.id}]
        })
        .catch(e => {
            this.setState({
                error: e
            })
        })
    }
    calculateWeeklyTotal(arr) {
        let total = 0;
        for (let i = 0; i < arr.length; i++) {
            total = total + (arr[i].price * arr[i].frequency)
        }
        return total;
    }
    deleteDailyItem = (id) => {
        let arr = this.state.itemsArray
        for(let i = 0; i < arr.length; i++) {
            if (arr[i].id === id) {
                arr.splice(i, 1)
            }
        }
        this.setState({
            budgetItems: arr
        })
        let url = `${config.API_ENDPOINT}/daily_items/${id}`
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
        .catch(e => {
            this.setState({
                error: e
            })
        })
    }
    validateFormSubmit = () => {
        if (this.state.itemName === '') {
            return false;
        }
        else if (this.state.itemPrice === '') {
            return false;
        }
        else if (this.state.frequency === '') {
            return false;
        }
        else {
            return true;
        }
    }
    render(){
        return (
            <div>
                 <nav>
                    <h2>WalletWatch</h2>
                    <section className="home_link"><Link to='/budget'>Home</Link></section>
                </nav>
                <section className="not_nav_content">
                   
                   <section className="daily_item_add_container">
                        <section className="header">
                            <h2>Daily Expenses</h2>
                            <p>Use this page to keep track of your daily "one-offs", things like eating lunch out instead of bringing your own, or an energy drink
                                or coffee in the morning, to see how these items individually impact your monthly budget.
                            </p>
                        </section>
                        <form className="daily_item_add" onSubmit={(e) => this.handleDailyFormSubmit(e)}>
                            <section className="daily_name_container">
                                    <label htmlFor="daily_item" className="daily_item_name_label">Item Name</label>
                                    <input className="daily_item" id="daily_item" type="text" value={this.state.itemName} onChange={(e) => this.handleItemNameChange(e.target.value)}/>
                            </section>
                            <section className="daily_price_container">
                                    <label htmlFor="daily_price" className="daily_item_price_label">Price</label>
                                    <input className="daily_price" id="daily_price" step="any" type="number" value={this.state.itemPrice} onChange={(e) => this.handleItemPriceChange(e.target.value)}/>
                            </section>
                            <section className="daily_frequency_container">
                                <label className="daily_frequency_label" htmlFor="frequency">Times Purchased Per Week</label>
                                <input onChange={(e) => this.handleFrequencyChange(e.target.value)} value={this.state.frequency} name="frequency" id="frequency" className="daily_frequency" type="number">
                                </input>
                            </section>
                            <section className="add_daily_item_submit_container">
                                <button type="submit" className="daily_button_submit" disabled={!this.validateFormSubmit()}>Add Item</button>
                            </section>
                        </form>
                   </section>
                    <section className="table_container">
                        <table className="daily_item_table">
                            <tbody className="table_headers">
                                <tr>
                                    <th>Name</th>
                                    <th>Frequency</th>
                                    <th>Price</th>
                                    <th>Weekly Cost</th>
                                    <th>Monthly Cost</th>
                                </tr>
                            </tbody>
                            {this.state.itemsArray.map((item, index) => {
                                return <tbody key={item.id}><tr>
                                    <td><button onClick={() => this.deleteDailyItem(item.id)}>X</button>{item.item_name}</td>
                                    <td>{item.frequency} days/wk</td>
                                    <td>${parseFloat(item.price).toFixed(2)}</td>
                                    <td>${(item.price * item.frequency).toFixed(2)}</td>
                                    <td>${(item.price * item.frequency * 4).toFixed(2)}</td>
                                </tr>
                                </tbody>
                            })}
                            {!this.state.itemsArray.length ? null : <tbody className="table_total">
                                <tr>
                                    <td>Totals</td>
                                    <td></td>
                                    <td></td>
                                    <td>${(this.calculateWeeklyTotal(this.state.itemsArray)).toFixed(2)}</td>
                                    <td>${(this.calculateWeeklyTotal(this.state.itemsArray) * 4).toFixed(2)}</td>
                                </tr>
                            </tbody>}
                        </table>
                    </section>
                </section>
            </div>
        )
    }
}
