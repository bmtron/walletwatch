import React from 'react';
import ReactDOM from 'react-dom';
import ErrorPage from './ErrorPage';
import {BrowserRouter} from 'react-router-dom';

it('renders without crashing', () => {
    const div = document.createElement('div');

    ReactDOM.render(<BrowserRouter><ErrorPage/></BrowserRouter>, div);

    ReactDOM.unmountComponentAtNode(div);
});