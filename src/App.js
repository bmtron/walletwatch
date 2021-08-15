import React, { Component } from 'react';
import PublicRoute from './Utils/PublicRoute';
import PrivateRoute from './Utils/PrivateRoute';
import LandingPage from './LandingPage/LandingPageForm';
import Homepage from './BudgetHome/Homepage';
import AddItem from './AddItems/AddItems';
import DailyExpense from './DailyExpenses/DailyExpensesPage';
import ErrorPage from './Error/ErrorPage';
import LoginPage from './LoginPage/LoginPage';
import {Route} from 'react-router-dom';
import './App.css';
//updating for prod release
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
        <Route path='/login' component={LoginPage}/>
        <PrivateRoute path='/budget' component={Homepage}/>
        <PrivateRoute path='/add_item' component={AddItem}/>
        <PrivateRoute path='/daily_expense' component={DailyExpense}/>
        <Route path='/error' component={ErrorPage}/>
      </div>
    );
  }
}

export default App;
