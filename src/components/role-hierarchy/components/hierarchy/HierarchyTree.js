/* import { BUTTON_SIZE, BUTTON_STYLE, BUTTON_TYPE, CustomButton } from '@6d-ui/buttons'; */
/* import { Popup, POPUP_ALIGN } from '@6d-ui/popup'; */
 import _ from 'lodash';
import React, { Component } from 'react';
import { Redirect, Switch } from "react-router-dom";
import { Col, Container, Row } from 'reactstrap';
import { BUTTON_SIZE, BUTTON_STYLE, BUTTON_TYPE } from '../../../generic/buttons/elements/ButtonTypes';
import { CustomButton } from '../../../generic/buttons/elements/CustomButton';
import { POPUP_ALIGN } from '../../../generic/popup/constants/Types';
import Popup from '../../../generic/popup/elements/Popup';
import '../../styles/index.min.css';
import CreateForm from './CreateForm';
import SummaryView from './SummaryView';
import ViewComp from './ViewForm';






class HierarchyTree extends Component {

    onOrgChartLoaded() {
        let nodes = document.getElementsByClassName("node");
        for (let i = 0; i < nodes.length; i++) {
            nodes[i].addEventListener('click', () => {
                var nodeData = this.getAttribute("data-source");
            }, false);
        }
    }

    constructor(props) {
        super(props);
        const { privilages } = props;
        const PRIVILAGES = this.props.menuPrivilages
        const tabPriv = {
            create: _.includes(privilages, PRIVILAGES.create),
            /*  edit: _.includes(privilages, PRIVILAGES.edit),  */
            delete: _.includes(privilages, PRIVILAGES.delete)
        };
        this.state = {
            tabPriv,
            /*  isTreeView: true, */
            isAddNode: false,
            modal: 0,
            gotoList: false,
            hierarchy: {},

        };

        /*  this.onNodeSelect = this.onNodeSelect.bind(this); */
        this.setModalConf = this.setModalConf.bind(this);
        this.onAddNodeClick = this.onAddNodeClick.bind(this);
        /* this.onNodeEditClick = this.onNodeEditClick.bind(this); */
        this.onNodeViewClick = this.onNodeViewClick.bind(this);
        this.loadTreeData = this.loadTreeData.bind(this);
        this.onDeleteNodeClick = this.onDeleteNodeClick.bind(this);


    }

    componentDidMount() {
        this.loadTreeData();
        //this.props.setHeader("Sales Hierarchy");
        console.log("nnnnnnnnn :", this.props.match.params.id)
        console.log("mode :", this.props.match.params.mode)
        /*  this.getHierarcyIdByUserId(this.props.userId) */

    }

    /*  getHierarcyIdByUserId = (userId) => {
         var reqData = { "userId": userId }
         var self = this;
         this.props.ajaxUtil.sendRequest(this.props.const_SalesHierarchy.GET_HIERARCHY_ID_FROM_USER_ID, reqData, (response) => {
             console.log("GET_HIERARCHY_ID_FROM_USER_ID : ", response);
             self.setState({ hierarchy: response.responseObj })
 
         }, this.props.loadingFunction, { method: 'POST', isShowSuccess: false });
     } */

    onNodeViewClick(data, node) {
        const header = `View${node.type === this.props.const_SalesHierarchy.BU_NODE_TYPE ? ' Business Unit' : ' Branch'}`
        const viewComp = () => <ViewComp
            onEditBtnClick={() => this.onNodeEditClick(data, node)}
            nodeId={data}
            node={node}
            action="view"
            ajaxUtil={this.props.ajaxUtil}
            loadingFunction={this.props.loadingFunction}
            const_SalesHierarchy={this.props.const_SalesHierarchy}
            url_GetRoles={this.props.url_GetRoles}
            setModalPopup={this.props.setModalPopup}
        />
        this.setModalConf(true, viewComp, header)
    }

    /* onNodeEditClick(data, node) {
        const header = `Edit${node.type === this.props.const_SalesHierarchy.BU_NODE_TYPE ? ' Business Unit' : ' Branch'}`
        const updateComp = () => <UpdateComp
            onEditCancelBtnClick={() => this.onNodeViewClick(data, node)}
            action="view"
            node={node}
            createCallBack={this.loadTreeData}
            nodeId={data}
            onCancel={this.setModalConf}
            ajaxUtil={this.props.ajaxUtil}
            loadingFunction={this.props.loadingFunction}
            const_SalesHierarchy={this.props.const_SalesHierarchy}
            url_GetRoles={this.props.url_GetRoles}
            setNotification={this.props.setNotification}
            setModalPopup={this.props.setModalPopup}
        />
        this.setModalConf(true, updateComp, header)
    } */

    setModalConf(isOpen, component, title, type, className) {
        className = className || 'hierarchy-modal';
        this.setState({ modal: { isOpen, component, title, type, className } });
        this.loadTreeData();

    }

    toggleFun = (tag) => {
        this.setState({ [tag]: !this.setState[tag] });
    }

