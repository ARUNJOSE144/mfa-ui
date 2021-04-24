import React, { Component } from 'react';
import { ModalBody, Row, Col, ModalFooter, Button } from 'reactstrap';
import { FieldItem, FIELD_TYPES } from '@6d-ui/fields';
import _ from 'lodash';

export default class SearchFilter extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.getChannelTypes();
    }

    getChannelTypes(opts) {
        this.props.ajaxUtil.sendRequest(this.props.url_SalesHierarchy_ListUrl, {}, (response, hasError) => {
            const { channelTypeNodes } = response;
            const channelTypeOptions = [];
            if (channelTypeNodes.type === this.props.url_SalesHierarchy_OpNodeType) {
                channelTypeOptions.push(this.getOptionsForSelect(channelTypeNodes));
                channelTypeOptions.push(
                    ...(channelTypeNodes.children ? channelTypeNodes.children.map(
                        child => {
                            const salesEntites = [];
                            child.children && child.children.map(subChild => salesEntites.push(...this.treeToArray(subChild)));
                            const tempChild = { ...this.getOptionsForSelect(child) }
                            tempChild.children = salesEntites.map(salesEntity => this.getOptionsForSelect(salesEntity));
                            return tempChild;
                        }
                    ) : [])
                );
            } else if (channelTypeNodes.type === this.props.url_SalesHierarchy_BuNodeType) {
                channelTypeOptions.push(
                    ...(channelTypeNodes.children ? channelTypeNodes.children.map(
                        child => {
                            const salesEntites = [];
                            child.children && child.children.map(subChild => salesEntites.push(...this.treeToArray(subChild)));
                            const tempChild = { ...this.getOptionsForSelect(child) }
                            tempChild.children = salesEntites.map(salesEntity => this.getOptionsForSelect(salesEntity));
                            return tempChild;
                        }
                    ) : [])
                );
            } else {
                const tempArray = this.treeToArray(channelTypeNodes);
                channelTypeOptions.push(...tempArray.map(obj => this.getOptionsForSelect(obj)));
            }
            this.setState({ channelTypeOptions })

        }, this.props.loadingFunction, { method: 'GET', isShowSuccess: false, isProceedOnError: false });
    }

    getOptionsForSelect(rawOpt) {
        if (!_.isEmpty(rawOpt)) {
            return {
                label: rawOpt.nodeName,
                value: rawOpt.nodeId
            }
        }
        return {};
    }

    treeToArray(treeData = [], parent) {
        const treeArray = [];
        parent = parent || 0;
        const { children, ...newNode } = treeData;
        treeArray.push(newNode);
        if (treeData.children && treeData.children.length > 0) {
            for (var i = 0, len = treeData.children.length; i < len; i++) {
                treeArray.push(...this.treeToArray(treeData.children[i]));
            }
        }
        return treeArray;
    }

    handleChange(name, value, obj) {
        const { isTouched } = obj || { isTouched: false };
        if (isTouched) {
            value = this.state[name];
        }
        this.setState({ [name]: value });
    }

    render() {
        return (
            <div>
                <ModalBody>
                    <Row className="noMargin dataTableFormgroup">
                        <FieldItem
                            name="id"
                            label="Id"
                            width="md"
                            value={this.state.userId}
                            onChange={this.handleChange.bind(this,'userId')}
                            touched={false}
                            error="" />
                        <FieldItem
                            name="name"
                            value={this.state.userName}
                            label="Name"
                            width="md"
                            onChange={this.handleChange.bind(this,'name')}
                            touched={false}
                            error="" />
                        <Col className="selector-col">
                            <FieldItem
                                label="Select Channel Type"
                                values={this.state.channelTypeOptions}
                                value={this.state.channelType}
                                type={FIELD_TYPES.NESTED_DROP_DOWN}
                                width="sm"
                                onChange={this.handleChange.bind(this, "channelType")}
                                touched={false}
                                error=""
                                placeholder="Select"
                                disabled={false}
                            />
                        </Col>
                    </Row>
                    <ModalFooter>
                        <Button className="btn-form btn-block-c" color="secondary-form" onClick={this.props.onCancel}>Cancel</Button>
                        <Button className="btn-form btn-block-c" color="primary-form" onClick={() => { this.props.onSubmitClick(this.state); this.props.onCancel(); }}>Search</Button>
                    </ModalFooter>
                </ModalBody>

            </div>
        );
    }
}