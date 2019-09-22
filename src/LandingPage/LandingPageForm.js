import React, { Component } from 'react';
import ValidationError from '../Utils/ValidationError';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import config from '../config';
import TokenService from '../Services/TokenService';

export default class LandingPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            firstName: '',
            lastName: '',
            user: '',
            pass: '',
            repeatPass: '',
            error: null,
            validationMessages: {
                firstName: '',
                lastName: '',
                user: '',
                pass: '',
                repeatPass: ''
            },
            firstNameValid: false,
            lastNameValid: false,
            userValid: false,
            passValid: false,
            repeatPassValid: false,
            formValid: false,
            submitData: {}
        }
    }
    formValid() {
        let valid = this.state.firstNameValid && this.state.lastNameValid && this.state.userValid && this.state.passValid && this.state.repeatPassValid
        this.setState({
            formValid: valid
        })
    }
    validateFirstName(fieldValue) {
        const fieldErrors = {...this.state.validationMessages};
        let hasError = false;

        const firstName = fieldValue.trim();

        if (firstName.length === 0) {
            fieldErrors.firstName = 'First name is required.';
            hasError = true;
        }
        else {
            fieldErrors.firstName = '';
            hasError = false;
        }
        this.setState({
            validationMessages: fieldErrors,
            firstNameValid: !hasError
        }, this.formValid)
    }
    validateLastName(fieldValue) {
        const fieldErrors = {...this.state.validationMessages};
        let hasError = false;

        const lastName = fieldValue.trim();

        if (lastName.length === 0) {
            fieldErrors.firstName = 'Last name is required.';
            hasError = true;
        }
        else {
            fieldErrors.lastName = '';
            hasError = false;
        }
        this.setState({
            validationMessages: fieldErrors,
            lastNameValid: !hasError
        }, this.formValid)
    }
    validateUser(fieldValue) {
        const fieldErrors = {...this.state.validationMessages};
        let hasError = false;

        const user = fieldValue.trim();

        if (user.length === 0) {
            fieldErrors.user= 'Username is required.';
            hasError = true;
        }
        else {
            fieldErrors.user= '';
            hasError = false;
        }
        this.setState({
            validationMessages: fieldErrors,
            userValid: !hasError
        }, this.formValid)
    }
    validatePassword(fieldValue) {
        const fieldErrors = {...this.state.validationMessages};
        let hasError = false;

        const password = fieldValue.trim();

        if (password.length === 0) {
            fieldErrors.password = 'Password is required.';
            hasError = true;
        }
        else if (password.length < 8 || password.length > 36) {
            fieldErrors.password = 'Password must be between 8 and 36 characters'
            hasError = true
        }
        else if (!password.match(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/)) {
            fieldErrors.password = 'Password must contain at least a lowercase letter, an uppercase letter, a number, and a special character';
            hasError = true;
        }
        else {
            fieldErrors.firstName = '';
            hasError = false;
        }
        this.setState({
            validationMessages: fieldErrors,
            passValid: !hasError
        }, this.formValid)
    }
    validateRepeatPassword(fieldValue) {
        const fieldErrors = {...this.state.validationMessages};
        let hasError = false;

        const repeatPassword = fieldValue.trim();
        const password = this.state.pass.trim();

        if (repeatPassword !== password) {
            fieldErrors.repeatPassword = 'Passwords do not match.'
            hasError = true;
        }
        this.setState({
            validationMessages: fieldErrors,
            repeatPassValid: !hasError
        }, this.formValid)
    }
    handleFirstNameChange = (firstName) => {
        this.setState({firstName}, () => {this.validateFirstName(firstName)})
    }
    handleLastNameChange = (lastName) => {
        this.setState({lastName}, () => {this.validateLastName(lastName)})
    }
    handleUserChange = (user) => {
       this.setState({user}, () => {this.validateUser(user)})
    }
    handlePasswordChange = (pass) => {
        this.setState({pass}, () => {this.validatePassword(pass)})
    }
    handleRepeatPassChange = (repeatPass) => {
        this.setState({repeatPass}, () => {this.validateRepeatPassword(repeatPass)})
    }
    handleSignupSubmit = (e) => {
        e.preventDefault();
        const user = {
            user_name: this.state.user,
            password: this.state.pass,
            first_name: this.state.firstName,
            last_name: this.state.lastName
        }
        fetch(`${config.API_ENDPOINT}/users`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        .then(res => 
            (!res.ok)
                ? res.json().then(e => Promise.reject(e))
                : res.json()
            )
        .then(user => {
            window.sessionStorage.setItem('user', this.state.user)
            this.setState({
                user: '',
                pass: '',
                repeatPass: '',
                first_name: '',
                lastname: ''
            })
            TokenService.saveAuthToken(user.authToken)
            this.props.history.push('/budget')
        })
        .catch(res => {
            this.setState({error: res.error})
        })
    }
    render() {
        return(
            <div>
                <nav>
                    <h2>WalletWatch</h2>
                    <section><Link to='/login'>Login</Link></section>
                </nav>
                <section className="hero">
                  <section className="hero_title">
                    <h1>WalletWatch</h1>
                    <p>Keeping daily spending low and savings high</p>
                  </section>
                </section>
                <section className="main_description">
                    <img src="https://i.gyazo.com/2b0dfe9525516e9e343b18c2658a25d6.png" alt="A screenshot of the walletwatch homepage" />
                    <p>WalletWatch is a budgeting tool that not only keeps track of your monthly "big ticket" items, but also allows you to keep track 
                        of your daily spending.</p><p>You may not think much of going out for that $5 morning coffee and croissant at your local breakfast joint, 
                        but how much are you really spending? WalletWatch helps you to see how much of an impact small items, like coffee, or cigarettes, 
                        can have on your bank account.</p>
                </section>
                <section className="budget_description">
                    <h2>Set Your Budget</h2>
                    <img src="https://i.gyazo.com/bcd0bae73a7683e9e43cbd5284b4e82d.png" alt="A screenshot of a user updating their income on the walletwatch homepage."></img>
                    <p>Start off by adding your net income, followed by your big monthly expenditures, such as rent, groceries, insurance, and gas.</p>
                </section>
                <section className="daily_impact">
                    <h2>Daily Impact</h2>
                    <img src="https://i.gyazo.com/af4ffdc96fd27553595912405ee19265.png" alt="A screenshot of the daily items interface"/>
                    <p>Once your big items are set, start adding in single items (like coffe, or candy bars) that you find yourself spending on a daily basis. 
                        The app will then calculate what your projected monthly expenses will look like for each item, giving you a better idea of what that 
                        single Starbucks coffee is really costing you.</p>
                </section>
                <section className="signup">
                    <h2>Ready to start saving?</h2>
                    <form className="signup_form" onSubmit={(e) => this.handleSignupSubmit(e)}>
                        <section className="first_name_container">
                            <label className="firstName">First Name</label>
                            <input className='firstName' id="firstName" type="text" onChange={(e) => this.handleFirstNameChange(e.target.value)} defaultValue=""/>
                            <ValidationError hasError={!this.state.firstNameValid} message={this.state.validationMessages.firstName}/>
                            {this.state.error === null ? null : <p>{this.state.error}</p>}
                        </section>
                        <section className="last_name_container">
                            <label className="lastName">Last Name</label>
                            <input className="lastName" id="lastName" type="text" onChange={(e) => this.handleLastNameChange(e.target.value)} defaultValue=""/>
                            <ValidationError hasError={!this.state.lastNameValid} message={this.state.validationMessages.lastName}/>
                            {this.state.error === null ? null : <p>{this.state.error}</p>}
                        </section>
                        <section className="user_container">
                            <label className="user">Username</label>
                            <input className="user" id="user" type="text" onChange={(e) => this.handleUserChange(e.target.value)} defaultValue=""/>
                            <ValidationError hasError={!this.state.userValid} message={this.state.validationMessages.user}/>
                            {this.state.error === null ? null : <p>{this.state.error}</p>}
                        </section>
                        <section className="Password_container">
                            <label className="pass">Password</label>
                            <input className="pass" id="pass" type="password" onChange={(e) => this.handlePasswordChange(e.target.value)} defaultValue=""/>
                            <ValidationError hasError={!this.state.passValid} message={this.state.validationMessages.password} />
                            {this.state.error === null ? null : <p>{this.state.error}</p>}
                        </section>
                        <section className="repeatPass">
                            <label className="rPass">Repeat Password</label>
                            <input className="rPass" id="rPass" type="password" onChange={(e) => this.handleRepeatPassChange(e.target.value)} defaultValue=""/>
                            <ValidationError hasError={!this.state.repeatPassValid} message={this.state.validationMessages.repeatPassword} />
                        </section>
                        <button type="submit" disabled={!this.state.formValid}>Sign Up</button>
                    </form> 
                </section>
            </div>
        )
    }
}