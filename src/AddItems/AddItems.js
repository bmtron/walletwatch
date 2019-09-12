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
        this.context.budgetItems = [...this.context.budgetItems, {name: this.state.name, price: this.state.price}]
        this.props.history.push('/budget')
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