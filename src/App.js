import React, { Component } from 'react';
import { Route } from 'react-router';
import LandingPage from './LandingPage/LandingPageForm';
import Homepage from './BudgetHome/Homepage';
import AddItem from './AddItems/AddItems';
import './App.css';

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      
    }
  }
  render() {
    return (
      <div className="App">
        <Route exact path='/' component={LandingPage}/>
        <Route path='/budget' component={Homepage}/>
        <Route path='/add_item' component={AddItem}/>
      </div>
    );
  }
}

export default App;
