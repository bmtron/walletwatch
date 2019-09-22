import React from 'react';
import ReactDOM from 'react-dom';
import LandingPageForm from './LandingPageForm';
import {BrowserRouter} from 'react-router-dom';

it('renders without crashing', () => {
    const div = document.createElement('div');

    ReactDOM.render(<BrowserRouter><LandingPageForm/></BrowserRouter>, div);

    ReactDOM.unmountComponentAtNode(div);
});