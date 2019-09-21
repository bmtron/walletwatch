import React, { Component } from 'react';
import TokenService from '../Services/TokenService';
import config from '../config';
import { Link } from 'react-router-dom'
import './Login.css';


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
                <section className="login_page_wrap">

                    <section className="login_form_container">
                        <section className="login_form_title">
                            <p>Log in to WalletWatch</p>
                        </section>
                        <form className="login_form" onSubmit={this.handleSubmitJwtAuth}>
                            <section className="user_name_container">
                                <label htmlFor="user_name" className="username_label_login">Username</label>
                                <input className="login_username_input" name="user_name" id="user_name" type="text" />
                            </section>
                            <section className="login_pass_container">
                                <label htmlFor="user_pass" className="pass_label_login">Password</label>
                                <input className="login_pass_input" name="user_pass" id="user_pass" type="password" />
                            </section>
                            {this.state.error !== null ? <p className="error">{this.state.error}</p> : null}
                            <section className="register_container">
                                <Link to='/' className="register_link">Register Account</Link>
                            </section>
                            <section className="login_button_container">
                                <button className="login_submit" type="submit">Log In</button>
                            </section>
                        </form>
                    </section>
                </section>
            </div>
        )
    }
}