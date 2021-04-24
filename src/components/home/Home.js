import React, { Component } from "react";
import { Container, Breadcrumb, BreadcrumbItem, Row, Col } from "reactstrap";
/* import { SideMenu, Header, Notification, Alert, Loader } from '@6d-ui/ui-components'; */
import SideMenu from '../generic/ui-components/components/sideMenu/SideMenu';
import Header from '../generic/ui-components/components/header/Header';
import Loader from '../generic/ui-components/elements/loader/Loader';
import Notification from '../generic/ui-components/components/notification/Notification';
import Alert from '../generic/ui-components/elements/alert/Alert';

import { withRouter } from 'react-router'
import { MENU_DETAILS } from "../../util/Privilages";
import { connect } from "react-redux";
import { Routes } from './sub/Routes'
import { setModalPopup, logOut } from '../../actions'
import { store } from '../../index';


export class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSideNavShown: true,
            isLoggedIn: false,
            mode: "0",
            MENU_DETAILS,
            HEADER_BUTTONS: [
                {
                    id: 1,
                    type: 1,
                    icon: 'fa-bell-o'
                },
                {
                    id: 2,
                    type: 2,
                    icon: 'fa-user-circle-o',
                    subIcon: 'fa-user-o',
                    subHeader: this.props.login.userDetails.fullName,
                    subItems: [
                        {
                            id: 22,
                            name: 'Change Password',
                            icon: 'fa-key'
                        },
                        {
                            id: 23,
                            name: 'Sign Out',
                            icon: 'fa-sign-out'
                        }
                    ]
                }
            ]
        };
        this.toggleSideNav = this.toggleSideNav.bind(this);
        this.route = this.route.bind(this);
    }
    toggleSideNav() {
        this.setState({ isSideNavShown: !this.state.isSideNavShown });
    }
    route(id, link) {
        console.log(id, link);
        if (this.props.location.pathname !== link)
            this.props.history.push(link);
    }
    onHeaderItemClick(menuId, SubMenuId) {
        console.log(menuId, SubMenuId);
        if (menuId === 2 && SubMenuId === 22) {
            this.route(menuId, '/changePswd');
        }
        if (menuId === 2 && SubMenuId === 23) {
            store.dispatch(logOut());
        }
    }

    setHeaderOnClick(menu) {
        this.props.header.name = menu.label;
    }


    render() {
        const getBreadCrumb = () => {
            if (this.props.breadcrumb && this.props.breadCrumb.length > 0) {
                return (
                    <Container className="main_breadCrumb_container">
                        <Row>
                            <Col>
                                <Breadcrumb
                                    className="main_breadCrumb">
                                    <BreadcrumbItem>
                                        <i className="fa fa-home" />
                                    </BreadcrumbItem>
                                    <BreadcrumbItem active>Dash Board</BreadcrumbItem>
                                </Breadcrumb>
                            </Col>
                        </Row>
                    </Container>
                );
            }
        };
        const sideNavStyle = {
            marginLeft: this.state.isSideNavShown ? 0 : '-215px'
        };
        return (
            <div>
                <div className="home-main-div">
                    <div className="side-nav-menu" style={sideNavStyle}>
                        <SideMenu
                            currentPath={this.props.location.pathname}
                            privilages={this.props.login.userDetails.privilages}
                            route={this.route}
                            menus={this.state.MENU_DETAILS}
                            logo={`${process.env.PUBLIC_URL}/images/logo/6d-logo.png`}
                            setHeaderOnClick={this.setHeaderOnClick.bind(this)}
                        />
                    </div>

                    <div className="main-content-div">
                        <Header
                            onHeaderItemClick={this.onHeaderItemClick.bind(this)}
                            items={this.state.HEADER_BUTTONS}
                            header={this.props.header}
                            toggleSideNav={this.toggleSideNav}


                        />
                        <main style={{ minHeight: window.innerHeight - 70 }}>
                            {getBreadCrumb()}
                            <div className="main-container">
                                {/*Routes Comes HERE*/}
                                <Routes
                                    userid={this.props.login.userDetails.userId}
                                    loggedInUser={this.props.login.userDetails}
                                    privilages={this.props.login.userDetails.privilages}
                                    designationId={this.props.login.userDetails.designationId}
                                    userChannelType={this.props.login.userDetails.channelType}
                                    userEntityType={this.props.login.userDetails.entityId}
                                    typeOfUser={this.props.login.userDetails.typeOfUser}
                                />
                                <Loader
                                    {...this.props.loader}
                                />
                            </div>
                            <Notification
                                toast={this.props.toast}
                            />
                            <Alert
                                setModalPopup={this.props.setModalPopup}
                                modal={this.props.modal}
                            />
                        </main>
                    </div>
                </div>
            </div>
        );
    }
}
function mapStateToProps(state) {
    return {
        login: state.login,
        header: state.header,
        breadcrumb: state.breadcrumb,
        toast: state.toast,
        modal: state.modal,
        loader: state.loader
    };
}
export default withRouter(connect(mapStateToProps, { setModalPopup })(Home));
