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
            itemsArray: []
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
            console.error(error)
            this.props.history.push('/error')
        })
    }
    getUserDailyData() {
        let url = `${config.API_ENDPOINT}daily_items/${sessionStorage.getItem('user')}`
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
            console.log(resJson)
            this.setState({
                itemsArray: resJson
            })
        })
        .catch(e => {
            console.log(e)
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
        console.log('click')
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
            console.log(resJson)
            this.setState({
                itemsArray: [...this.state.itemsArray, {item_name: resJson.item_name, price: resJson.price, frequency: resJson.frequency, id: resJson.id}],
                itemName: '',
                itemPrice: '',
                frequency: ''
            })
            this.context.dailyItems = [...this.context.dailyItems, {item_name: resJson.item_name, price: resJson.price, frequency: resJson.frequency, id: resJson.id}]
        })
        .catch(e => {
            console.log(e)
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
            console.log(e)
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
        console.log(this.state.itemsArray)
        return (
            <div>
                 <nav>
                    <h2>Wallet Watch</h2>
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
                        <option value={''}>--Select a number--</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                    </select>
                    <button type="submit" disabled={!this.validateFormSubmit()}>+</button>
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
                    {this.state.itemsArray.map((item, index) => {
                        return <tbody key={item.id}><tr>
                            <td><button onClick={() => this.deleteDailyItem(item.id)}>Delete</button>{item.item_name}</td>
                            <td>{item.frequency} days/wk</td>
                            <td>${parseFloat(item.price).toFixed(2)}</td>
                            <td>${(item.price * item.frequency).toFixed(2)}</td>
                            <td>${(item.price * item.frequency * 4).toFixed(2)}</td>
                        </tr>
                        </tbody>
                    })}
                    {!this.state.itemsArray.length ? null : <tbody>
                        <tr>
                            <th>Totals</th>
                            <th></th>
                            <th></th>
                            <th>${(this.calculateWeeklyTotal(this.state.itemsArray)).toFixed(2)}</th>
                            <th>${(this.calculateWeeklyTotal(this.state.itemsArray) * 4).toFixed(2)}</th>
                        </tr>
                    </tbody>}
                </table>
            </div>
        )
    }
}
