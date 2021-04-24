import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import LoginForm from './LoginForm';
import { setCredentials } from '../generic/ajax/elements/ajax/Ajax';


class Login extends Component {

    render() {
        const { login } = this.props;
        if (login && login.isLoggedIn) {
            setCredentials(login.userDetails.token, login.userDetails.userId);
        }
        if (login && login.userDetails && login.userDetails.forceChangePassword) {
          return <Redirect to="forceChangePassword" />
        }
        else if (login && login.isLoggedIn) {
          return <Redirect to="home" />
        }
        else {
            setCredentials('', '');
            return (
                <div>
                    <LoginForm message={this.props.login.respMsg}/>
                </div>
            );
        }

    }
}

function mapStateToProps(state) {
    return { login: state.login };
}

export default connect(mapStateToProps)(Login);
