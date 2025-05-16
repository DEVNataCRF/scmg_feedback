import { createGlobalStyle } from 'styled-components';
export const GlobalStyles = createGlobalStyle `
  :root {
    --primary: #004A8D;
    --secondary: #0066CC;
    --success: #28a745;
    --danger: #dc3545;
    --warning: #ffc107;
    --light: #f8f9fa;
    --dark: #343a40;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Roboto', sans-serif;
    background-color: var(--light);
    color: var(--dark);
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
    font-family: inherit;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  @media (max-width: 768px) {
    html {
      font-size: 14px;
    }
  }
`;
