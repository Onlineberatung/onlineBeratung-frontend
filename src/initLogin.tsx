import './polyfill';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Login } from './components/login/Login';

ReactDOM.render(<Login />, document.getElementById('loginRoot'));
