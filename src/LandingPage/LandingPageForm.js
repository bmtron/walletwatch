import React, { Component } from 'react';
import ValidationError from '../Utils/ValidationError';
import './LandingPage.css';

export default class LandingPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            pass: '',
            repeatPass: '',
            validationMessages: {
                firstName: '',
                lastName: '',
                email: '',
                pass: '',
                repeatPass: ''
            },
            firstNameValid: false,
            lastNameValid: false,
            emailValid: false,
            passValid: false,
            repeatPassValid: false,
            formValid: false,
            submitData: {}
        }
    }
    formValid() {
        let valid = this.state.firstNameValid && this.state.lastNameValid && this.state.emailValid && this.state.passValid && this.state.repeatPassValid
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
    validateEmail(fieldValue) {
        const fieldErrors = {...this.state.validationMessages};
        let hasError = false;

        const email = fieldValue.trim();

        if (email.length === 0) {
            fieldErrors.email= 'Email is required.';
            hasError = true;
        }
        else {
            fieldErrors.email= '';
            hasError = false;
        }
        this.setState({
            validationMessages: fieldErrors,
            emailValid: !hasError
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
    handleEmailChange = (email) => {
       this.setState({email}, () => {this.validateEmail(email)})
    }
    handlePasswordChange = (pass) => {
        this.setState({pass}, () => {this.validatePassword(pass)})
    }
    handleRepeatPassChange = (repeatPass) => {
        this.setState({repeatPass}, () => {this.validateRepeatPassword(repeatPass)})
    }
    handleSignupSubmit = (e) => {
        e.preventDefault();
        console.log('submit')
        this.setState({
            submitdata: {
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                email: this.state.email,
                password: this.state.pass,
                repeatPass: this.state.repeatPass
            }
        })
       this.props.history.push('/budget')
    }
    render() {
        return(
            <div>
                <nav>
                    <h2>Wallet Watch</h2>
                    <section><p>Login</p></section>
                </nav>
                <section className="hero">
                    <h1>WalletWatch</h1>
                    <p>Keeping daily spending low and savings high</p>
                </section>
                <section className="main_description">
                    <p>Placeholder image of budget app</p>
                    <p>WalletWatch is a budgeting tool that not only keeps track of your monthly "big ticket" items, but also allows you to keep track 
                        of your daily spending. You may not think much of going out for that $5 morning coffee and croissant at your local breakfast joint, 
                        but how much are you really spending? WalletWatch helps you to see how much of an impact small items, like coffee, or cigarettes, 
                        can have on your bank account.</p>
                </section>
                <section className="budget_description">
                    <h2>Set Your Budget</h2>
                    <p>Placeholder for add budget items</p>
                    <p>Start off by adding your net income, followed by your big monthly expenditures, such as rent, groceries, insurance, and gas.</p>
                </section>
                <section className="daily_impact">
                    <h2>Daily Impact</h2>
                    <p>Placeholder for daily items interface</p>
                    <p>Once your big items are set, start adding in single items (like coffe, or candy bars) that you find yourself spending on a daily basis. 
                        The app will then calculate what your projected monthly expenses will look like for each item, giving you a better idea of what that 
                        single Starbucks coffee is really costing you.</p>
                </section>
                <section className="flexibility">
                    <h2>Flexibility</h2>
                    <p>Placeholder for updating budget items</p>
                    <p>Budgets should be flexible, and WalletWatch knows this. At any time, feel free to make any necessary adjustments to your budget items, 
                        net income, and daily spending, keeping WalletWatch up to date with whats going on in your finances.</p>
                </section>
                <section className="signup">
                    <h2>Ready to start saving?</h2>
                    <form className="signup_form" onSubmit={(e) => this.handleSignupSubmit(e)}>
                        <section className="first_name_container">
                            <label className="firstName">First Name</label>
                            <input className='firstName' id="firstName" type="text" onChange={(e) => this.handleFirstNameChange(e.target.value)} defaultValue=""/>
                            <ValidationError hasError={!this.state.firstNameValid} message={this.state.validationMessages.firstName}/>
                        </section>
                        <section className="last_name_container">
                            <label className="lastName">Last Name</label>
                            <input className="lastName" id="lastName" type="text" onChange={(e) => this.handleLastNameChange(e.target.value)} defaultValue=""/>
                            <ValidationError hasError={!this.state.lastNameValid} message={this.state.validationMessages.lastName}/>
                        </section>
                        <section className="email_container">
                            <label className="email">Email</label>
                            <input className="email" id="email" type="text" onChange={(e) => this.handleEmailChange(e.target.value)} defaultValue=""/>
                            <ValidationError hasError={!this.state.emailValid} message={this.state.validationMessages.email}/>
                        </section>
                        <section className="Password_container">
                            <label className="pass">Password</label>
                            <input className="pass" id="pass" type="password" onChange={(e) => this.handlePasswordChange(e.target.value)} defaultValue=""/>
                            <ValidationError hasError={!this.state.passValid} message={this.state.validationMessages.pass} />
                        </section>
                        <section className="repeatPass">
                            <label className="rPass">Repeat Password</label>
                            <input className="rPass" id="rPass" type="password" onChange={(e) => this.handleRepeatPassChange(e.target.value)} defaultValue=""/>
                            <ValidationError hasError={!this.state.repeatPassValid} message={this.state.validationMessages.repeatPass} />
                        </section>
                        <button type="submit" disabled={!this.state.formValid}>Sign Up</button>
                    </form> 
                </section>
            </div>
        )
    }
}