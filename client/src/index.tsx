import React from 'react';
import ReactDOM from 'react-dom';
import 'typeface-roboto';
import { createMuiTheme, MuiThemeProvider} from "@material-ui/core/styles";
import App from './App';

const theme = createMuiTheme({
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
    },
  });

ReactDOM.render(
    <MuiThemeProvider theme = { theme }>
        <App />
    </MuiThemeProvider>, 
 document.getElementById('root'));
