import React, { Component } from 'react';
import BudgetContext from '../Utils/BudgetContext';
import {Link} from 'react-router-dom';
export default class AddItem extends Component {
    static contextType = BudgetContext;
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            price: '',
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
    
    handleAddItem = (e) =>{
        e.preventDefault();
        let user = sessionStorage.getItem('user')
        let newItem = {
            category: this.state.name,
            amount: this.state.price,
            user_name: user
        }
        let url = `http://localhost:8000/api/budget_items/`
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
            console.log(resJson)
            this.props.history.push('/budget')
        })
        .catch(e => {
            console.log(e)
        })
    }
    render() {
        return (
            <div>
                <nav>
                    <h2>Wallet Watch</h2>
                    <section><p>Login</p></section>
                </nav>
                <section className="add_item_form">
                    <h2>Add New Budget Item</h2>
                    <form onSubmit={(e) => this.handleAddItem(e)}>
                        <label>Name</label>
                        <input onChange={(e) => this.handleNameChange(e.target.value)}/>
                        <label>Price</label>
                        <input onChange={(e) => this.handlePriceChange(e.target.value)}/>
                        <button type="submit" disabled={(this.state.name === '' || this.state.price === '')}>Add Item</button>
                        <Link to='/budget'><button>Cancel</button></Link>
                    </form>
                </section>
            </div>
        )
    }
}