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
import { CHANGE_PSWD_URL } from '../../util/Constants';
import AjaxUtil from '../generic/ajax/elements/ajax/util/AjaxUtil';
import { logIn } from '../../actions';
import md5 from 'md5';

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

class ChangePassword extends Component {

    constructor(props) {
        super(props);
        this.state = { oldPassword: '', newPassword: '', confirmPassword : '' };
        this.onLoginSubmit = this.onLoginSubmit.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
    }
    onLoginSubmit(event) {
        this.setState({"errorMsg" : "", isLoading : true});
        event.preventDefault();
        if (!this.state.oldPassword) {
          this.setState({"errorMsg" : "Please Enter Old Password !", isLoading : false});
          return false;
        }
        if (!this.state.newPassword) {
          this.setState({"errorMsg" : "Please Enter New Password !", isLoading : false});
          return false;
        }
        if (this.state.confirmPassword !== this.state.newPassword) {
          this.setState({"errorMsg" : "New Password And Confirm Password Are Not Same !", isLoading : false});
          return false;
        }
        const request = {
          "oldPwd" : md5(this.state.oldPassword),
          "newPwd" : md5(this.state.newPassword)
        }
      ajaxUtil.sendRequest(CHANGE_PSWD_URL, request, this.checkChangePassword.bind(this), null, { isShowSuccess: false, isShowFailure: false });
    }
    checkChangePassword(response, hasError) {
      if (hasError) {
        const respMsg = response.responseMsg || "Please Try Again";
        this.setState({errorMsg:respMsg, isLoading:false, oldPassword:'', newPassword:'',confirmPassword:''});
      } else {
        this.setState({mode:1});
      }
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
            <div className="errorMsg_login">
              {this.state.errorMsg || this.props.message}
            </div>
          );
        }
      }
      if (!this.props.login || !this.props.login.isLoggedIn || !this.props.login.userDetails) {
        return <Redirect to="/login" />

      } else if (this.state.mode === 1) {
        return <Redirect to="/home" />

      } else {
        return (
          <form onSubmit={this.onLoginSubmit} className="login-form">
          <input type="email" name="email" style={{display : 'none'}} />
          <input type="password" name="password" style={{display : 'none'}} />
            <Container className="mw-none" style={{ height: "100%" }}>
            <Row style={{ height: '100%', position: 'absolute', width: '100%' }}>
              <Col lg="8" md="8" className="login-container">

              </Col>
                <Col lg="4" md="4" style={{ background: "#0185E1" }}>
                  <img src={`${process.env.PUBLIC_URL}/images/logo@2x.svg`} alt="6d Technologies" style={{ marginTop: '50px',height : '30px' }} />
                  <div style={{color: '#ffffff', position:'absolute',bottom:'0px', padding: '10px 0px',fontWeight: 'lighter',fontSize: '12px'}}>
                    powered by - <b>6d Technologies</b>
                  </div>
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
                        <span>
                        Change Password
                        </span>
                      </CardHeader>
                      <CardBody>
                        {getErrorMsg()}
                        <InputGroup>
                          <Input onChange={(event) => this.onInputChange(event, "oldPassword")}
                          value={this.state.oldPassword}
                          type="password"
                          autoFocus />
                          <InputGroupAddon><i className="fa fa-key" style={{ width: '21px' }} ></i></InputGroupAddon>
                          <span className="floating-label">Old Password</span>
                        </InputGroup>
                        <InputGroup>
                          <Input onChange={(event) => this.onInputChange(event, "newPassword")}
                          value={this.state.newPassword}
                          type="password"/>
                          <InputGroupAddon><i className="fa fa-key" style={{ width: '21px' }} ></i></InputGroupAddon>
                          <span className="floating-label">New Password</span>
                        </InputGroup>
                        <InputGroup>
                          <Input onChange={(event) => this.onInputChange(event, "confirmPassword")}
                          value={this.state.confirmPassword}
                          type="password"/>
                          <InputGroupAddon><i className="fa fa-key" style={{ width: '21px' }} ></i></InputGroupAddon>
                          <span className="floating-label">Confirm Password</span>
                        </InputGroup>
                        <div className="login-btn">
                        {this.state.isLoading ?
                          <Button disabled>
                          <i className="fa fa-spinner fa-spin"></i>
                          </Button>
                          :<Button type="submit" className="btn-signin" >Submit</Button>}
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
}
function mapStateToProps(state) {
    return { login: state.login };
}
export default connect(mapStateToProps, { logIn })(ChangePassword);
