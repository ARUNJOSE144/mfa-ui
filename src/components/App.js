import { connect } from 'react-redux';
import EnsureLoggedInContainer from '../util/EnsureLoggedInContainer';
import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from './login/Login';
import Home from './home/Home';
import { setBaseURL } from './generic/ajax/elements/ajax/Ajax';

/* E:\Workspace\coms-ui\src\components\generic\ajax\elements\ajax\Ajax.js

 */

import { BASE_URL } from '../util/Constants';
import ForgetPwd from './forgetPwd/ForgetPwd';
import ChangePassword from './login/ChangePassword';
import "./styleSheet/in/style.css";

//css imports

import './generic/fields/styles/min/style.min.css';
import './generic/data-table/styles/min/style.min.css';
import './generic/buttons/styles/min/style.min.css';
/* import '@6d-ui/popup/build/styles/min/style.min.css' */
import './generic/popup/styles/min/style.min.css';
import './generic/ui-components/styles/min/style.min.css';
import './generic/form/styles/min/style.min.css';
import './styleSheet/common/form.css';
import './styleSheet/out/style.css';


class App extends Component {
  componentDidMount() {
    setBaseURL(BASE_URL);
  }
  render() {
    return (
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/forgetPassword" component={ForgetPwd} />
          <Route path="/forceChangePassword" component={ChangePassword} />
          <EnsureLoggedInContainer>
            <Switch>
              <Route path="/" component={Home} />
            </Switch>
          </EnsureLoggedInContainer>
        </Switch>
      </BrowserRouter>
    );
  }
}

function mapStateToProps(state) {
  return { login: state.login };
}

export default connect(mapStateToProps)(App);
