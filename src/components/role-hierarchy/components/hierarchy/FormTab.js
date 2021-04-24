import React, { Component } from 'react';
import {
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane
} from 'reactstrap';
import classnames from 'classnames';
import FormCollapse from './FormCollapse';
import { FIELDS } from '../util/ChannelTypeFields'
import TreeView from './treeComponent/Tree';

export default class FormTab extends Component {

    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.renderNavLink = this.renderNavLink.bind(this);
        this.renderTabContent = this.renderTabContent.bind(this);
        let activeTab = '1';
        const {node, action} = this.props;
        switch (action) {
            case 'view':
                if(!node || node.type !== this.props.const_SalesHierarchy.OP_NODE_TYPE)
                    activeTab = '1';
                else
                    activeTab = '2';
                break;

            default:
                activeTab = '1';
                break;
        }

        this.state = {
            activeTab
        };
    }

    componentDidMount() {
        if (this.props.getComponentTreeRef)
            this.props.getComponentTreeRef(this.refs.refTreeComponent);
    }

    toggle(tab) {
        this.state.activeTab !== tab && this.setState({ activeTab: tab })
    }

    renderNavLink() {
        const { node, action } = this.props;
        if (action === 'view') {
            return (
                <Nav tabs>
                    <NavItem>
                        {
                            (!node || node.type !== this.props.const_SalesHierarchy.OP_NODE_TYPE) && node.type !== this.props.const_SalesHierarchy.BU_NODE_TYPE ? <NavLink
                                className={classnames({ active: this.state.activeTab === '1' })}
                                onClick={() => { this.toggle('1'); }}>
                                Attributes
                            </NavLink> : null
                        }
                    </NavItem>
                    <NavItem>
                        {
                            !node || node.type !== this.props.const_SalesHierarchy.BU_NODE_TYPE ? <NavLink
                                className={classnames({ active: this.state.activeTab === '2' })}
                                onClick={() => { this.toggle('2'); }}>
                                Organisation Hierarchy
                            </NavLink> : null
                        }
                    </NavItem>
                </Nav>
            )
        } else {
            return (
                <Nav tabs>
                    <NavItem>
                        {
                            !node || node.type !== this.props.const_SalesHierarchy.OP_NODE_TYPE ? <NavLink
                                className={classnames({ active: this.state.activeTab === '1' })}
                                onClick={() => { this.toggle('1'); }}>
                                Attributes
                    </NavLink> : null
                        }
                    </NavItem>
                    <NavItem>
                        {
                            !node || node.type !== this.props.const_SalesHierarchy.OP_NODE_TYPE ? <NavLink
                                className={classnames({ active: this.state.activeTab === '2' })}
                                onClick={() => { this.toggle('2'); }}>
                                Organisation Hierarchy
                    </NavLink> : null
                        }
                    </NavItem>
                </Nav>
            )
        }

    }

    renderTabContent() {
        const { node, action } = this.props;
        if (action === 'view') {
            return(
            <TabContent activeTab={this.state.activeTab}>
                {
                    (!node || node.type !== this.props.const_SalesHierarchy.OP_NODE_TYPE) && node.type !== this.props.const_SalesHierarchy.BU_NODE_TYPE ? <TabPane tabId="1">
                        {
                            FIELDS.map((field, index) => {
                                return <FormCollapse collapse={index === 0} {...this.props} className="form-tab-pane" {...field} key={field.groupId} />
                            })
                        }
                    </TabPane> : null
                }
                {
                    !node || node.type !== this.props.const_SalesHierarchy.BU_NODE_TYPE ? <TabPane tabId="2">
                        <div className="bg-white mt-3">
                            <div className="form-card">
                                {/* <TreeView /> */}
                                <this.props.treeComponent ref="refTreeComponent" treedata={this.props.treedata} entityRoles={this.props.entityRoles} />
                            </div>
                        </div>
                    </TabPane> : null
                }
            </TabContent>
            )
        } else {
            return(<TabContent activeTab={this.state.activeTab}>
                {
                    !node || node.type !== this.props.const_SalesHierarchy.OP_NODE_TYPE ? <TabPane tabId="1">
                        {
                            FIELDS.map((field, index) => {
                                return <FormCollapse collapse={index === 0} {...this.props} className="form-tab-pane" {...field} key={field.groupId} />
                            })
                        }
                    </TabPane> : null
                }
                {
                    !node || node.type !== this.props.const_SalesHierarchy.OP_NODE_TYPE ? <TabPane tabId="2">
                        <div className="bg-white mt-3">
                            <div className="form-card">
                                {/* <TreeView /> */}
                                <this.props.treeComponent ref="refTreeComponent" treedata={this.props.treedata} entityRoles={this.props.entityRoles} />
                            </div>
                        </div>
                    </TabPane> : null
                }
            </TabContent>)
        }
    }

    render() {
        return (
            <div className="form-tab">

                {this.renderNavLink()}
                {this.renderTabContent()}

            </div>
        );
    }

}