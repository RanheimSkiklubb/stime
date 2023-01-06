import ReactDOM from 'react-dom';
import 'typeface-roboto';
import {Theme, ThemeProvider} from "@mui/material/styles";
import App from './App';
import theme from "./styles/theme";


declare module '@mui/styles/defaultTheme' {
  interface DefaultTheme extends Theme {}
}

ReactDOM.render(
    <ThemeProvider theme={theme}>
        <App />
    </ThemeProvider>,
 document.getElementById('root'));
