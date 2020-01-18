import React from 'react';
import ReactDOM from 'react-dom';
import 'typeface-roboto';
import App from './App';
import firebase from './components/Firebase';

firebase.init();
// @ts-ignore
ReactDOM.render(
    <App />,
    document.getElementById('root')
);
