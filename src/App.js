import React, { Component } from 'react';
import PublicRoute from './Utils/PublicRoute';
import PrivateRoute from './Utils/PrivateRoute';
import LandingPage from './LandingPage/LandingPageForm';
import Homepage from './BudgetHome/Homepage';
import AddItem from './AddItems/AddItems';
import DailyExpense from './DailyExpenses/DailyExpensesPage';
import LoginPage from './LoginPage/LoginPage';
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
        <PublicRoute exact path='/' component={LandingPage}/>
        <PublicRoute path='/login' component={LoginPage}/>
        <PrivateRoute path='/budget' component={Homepage}/>
        <PrivateRoute path='/add_item' component={AddItem}/>
        <PrivateRoute path='/daily_expense' component={DailyExpense}/>
      </div>
    );
  }
}

export default App;
