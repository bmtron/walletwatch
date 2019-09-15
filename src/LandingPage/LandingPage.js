import React, { Component } from 'react';
import LandingPageForm from './LandingPageForm';

export default class LandingPage extends Component {
    static defaultProps = {
        history: {
            push: () => {}
        }
    }

    handleRegistrationSuccess = () => {
        const {history} = this.props
        this.props.history.push('/budget')
    }
    render() {
        return (
            <div>
                <LandingPageForm onRegistrationSuccess={this.handleRegistrationSuccess} />
            </div> 
        )
    }
}