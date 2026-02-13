import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { lightTheme, darkTheme } from './Styles/Theme';
import { GlobalStyles } from './Styles/GlobalStyles';
import Dashboard from './Components/Dashboard';

function App() {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <GlobalStyles />
      <Dashboard toggleTheme={toggleTheme} currentTheme={theme} />
      <ToastContainer position="bottom-right" theme={theme} />
    </ThemeProvider>
  );
}

export default App;
