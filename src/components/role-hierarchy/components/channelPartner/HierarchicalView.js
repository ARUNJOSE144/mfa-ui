import React, { Component } from 'react';
import {
    Container, Row, Col
} from 'reactstrap';
import { withRouter } from 'react-router-dom';
import EntityList from './parts/EntityList';
// import PerformanceCard from '../dashboard/PerformanceCard';
// import TableCard from '../dashboard/sub/TableCard';
// import DropDownIconMenu from '../common/DropDownIconMenu';
import { connect } from 'react-redux';

class HierarchicalView extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        // this.fetchChildEmployees(this.props.login.userDetails.userId);
        // this.fetchChildEntities(this.props.login.userDetails.userId);
        this.handleEmployeeClick({ id: this.props.login.userDetails.userId });
    }

    fetchChildEmployees = userId => {
        this.props.ajaxUtil.sendRequest(`${this.props.url_User.GET_CHILD_USERS}${userId}`, {}, (response, hasError) => {
            const employees = [];
            if (!hasError) {
                response && response.forEach(user => {
                    employees.push({
                        id: user.userId,
                        name: `${user.firstName} ${user.lastName}`,
                        data: user
                    });
                })
            }
            this.setState({ employees })
        }, this.props.loadingFunction, { method: 'GET', isShowSuccess: false });
    }

    fetchChildEntities = userId => {
        const request = {
            filters: [{
                name: "userId",
                value: userId
            }]
        }
        this.props.ajaxUtil.sendRequest(this.props.url_ChannelPartners.SEARCH_URL, request, (response, hasError) => {
            const entities = [];
            if (!hasError) {
                const { channelPartnerEnitities } = response;
                channelPartnerEnitities && channelPartnerEnitities.forEach(entity => {
                    entities.push({
                        id: entity.id,
                        name: entity.name,
                        data: entity
                    });
                });
                this.setState({selectedEntity: entities[0] && entities[0].id})
            }
            this.setState({ entities })
        }, this.props.loadingFunction, { method: 'POST', isShowSuccess: false });
    }

    handleEmployeeClick = clickedNode => {
        this.fetchChildEmployees(clickedNode.id);
        this.fetchChildEntities(clickedNode.id)
    }

    handleEntityClick = clickedObject => {
        this.setState({ selectedEntity: clickedObject.id });
    }

    redirectToView = ({ id: entityId }) => {
        this.props.history.push(`/channelPartners/view/${entityId}`)
    }

    // EntityMainNodeComp = ({ entity, index, isSelected, handleNodeClick }) => {
    //     return (
    //         <div onClick={handleNodeClick} className="c-pointer">
    //             <div>
    //                 <span className={`${isSelected ? 'text-primary' : ''}`}>{entity.name}</span>
    //             </div>
    //             <div>
    //                 <span className="fs-10" style={{ lineHeight: 1 }}>
    //                     Dealer
    //                 </span>
    //             </div>
    //         </div>
    //     )
    // }


    // EntityChildNodeComp = ({ item, handleNodeClick }) => {
    //     return (
    //         <div>
    //             <span className="float-right c-pointer">
    //                 <DropDownIconMenu
    //                     menus={[
    //                         { label: 'Add', handleClick: () => alert() },
    //                         { label: 'Edit', handleClick: () => alert() }
    //                     ]} />
    //             </span>
    //             <span onClick={handleNodeClick} className='c-pointer w-100 d-block'>
    //                 {item.name}
    //             </span>
    //         </div>
    //     )
    // }

    // EntityTitleComp = ({ title }) => {
    //     return (
    //         <div className="text-primary" style={{ flexGrow: 1 }}>
    //             <span className="float-right c-pointer pr-2" style={{ fontSize: '18px' }}>
    //                 <i className="fa fa-plus-square-o" />
    //             </span>
    //             <span className="pl-2 d-block pt-1">{title}</span>
    //         </div>
    //     )
    // }

    render() {
        const { userDetails = {} } = this.props.login;
        const { entities = [], selectedEntity } = this.state;
        return (
            <Container className="pt-3">
                <Row>
                    <Col lg="3" className="pr-0">
                        <EntityList
                            title="Employees"
                            firstNode={{ id: userDetails.userId, name: userDetails.fullName }}
                            childList={this.state.employees}
                            onNodeSelect={this.handleEmployeeClick}
                        />
                    </Col>
                    <Col lg="3" className="pr-0">
                        {
                            /* <EntityList
                                    title="Entities"
                                    mainNodeComponent={this.EntityMainNodeComp}
                                    childNodeComp={this.EntityChildNodeComp}
                                    childTitleComp={this.EntityTitleComp}
                                /> */
                        }
                        <div className="border-custom bg-white">
                            <div className="px-2 py-2 border border-left-0 border-right-0 border-top-0">
                                <span className="text-primary">
                                    Entities
                                </span>
                            </div>
                            <div className="list-view scrollbar" style={{ height: '510px', overflow: 'auto' }}>
                                <ul className="border border-top-0 border-left-0 border-right-0">
                                    {
                                        entities.map(
                                            obj => <li
                                                        key={obj.id}
                                                        onClick={() => this.handleEntityClick(obj)}
                                                        className={selectedEntity === obj.id ? 'text-white' : ''}
                                                    >
                                                <div className={`c-pointer${selectedEntity === obj.id ? ' bg-primary' : ''}`}>
                                                    <table className="w-100">
                                                        <tbody>
                                                            <tr>
                                                                <td>
                                                                    <div>
                                                                        <span>{obj.name}</span>
                                                                    </div>
                                                                    <div>
                                                                        <span className="fs-10" style={{ lineHeight: 1 }}>
                                                                            {obj.data.channelType}
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    {/* {
                                                                        selectedEntity === obj.id && <span className="float-right c-pointer">
                                                                            <DropDownIconMenu
                                                                                menus={[
                                                                                    // { label: 'Add', handleClick: () => alert() },
                                                                                    { label: 'View', handleClick: () => this.redirectToView(obj) }
                                                                                ]}
                                                                                color="secondary"
                                                                            />
                                                                        </span>
                                                                    } */}
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </li>
                                        )
                                    }
                                </ul>
                            </div>
                        </div>
                    </Col>
                    <Col lg="6">
                        <div className="p-2 border-custom bg-white" style={{ minHeight: '540px' }}>
                            {/* <PerformanceCard />
                            
                            <TableCard
                                title="Top Performing POS"
                                data={[
                                    { title: 'Mobile Queen', subtitle: 'Edward King, 048-617-3766', value: '34,000' },
                                    { title: 'Mobile POS', subtitle: 'Edward King, 065-617-3766', value: '30,000' },
                                    { title: 'Mobile King', subtitle: 'Edward King, 056-617-3766', value: '24,300' },
                                    { title: 'Southern Mobiles', subtitle: 'Edward King, 054-617-3766', value: '24,000' },
                                    { title: 'Mobile Shop', subtitle: 'Edward King, 034-617-3766', value: '20,000' }
                                ]}
                            /> */}
                            
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }
}

function mapStateToProps({ login }) {
    return { login };
}

export default withRouter(connect(mapStateToProps)(HierarchicalView));
