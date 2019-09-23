import React, { Component } from 'react';
import BudgetContext from '../Utils/BudgetContext';
import config from '../config';
import './AddItems.css';

export default class AddItem extends Component {
    static contextType = BudgetContext;
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            price: '',
            error: null
        }
    }
    handleNameChange = (e) => {
        this.setState({
            name: e
        })
    }
    handlePriceChange = (e) => {
        this.setState({
            price: e
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
        .catch(error => {
            this.setState({
                error: error
            })
            this.props.history.push('/error')
        })
    }
    handleAddItem = (e) =>{
        e.preventDefault();
        let user = sessionStorage.getItem('user')
        let newItem = {
            category: this.state.name,
            amount: this.state.price,
            user_name: user
        }
        let url = `${config.API_ENDPOINT}/budget_items`
        fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(newItem)
        })
        .then(res => {
            if(!res.ok) {
                return res.json().then(e => Promise.reject(e))
            }
            return res.json()
        })
        .then(resJson => {
            this.setState({
                name: '',
                amount: ''
            })
            this.context.budgetItems = [...this.context.budgetItems, newItem]
            this.props.handleCancel();    
            window.location.reload();  
        })
        .catch(e => {
            this.setState({
                error: e
            })
        })
    }
    render() {
        return (
            <div>
                <section className="add_item_wrapper">
                    <section className="add_item_container">
                       <section className="add_header">
                        <h2 className="add_item_header">Add New Budget Item</h2>
                       </section>
                        <form className="add_item_form" onSubmit={(e) => this.handleAddItem(e)}>
                            <section className="add_item_name_container">
                                <label className="add_item_name_label">Name</label>
                                <input className="add_item_name" onChange={(e) => this.handleNameChange(e.target.value)}/>
                            </section>
                            <section className="add_item_price_container">
                                <label className="add_item_amount_label">Amount</label>
                                <input className="add_item_amount" onChange={(e) => this.handlePriceChange(e.target.value)} type="number"/>
                            </section>
                            <section className="add_item_buttons_container">
                                <button type="submit" disabled={(this.state.name === '' || this.state.price === '')} >Add Item</button>
                                <button onClick={() => this.props.handleCancel()}>Cancel</button>
                            </section>
                        </form>
                    </section>
                </section>
            </div>
        )
    }
}