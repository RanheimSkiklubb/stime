import React from 'react';
import ReactDOM from 'react-dom';
import 'typeface-roboto';
import { ThemeProvider } from "@material-ui/core/styles";
import App from './App';
import Firebase from './components/Firebase';
import theme from "./styles/theme";

Firebase.init();


ReactDOM.render(
    <ThemeProvider theme={theme}>
        <App />
    </ThemeProvider>,
 document.getElementById('root'));
