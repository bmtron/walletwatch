import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default function Error() {
    return (
        <section>
            <h2>You are not authorized to access this content.</h2>
            <Link to='/login'><button>Back to login</button></Link>
        </section>
    )
}