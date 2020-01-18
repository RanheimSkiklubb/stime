import React from 'react';
import ReactDOM from 'react-dom';
//import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import firebase from './components/Firebase';

firebase.init();
// @ts-ignore
ReactDOM.render(
    <App />,
    document.getElementById('root')
);
