import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
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
import { AD_URL } from '../../util/Constants';
import { logIn, setLoading } from '../../actions';

class LoginForm extends Component {

    constructor(props) {
        super(props);
        this.state = { username: '', password: '', email: '' };
        this.onLoginSubmit = this.onLoginSubmit.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.navForForgetPwd = this.navForForgetPwd.bind(this);
    }
    onLoginSubmit(event) {
        this.setState({ "errorMsg": "" });
        event.preventDefault();
        if (!this.state.username) {
            this.setState({ "errorMsg": "Please Enter User Name !" });
            return false;
        }
        if (!this.state.username) {
            this.setState({ "errorMsg": "Please Enter User Name !" });
            return false;
        }
        if (!this.state.password) {
            this.setState({ "errorMsg": "Please Enter Password !" });
            return false;
        }

        this.props.setLoading({ isLoading: true });
        this.props.logIn(this.state);

    }


    componentDidMount() {
        var url = new URL(window.location.href);
        var email = url.searchParams.get("emailId");
        if (email !== null && email !== undefined && email !== "") {
            this.setState({ email: email });
            this.props.setLoading({ isLoading: true });
            this.props.logIn(this.state);
        }
    }

    onInputChange(event, attr) {
        var state = {};
        state[attr] = event.target.value;
        this.setState(state);
    }

    navForForgetPwd() {
        this.setState({ redirectToLogin: true });
    }





    render() {
        const getErrorMsg = () => {
            if (this.state.errorMsg || this.props.message) {
                return (
                    <div className="errorMsg_login">
                        {this.state.errorMsg || this.props.message}
                    </div>
                );
            }
        }
        return (
            <div>

                {this.state.email === '' ?
                    < form onSubmit={this.onLoginSubmit} className="login-form" >
                        {
                            this.state.redirectToLogin === true && <Redirect to="/forgetPassword" />
                        }



                        < Container className="mw-none" style={{ height: "100%" }
                        }>
                            <Row style={{ height: '100%', position: 'absolute', width: '100%' }}>
                                <Col lg="8" md="8" className="login-container p-0">
                                    <img src={`${process.env.PUBLIC_URL}/images/bg/cellcard_bg.png`} alt="6d Technologies" />

                                </Col>
                                <Col lg="4" md="4" className="login-backgrnd">
                                    <img src={`${process.env.PUBLIC_URL}/images/logo/6d-logo.png`} alt="6d Technologies" style={{ marginTop: '50px', height: '30px' }} />
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
                                        <div style={{ display: "table-cell", padding: '100px 0px 0px 0px' }}>
                                            <Card style={{ margin: 0, padding: 0 }}>
                                                <CardHeader>
                                                    <span className="loginTitle">
                                                        Welcome To <b>Commission System</b>
                                                    </span>
                                                </CardHeader>
                                                <CardBody>
                                                    {getErrorMsg()}
                                                    <InputGroup>
                                                        <Input onChange={(event) => this.onInputChange(event, "username")}
                                                            value={this.state.username}
                                                            name="username"
                                                            autoFocus />
                                                        <InputGroupAddon addonType="append"><i className="fa fa-user-o" style={{ width: '21px' }} ></i></InputGroupAddon>
                                                        <span className="floating-label">User Name</span>
                                                    </InputGroup>
                                                    <InputGroup>
                                                        <Input onChange={(event) => this.onInputChange(event, "password")}
                                                            value={this.state.password}
                                                            name="password"
                                                            type="password" />
                                                        <InputGroupAddon addonType="append"><i className="fa fa-key" style={{ width: '21px' }} ></i></InputGroupAddon>
                                                        <span className="floating-label">Password</span>
                                                    </InputGroup>
                                                    <div className="login-btn">
                                                        {this.props.isLoading ?
                                                            <Button disabled>
                                                                <i className="fa fa-spinner fa-spin"></i>
                                                            </Button>
                                                            : <Button type="submit" className="btn-signin" name="login">Login</Button>}
                                                    </div>
                                                    <div>
                                                        <div> <a href={AD_URL}> <span style={{ paddingLeft: "138px" }}>Login With AD</span></a></div>
                                                    </div>
                                                    <div>
                                                        <Row>
                                                            <Col></Col>
                                                            <Col className="forgot-password">
                                                                {/* <a href="" onClick={this.navForForgetPwd.bind(this)}> <span>Forgot password ?</span></a>  */}
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </div>
                                    </div>
                                </Col>

                            </Row>
                        </Container >
                    </form > : <div style={{ backgroundColor: "#B30027", color: "white", width: "100%", height: "100%", position: "absolute", textAlign: "center", paddingTop: "19%", fontSize: "39px" }}>Please Wait</div>
                }
            </div>
        );
    }
}

function mapStateToProps({ loader }) {
    return { isLoading: loader.isLoading };
}
export default connect(mapStateToProps, { logIn, setLoading })(LoginForm);
