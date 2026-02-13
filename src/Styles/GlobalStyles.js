import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  body {
    background: linear-gradient(135deg, #1f2937, #111827, #4c1d95, #1e3a8a);
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;
    color: ${({ theme }) => theme.text};
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    transition: all 0.25s linear;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    min-height: 100vh;
  }

  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  * {
    box-sizing: border-box;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
  
  ul {
    list-style: none;
    padding: 0;
  }

  button {
    cursor: pointer;
    font-family: inherit;
  }
`;
