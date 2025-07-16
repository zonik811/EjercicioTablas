import { css, unsafeCSS } from 'lit-element';
import * as foundations from '@bbva-web-components/bbva-foundations-styles';

export default css`
  :host {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px;
    font-family: Arial, sans-serif;
    min-height: 300px;
    box-sizing: border-box;
  }

  h3 {
    margin-bottom: 16px;
    font-size: 22px;
    color: #333;
  }

  img {
    border-radius: 12px;
    max-width: 250px;
    margin-bottom: 16px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  button:hover {
    background-color: #0056b3;
  }
`;