    onAddNodeClick(data, node, isInBetween) {
        this.setState({ isAddNode: true })
        const header = `Add Role`
        const createComp = () => <CreateForm
            createCallBack={this.loadTreeData}
            parentRoleId={data}
            node={node}
            hierarchyId={this.props.match.params.id}
            onCancel={this.setModalConf}
            ajaxUtil={this.props.ajaxUtil}
            loadingFunction={this.props.loadingFunction}
            const_SalesHierarchy={this.props.const_SalesHierarchy}
            url_GetRoles={this.props.url_GetRoles}
            setNotification={this.props.setNotification}
            toggleFun={this.to}
            messagesUtil={this.props.messagesUtil}
            isInBetween={isInBetween}
        />
        this.setModalConf(true, createComp, header)
    }


    onDeleteNodeClick(data, node) {
        var reqData = {
            "roleId": data.nodeId,
            "hierarchyId": this.props.match.params.id,
        };
        console.log("Request for delete  : ", reqData);
        var self = this;
        this.props.ajaxUtil.sendRequest(this.props.const_SalesHierarchy.DELETE_ROLE_IN_HIERARCHY_URL, reqData, function (resp, hasError) {
            if (resp && !hasError) {
                self.props.setNotification({ message: "Role Deleted Successfully", hasError: false });
                self.loadTreeData();
            } else {
                self.props.setNotification({ message: resp.responseMsg, hasError: true });
            }
        }, this.props.loadingFunction, { method: 'POST', isShowSuccess: false, isShowFailure: false });

    }


    deleteNode = (data, node) => {
        this.props.setModalPopup({
            /*  'rowId': this.state.msisdn, */
            'isOpen': true,
            'onConfirmCallBack': this.onDeleteNodeClick.bind(data, node),
            'content': "Do you really want to delete this Role ?",
            'title': "Confirm Delete",
            'CancelBtnLabel': "Cancel",
            'confirmBtnLabel': "Delete"
        });
    }


    loadTreeData() {
        var reqData = {
            id: parseInt(this.props.match.params.id),
        }
        this.props.ajaxUtil.sendRequest(this.props.const_SalesHierarchy.LIST_URL, reqData, (response, hasError) => {
            let treeData = [];
            let hierarchy = {};
            console.log("=============Actual response from DB : ", response);

            if (response && !hasError) {
                const { channelTypeNodes } = response;
                treeData = channelTypeNodes;
                hierarchy = response.hierarchyObj;
            }
            this.setState({ treeData, hierarchy });
        }, this.props.loadingFunction, { method: 'POST', isShowSuccess: false });
    }

    treeToArray(NODES) {
        let data = []
        _.each(NODES, NODE => {
            data.push({
                locationId: NODE.nodeId,
                locationName: NODE.nodeName,
                locationType: NODE.type,
                childLocationType: NODE.childLocType,
                parentId: NODE.parentNodeId
            })
            if (NODE.children && NODE.children.length > 0) {
                const children = this.treeToArray(NODE.children)
                data = data.concat(children)
            }
        })
        return data;
    }



    gotoList = () => {
        this.setState({ gotoList: true })
    }


    render() {
        const { modal } = this.state;


        if (this.state.gotoList) {
            return (
                <Switch>
                    <Redirect to="/roleHierarchyMain" push />
                </Switch>
            );
        }
        /*
        if (this.state.modal === 3) {
            const editUrl = `/Roles/edit/${this.state.actionParamId}`;
            return (
                <Switch>
                    <Redirect to={editUrl} />
                </Switch>
            );
        }  */


        return (
            <div className="custom-container">

                {this.props.userId === "1" ?
                    <div className="container-fluid treeLinkCss">
                        <CustomButton
                            style={BUTTON_STYLE.BRICK}
                            type={BUTTON_TYPE.PRIMARY}
                            size={BUTTON_SIZE.LARGE}
                            align="right"
                            label="Go to List"
                            isButtonGroup={true}
                            onClick={this.gotoList}
                        />
                    </div>
                    : null}
                <div>

                    <div className="row">
                        <div className="col-md" style={{ paddingLeft: "30px", fontSize: "14px", fontWeight: "bold" }}>Hierarchy Name : {this.state.hierarchy.name}</div>
                    </div>
                    <Container className="content-container py-1" fluid style={{ minHeight: "500px", overflow: "auto", marginTop: "20px" }}>
                        <Row>
                            <Col>
                                {
                                    !_.isEmpty(this.state.treeData) && <SummaryView
                                        data={this.state.treeData}
                                        onNodeViewClick={this.onNodeViewClick}
                                        /* onNodeEditClick={this.onNodeEditClick} */
                                        onAddNodeClick={this.onAddNodeClick}
                                        onDeleteNodeClick={this.deleteNode}
                                        privilages={this.state.tabPriv}
                                        const_SalesHierarchy={this.props.const_SalesHierarchy}
                                        mode={this.props.match.params.mode}
                                        userId={this.props.userId}
                                    />
                                }

                                {
                                    modal && modal.component
                                        ? <Popup
                                            type={POPUP_ALIGN.RIGHT}
                                            close={this.setModalConf}
                                            title={modal.title}
                                            isOpen={modal.isOpen}
                                            minWidth="85%"
                                            component={<modal.component />}
                                        />
                                        : null
                                }

                            </Col>
                        </Row>
                    </Container>

                </div>

            </div>
        );
    }
}

export default HierarchyTree;