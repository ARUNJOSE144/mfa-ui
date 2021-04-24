import React, {Component} from 'react';
import {Row, Col} from 'reactstrap';
import _ from 'lodash';

export default class FrequencyTab extends Component {
    render() {

        const getFrequency = (list, type) => {
            return list.map((cal, index) => {
                const freqList = type === 1
                    ? this.props.weekDaysList
                    : this.props.weekList;
                const freqClass = `route-frequency ${_.includes(freqList, cal.value)
                    ? 'route-frequency-selected'
                    : ""}`;
                return (
                    <Col key={index}>
                        <span
                            onClick={() => this.props.selectFrequency(type, cal.value)}
                            className={freqClass}>{cal.label}</span>
                    </Col>
                );
            })
        }
        return (
            <Row>
            <Col md={6} xs={12}>
                <Row
                    style={{
                    paddingBottom: "5px"
                }}>
                    <Col>
                        {this.props.fields.weekdays.label}
                    </Col>
                </Row>
                <Row className={this.props.frequncyWidth}>
                    {getFrequency(this.props.allWeekDays, 1)}
                </Row>
            </Col>
            <Col md={6} xs={12}>
                <Row
                    style={{
                    paddingBottom: "5px"
                }}>
                    <Col>
                    {this.props.fields.weeks.label}
                    </Col>
                </Row>
                <Row className={this.props.frequncyWidth}>
                    {getFrequency(this.props.allWeeks, 2)}
                </Row>
            </Col>
        </Row>
        );
    }
}