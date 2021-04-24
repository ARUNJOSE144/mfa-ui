import React, { Component } from 'react';
import {
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
    Col,
    Row,
    Container,
    Table
} from 'reactstrap';
import classnames from 'classnames';
import SurveyForm from './SurveyForm';
import { FieldItem } from '@6d-ui/fields';
export default class Visitors extends Component {
    constructor(props) {
        super(props);
        const survay = this.props.visitData ? this.props.visitData.surveylist : null;
        const stock = this.props.visitData ? this.props.visitData.products : null;
        const survayData = [];

        if (survay) {
            survay.forEach((surv) => {
                const sData = JSON.parse(surv.surveyData);
                if (sData.pages) {
                    sData.pages.forEach((page) => {
                        page.elements.forEach((ele) => {
                            survayData.push({ "title": ele.title, "answer": ele.answer });
                        });
                    });
                }
            });
        }

        this.state = {
            activeTab: '1',
            survayData,
            stock
        };
        this.toggle = this.toggle.bind(this);
    }
    toggle(tab) {
        this.state.activeTab !== tab && this.setState({ activeTab: tab })
    }
    render() {
        const getStockList = () => {
            if (this.state.stock) {
                return this.state.stock.map((stock) => {
                    return (
                        <Row>
                            <Col lg="3">
                                <div className="fs-16 p-4">
                                    {stock.productName}
                                </div>
                            </Col>
                            <Col lg="9">
                                <div className="fs-16 fw-600 p-4">
                                    {stock.balance}
                                </div>
                            </Col>
                        </Row>
                    );
                });
            } else {
                return (
                    <div className="text-center p-4">
                        Not Found !
            </div>
                );
            }
        }
        if (this.props.visitData) {
            return (
                <div className="p-3">
                    <div className="d-flex flex-row mb-3">
                        <div style={{ width: '70px', height: '70px', background: '#e1e1e1' }} className="profile-img">

                        </div>
                        <div className="py-1">
                            <Table className="h-100" style={{ lineHeight: 1 }}>
                                <tbody>
                                    <tr>
                                        <td className="py-0 border-0 fs-12">Name</td>
                                        <th className="py-0 border-0 fs-14">{this.props.visitData.userName}</th>
                                    </tr>
                                    <tr>
                                        <td className="py-0 border-0 align-middle fs-12">Designation</td>
                                        <th className="py-0 border-0 align-middle fs-14">{this.props.visitData.designation}</th>
                                    </tr>
                                    <tr>
                                        <td className="py-0 border-0 align-bottom fs-12">Time Visited</td>
                                        <th className="py-0 border-0 align-bottom fs-14">{this.props.visitData.checkinDate}</th>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                    </div>
                    <div className="form-tab">
                        <Nav tabs>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: this.state.activeTab === '1' })}
                                    onClick={() => { this.toggle('1'); }}
                                >
                                    Survey Form
                          </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: this.state.activeTab === '2' })}
                                    onClick={() => { this.toggle('2'); }}
                                >
                                    Stock Info
                          </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={classnames({ active: this.state.activeTab === '3' })}
                                    onClick={() => { this.toggle('3'); }}
                                >
                                    Feedback
                          </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="1">
                                <SurveyForm survayData={this.state.survayData} />
                            </TabPane>
                            <TabPane tabId="2">
                                {getStockList()}
                            </TabPane>
                            <TabPane tabId="3">
                                <Container className="mt-3 bg-white border rounded">
                                    <Row className="py-3">
                                        <FieldItem
                                            type="11"
                                            width="xs"
                                            value={this.props.visitData.feedback}
                                        />
                                    </Row>
                                </Container>
                            </TabPane>
                        </TabContent>
                    </div>
                </div>
            );

        } else {
            return (
                <div className="text-center p-4">
                    Not Found !
            </div>
            );
        }
    }
}
