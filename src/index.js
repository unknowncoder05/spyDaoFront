import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Web3ReactProvider } from "@web3-react/core";
import { HashRouter } from "react-router-dom";
import { getLibrary } from "./config/web3";


ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
     <Web3ReactProvider getLibrary={getLibrary}>
        <App />
      </Web3ReactProvider>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root'),
);