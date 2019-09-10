import React, { Component } from 'react';
import { Route } from 'react-router';
import LandingPage from './LandingPage/LandingPageForm';
import Homepage from './BudgetHome/Homepage';
import AddItem from './AddItems/AddItems';
import DailyExpense from './DailyExpenses/DailyExpensesPage';
import './App.css';

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      test: 0
    }
  }
  render() {
    return (
      <div className="App">
        <Route exact path='/' component={LandingPage}/>
        <Route path='/budget' component={Homepage}/>
        <Route path='/add_item' component={AddItem}/>
        <Route path='/daily_expense' component={DailyExpense}/>
      </div>
    );
  }
}

export default App;
