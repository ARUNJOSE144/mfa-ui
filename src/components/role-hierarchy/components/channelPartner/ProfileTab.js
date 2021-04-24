import React, { Component } from 'react';
import {
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane
} from 'reactstrap';
import classnames from 'classnames';

export default class ProfileTab extends Component {

    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            activeTab: '1'
        };
    }

    toggle(tab) {
        this.state.activeTab !== tab && this.setState({ activeTab: tab })
    }

    render() {
        return (
            <div className="form-tab">
                <Nav tabs>
                    {/* <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '1' })}
                            onClick={() => { this.toggle('1'); }}
                        >
                            Shipping details
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '2' })}
                            onClick={() => { this.toggle('2'); }}
                        >
                            Invoices
                        </NavLink>
                    </NavItem> */}
                    <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '3' })}
                            onClick={() => { this.toggle('3'); }}
                        >
                            Transaction History
                        </NavLink>
                    </NavItem>
                    {/* <NavItem>
                        <NavLink
                            className={classnames({ active: this.state.activeTab === '4' })}
                            onClick={() => { this.toggle('4'); }}
                        >
                            Visitors
                        </NavLink>
                    </NavItem> */}
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="1">

                    </TabPane>
                </TabContent>
            </div>
        );
    }

}