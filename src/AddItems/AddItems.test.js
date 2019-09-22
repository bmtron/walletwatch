import React from 'react';
import ReactDOM from 'react-dom';
import AddItems from './AddItems';
import {BrowserRouter} from 'react-router-dom';

it('renders without crashing', () => {
    const div = document.createElement('div');

    ReactDOM.render(<BrowserRouter><AddItems/></BrowserRouter>, div);

    ReactDOM.unmountComponentAtNode(div);
});