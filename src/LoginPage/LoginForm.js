import React, { Component } from 'react';
import TokenService from '../Services/TokenService';
import config from '../config';
import { Link } from 'react-router-dom'


export default class LoginForm extends Component {
    state = {error: null}

    handleSubmitJwtAuth = ev => {
        ev.preventDefault()
        const {user_name, user_pass } = ev.target

        const user = {
            user_name: user_name.value,
            password: user_pass.value
        }
        
        fetch(`${config.API_ENDPOINT}/login`, {
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
        .then(res => {
            window.sessionStorage.setItem('user', user_name.value)
            user_name.value = ''
            user_pass.value = ''
            TokenService.saveAuthToken(res.authToken)
            this.props.onLoginSuccess()
        })
        .catch(res => {
            this.setState({error: res.error})
        })
    }
    render() {

        return (
            <div className="Login_form">
                <nav>
                    <h2 className="login_h2">WalletWatch</h2>
                </nav>
                <h2 className="login_title">Log In To WalletWatch!</h2>
                <section className="login_container">
                    <form className="login_form" onSubmit={this.handleSubmitJwtAuth}>

                        <label htmlFor="user_name">User Name</label>
                        <input name="user_name" id="user_name" type="text" />

                        <label htmlFor="user_pass">Password</label>
                        <input name="user_pass" id="user_pass" type="password" />

                        <button className="login_submit" type="submit">Log In</button>
                        {this.state.error !== null ? <p className="error">{this.state.error}</p> : <p></p>}
                        <p className="register_p">Don't have an account? Click below to register!</p>
                        <Link to='/'><button className="register_link">Register Account</button></Link>
                    </form>
                </section>
            </div>
        )
    }
}