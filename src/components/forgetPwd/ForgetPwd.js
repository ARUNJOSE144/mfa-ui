import React, { Component } from 'react';
import { connect } from 'react-redux';
import AjaxUtil from '../generic/ajax/elements/ajax/util/AjaxUtil';
import { FORGET_PSWD_URL } from "../../util/Constants";
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    CardHeader,
    InputGroup,
    InputGroupAddon,
    Input,
    Button
} from 'reactstrap';
import { setLoading } from '../../actions';
import { Redirect } from 'react-router-dom';

var mobileConst = /^[0-9]*$/;

const ajaxUtil = new AjaxUtil({
    'responseCode': {
        'success': 200,
        'unAuth': 401,
        'resultSuccess': '0'
    },
    'messages': {
        'success': "Success Message",
        'failure': "Failure Message"
    },
    'authKey': 'Basic aW50ZXJmYWNlX3dlYl91c2VyOjk4OHNkc2RAdHU='
});

class ForgetPwd extends Component {

    constructor(props) {
        super(props);
        this.state = { username: '', emailId: '' };
        this.onLoginSubmit = this.onLoginSubmit.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.getRequest = this.getRequest.bind(this);
        this.navLogin = this.navLogin.bind(this);


    }
    navLogin() {
        this.setState({ redirectToLogin: true });
    }
    createCheck(response, hasError) {
        this.props.setLoading(false, false, this.props.timestamp);
        var respMsg = "";
        if (!hasError) {
            respMsg = response.responseMsg + ":: Password Sent Sucessfully !!";
            this.setState({ errorMsg: respMsg, hasError: false, redirectToLogin: true, message: respMsg });
            this.props.setLoginMessage(respMsg);
        }
        if (hasError) {
            respMsg = response.responseMsg;
            this.setState({ errorMsg: respMsg, hasError: true });
        }
    }

    onLoginSubmit(event) {
        this.setState({ "errorMsg": "" });
        event.preventDefault();
        if (!this.state.username) {
            this.setState({ "errorMsg": "Please Enter User Name !" });
            return false;
        }

        if (parseInt(this.state.username, 10)) {

            if (!mobileConst.test(this.state.username)) {
                this.setState({ "errorMsg": "Please Enter Valid Mobile Number !" });
                return false;
            }
        } else {

            if (!this.state.username) {
                this.setState({ "errorMsg": "Please Enter User Name !" });
                return false;
            }

        }

        /** Forget Pwd Request to BL **/
        this.props.setLoading(true, false, new Date().getTime());
        const request = this.getRequest();
        ajaxUtil.sendRequest(FORGET_PSWD_URL, request, this.createCheck.bind(this), null, { isShowSuccess: false });
    }

    getRequest() {
        var mobile = "";
        var userName = "";
        if (parseInt(this.state.username, 10)) {
            mobile = this.state.username;
        }
        else {
            userName = this.state.username;
        }

        return {
            "username": userName,
            "mobile": mobile
        };
    }


    onInputChange(event, attr) {
        var state = {};
        state[attr] = event.target.value;
        this.setState(state);
    }


    render() {
        const getErrorMsg = () => {
            if (this.state.errorMsg || this.props.message) {
                return (
                    <div className={this.state.hasError ? 'errorMsg_login' : 'success_login'}>
                        {this.state.errorMsg || this.props.message}
                    </div>
                );
            }
        }
        return (
            <form onSubmit={this.onLoginSubmit} className="login-form">
                {
                    this.state.redirectToLogin === true && <Redirect to="/login" push />
                }
                <Container className="mw-none" style={{ height: "100%" }}>
                    <Row style={{ height: '734px', position: 'absolute', width: '100%' }}>
                        <Col lg="8" md="8" className="login-container">

                        </Col>
                        <Col lg="4" md="4" className="forgotPwd">
                            <img src={`${process.env.PUBLIC_URL}/images/logo/mfa-logo.png`} alt="6d Technologies" style={{ marginTop: '50px', height: '30px' }} />
                           {/*  <div style={{ color: '#ffffff', position: 'absolute', bottom: '0px', padding: '10px 0px', fontWeight: 'lighter', fontSize: '12px' }}>
                                powered by - <b>6d Technologies</b>
                            </div> */}
                        </Col>

                    </Row>
                    <Row style={{ height: "100%", width: "100%" }}>
                        <Col lg="6">

                        </Col>
                        <Col lg="6">
                            <div style={{ display: "table", height: "100%" }}>
                                <div style={{ display: "table-cell", padding: '150px 0px 0px 0px' }}>
                                    <Card style={{ margin: 0, padding: 0 }}>
                                        <CardHeader>
                                            <span>
                                                <b>S&D - Forget Password</b>
                                            </span>
                                        </CardHeader>
                                        <CardBody>
                                            {getErrorMsg()}
                                            <InputGroup>
                                                <Input placeholder="UserName/Mobile" onChange={(event) => this.onInputChange(event, "username")}
                                                    value={this.state.username} maxLength="15"
                                                    autoFocus />
                                                <InputGroupAddon><i className="fa fa-user-o" style={{ width: '21px' }} ></i></InputGroupAddon>
                                            </InputGroup>

                                            <div className="login-btn">
                                                {this.props.isLoading ?
                                                    <Button disabled>
                                                        <i className="fa fa-spinner fa-spin"></i>
                                                    </Button>
                                                    : <Button type="submit" className="btn-signin" >Submit</Button>}
                                            </div>
                                            <div>
                                                <Row>
                                                    <Col></Col>
                                                    <Col className="forgot-password">
                                                        <a href="" onClick={this.navLogin.bind(this)}> <span>Login</span></a>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </div>
                            </div>
                        </Col>

                    </Row>
                </Container>
            </form>
        );
    }
}


function mapStateToProps({ loader }) {
    return { isLoading: loader.isLoading, timestamp: loader.timestamp };
}

const mapDispatchToProps = dispatch => {
    return {
        setLoading: (...obj) => dispatch(setLoading(...obj)),
        setLoginMessage: (msg) =>
            dispatch({
                type: "login",
                payload: { response: { data: { responseMsg: msg, isLoggedIn: false } } }
            })
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ForgetPwd);

