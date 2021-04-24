import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import React, { Component } from 'react';
import { setCredentials } from '../components/generic/ajax/elements/ajax/Ajax';
import { validateLogin } from '../actions';

class EnsureLoggedInContainer extends Component {
    constructor(props) {
        super(props);
        if (this.props.login && this.props.login.isLoggedIn) {
            setCredentials(this.props.login.userDetails.token, this.props.login.userDetails.userId);
        }
    }

    componentWillMount() {
        if (!this.props.login || !this.props.login.isLoggedIn){
            this.props.validateLogin();
        }
    }

    render() {
        const {login} = this.props;
        if(!login || !login.hasOwnProperty("isLoggedIn")){
            return (
              <div className="index_loaderMain">
                <div className="index_loaderSub">
                  <div className="sk-folding-cube">
                    <div className="sk-cube1 sk-cube"></div>
                    <div className="sk-cube2 sk-cube"></div>
                    <div className="sk-cube4 sk-cube"></div>
                    <div className="sk-cube3 sk-cube"></div>
                  </div>
                </div>
              </div>
            );
        }else if (login.isLoggedIn) {
            return this.props.children
        } else {
            return <Redirect to="/login" />;
        }
    }
}

// Grab a reference to the current URL. If this is a web app and you are
// using React Router, you can use `ownProps` to find the URL. Other
// platforms (Native) or routing libraries have similar ways to find
// the current position in the app.
function mapStateToProps(state, ownProps) {
    const { login } = state;
    return {
        login,
        isLoading: state.loader.isLoading
    }
}

export default connect(mapStateToProps, { validateLogin })(EnsureLoggedInContainer)
