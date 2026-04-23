import ReactDOM from 'react-dom';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
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
