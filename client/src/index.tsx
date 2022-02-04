import React from 'react';
import ReactDOM from 'react-dom';
import 'typeface-roboto';
import { ThemeProvider, Theme } from "@mui/material/styles";
import App from './App';
import theme from "./styles/theme";


declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}


ReactDOM.render(
    //<StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>,
    //</StyledEngineProvider>,
 document.getElementById('root'));
