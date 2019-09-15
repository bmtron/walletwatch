import React, {Component} from 'react';

export default class LogoutButton extends Component {
    
    render() {
        return (
            <p className="logout_button" onClick={() => this.props.handleLogout()}>Logout</p>
        )
    }
}