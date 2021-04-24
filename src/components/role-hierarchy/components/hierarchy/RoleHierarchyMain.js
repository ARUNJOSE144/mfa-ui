
/* import 'channel-partner-hierarchy/styles/index.min.css'; */
import _ from 'lodash';
import React, { Component } from 'react';
import { Redirect, Switch } from "react-router-dom";
import DataTableContainer from '../../../generic/data-table/elements/dataTable/DataTableContainer';
import { checkForPrivilege, containAtleastOnePrivilageId } from '../util/util';
import { HERARCHY } from './FormElements';

class RoleHierarchyMain extends Component {

    constructor(props) {
        super(props);
        const { privilages } = props;
        const PRIVILAGES = this.props.menuPrivilages
        const tabPriv = {
            create: _.includes(privilages, PRIVILAGES.create),
            /*  edit: _.includes(privilages, PRIVILAGES.edit),  */
            delete: _.includes(privilages, PRIVILAGES.delete)
        };
        const hierarchyTypesCreateTags = ["createResidentialHierarchy", "createCommercialHierarchy", "createEmaHierarchy"];
        const hierarchyTypesEditTags = ["editResidentialHierarchy", "editCommercialHierarchy", "editEmaHierarchy"];
        const hierarchyTypesDeleteTags = ["deleteResidentialHierarchy", "deleteCommercialHierarchy", "deleteEmaHierarchy"];
        const hierarchyTypesViewTags = ["viewResidentialHierarchy", "viewCommercialHierarchy", "viewEmaHierarchy"];




        this.state = {
            tabPriv,
            isTreeView: false,
            isAddNode: false,
            modal: 0,
            hierarchyId: "",
            viewHierarchyId: this.createHierarchyIdsForView(),

            privilages: {
                create: containAtleastOnePrivilageId(this.props.privilages, this.props.menuPrivilages, hierarchyTypesCreateTags),
                edit: containAtleastOnePrivilageId(this.props.privilages, this.props.menuPrivilages, hierarchyTypesEditTags),
                delete: containAtleastOnePrivilageId(this.props.privilages, this.props.menuPrivilages, hierarchyTypesDeleteTags),
            },

        };

        this.deleteHierarchy = this.deleteHierarchy.bind(this);
        console.log("sdfdfd : ", this.props)

    }

    createHierarchyIdsForView = () => {
        var viewCatList = [];
        if (checkForPrivilege(this.props.privilages, 27003))
            viewCatList.push(1);
        if (checkForPrivilege(this.props.privilages, 27004))
            viewCatList.push(2);
        if (checkForPrivilege(this.props.privilages, 27005))
            viewCatList.push(3);
        return viewCatList;


    }



    componentDidMount() {
        this.state.privilages.create = containAtleastOnePrivilageId(this.props.privilages, this.props.menuPrivilages, this.state.hierarchyTypesCreateTags)
        this.forceUpdate();
    }


    getHierarcyIdByUserId = (userId) => {

        var reqData = { "userId": userId }
        var self = this;
        this.props.ajaxUtil.sendRequest(this.props.const_SalesHierarchy.GET_HIERARCHY_ID_FROM_USER_ID, reqData, (response) => {
            console.log("GET_HIERARCHY_ID_FROM_USER_ID : ", response);
            self.setState({ hierarchyId: response.responseObj.hierarchyId })
            this.setState({ modal: 3 });
        }, this.props.loadingFunction, { method: 'POST', isShowSuccess: false });
    }

    toggleAction = (type, id) => {
        this.setState({ modal: type, hierarchyId: id });
    }

    deleteHierarchy(callback, id) {
        this.props.ajaxUtil.sendRequest(`${this.props.const_SalesHierarchy.DELETE_HIERARCHY}${id}`, {}, callback, this.props.loadingFunction, { method: 'DELETE', isProceedOnError: false, isAutoApiMsg: true });
    }

    deleteRow = (id, msg, callback) => {
        this.props.setModalPopup({
            'rowId': id,
            'isOpen': true,
            'onConfirmCallBack': this.deleteHierarchy.bind(this, callback),
            'content': "Do you really want to delete this Hierarchy ?",
            'title': "Confirm Delete",
            'CancelBtnLabel': "Cancel",
            'confirmBtnLabel': "Delete"
        });
    }


    goto = (page) => {
        this.setState({ modal: page });
    }


    onExtraButtonClick() {
        console.log("onExtraButtonClick");
    }


    render() {
        const { modal } = this.state;

        const propsForDataTable = {
            privilages: this.props.privilages,
            menuPrivilages: this.state.privilages,
            ajaxUtil: this.props.ajaxUtil,
            listUrl: this.props.const_SalesHierarchy.GET_HIERARCHY_LIST + "?hierarchyTypeIds=" + this.state.viewHierarchyId.join(),
            previousState: this.props.previousState,
            apiVersion: 2,
            defaultRowCount: this.props.globalConstants.INITIAL_ROW_COUNT,
            listName: 'hierarchyList',
            rowIdParam: 'id',
            tableHeaderLabels: HERARCHY.LABEL_LIST,
            loadingFunction: this.props.loadingFunction,
            header: "Hierarchies",
            togglePopup: this.toggleAction,
            deleteRow: this.deleteRow,
            deleteMessage: 'Are you sure to Delete role',
            deleteMessageParam: ['name'],
            saveState: state => this.props.saveCurrentState({ [this.props.previousStateKey]: state }),
            orderByCol: "id",
            tabPriv: { info: true },
            renderSearchFilter: this.renderSearchFilter,
            emptyMsg: 'No Hierarchy Available',
            isSearchOnEnter: false

        }


        if (this.state.modal === 2) {
            return (
                <Switch>
                    <Redirect to="/roleHierarchies/create" push />
                </Switch>
            );
        }

        if (this.state.modal === 3) {
            const treeUrl = `/roleHierarchies/tree/${this.state.hierarchyId}/edit`;
            return (
                <Switch>
                    <Redirect to={treeUrl} />
                </Switch>
            );
        } if (this.state.modal === 4) {
            const treeUrl = `/roleHierarchies/tree/${this.state.hierarchyId}/view`;
            return (
                <Switch>
                    <Redirect to={treeUrl} />
                </Switch>
            );
        }

        return (
            <div className="custom-container">
                {!this.state.isTreeView ?
                    <DataTableContainer
                        {...propsForDataTable}
                    >
                    </DataTableContainer>
                    : null}
            </div>
        );
    }
}

export default RoleHierarchyMain;