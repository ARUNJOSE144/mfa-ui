import React, { Component } from 'react';
import { Container, Row, Col, Progress, Table } from 'reactstrap';
import _ from 'lodash';
import {Popup, POPUP_ALIGN} from '@6d-ui/popup';
import {CustomButton,BUTTON_SIZE, BUTTON_STYLE, BUTTON_TYPE} from '@6d-ui/buttons';
import {StyledDropDown}  from '@6d-ui/form';
import PerformanceChart from './PerformanceChart';
import TargetChart from './TargetChart';
import StockChart from './StockChart';
import POSLocaterMap from './POSLocaterMap';
import ProfileTab from './ProfileTab';
import ModalTab from './ModalTab';
import Visitors from './visitors/Visitors';
import { FIELDS, BUSINESS_LOCATION_GROUP } from '../util/ChannelTypeFields';


export default class ViewChannelPartner extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isShowPosInfo: false //for testing. should be false by default
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.togglePOSInfo = this.togglePOSInfo.bind(this);
        this.getPopup = this.getPopup.bind(this);
        this.fetchDocuments = this.fetchDocuments.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.fetchUserInfo = this.fetchUserInfo.bind(this);
        this.fetchSalesHierarchy = this.fetchSalesHierarchy.bind(this);
        this.getEntityLocations = this.getEntityLocations.bind(this);
        this.fetchLocationForDropDown =  this.fetchLocationForDropDown.bind(this);
    }

    componentDidMount() {
        this.props.setHeader("Channel Partners");
        const channelPartnerId = this.props.match.params.id;
        const that = this;
        this.fetchUserInfo();
    }

    fetchUserInfo = (stateProps = {}) => {
        const that = this;
        const channelPartnerId = this.props.match.params.id;
        this.props.ajaxUtil.sendRequest(`${this.props.url_ChannelPartners.VIEW_URL}/${channelPartnerId}`,{},response => {
            if(response){
                let state = {};
                state.companyName = response.name;
                
                const { name, id, contactPerson, authorizedPerson, billingAddress, shippingAddress, registeredAddress, businessAddress, account, products, documents, ...allOthers } = response;
                let flattenedAttrs = this.toFlatObject({ contactPerson, authorizedPerson, billingAddress, shippingAddress, registeredAddress, businessAddress });
                let parentEntityId = { value: allOthers.parentId, label: allOthers.parentName }
                let territoryType = {
                    value: allOthers.locationTypeId,
                    label: allOthers.locationType
                }, territoryName = allOthers.locations.map(obj => ({ label: obj.locationName, value: obj.locationId }));
                state = { ...state, ...allOthers, parentEntityId, products, ...flattenedAttrs, territoryType, territoryName };

                that.setState({...state, ...stateProps},()=>{
                    this.fetchChannelPartnerTypeDetails(response.channelTypeId, that);
                })
                
            }
        },this.props.loadingFunction,{method:'GET',isShowSuccess: false, isShowFailure: false});
    }


    toFlatObject(outerObj){
        let finalObj = {};
        for (var outerKey in outerObj) {
            if (outerObj.hasOwnProperty(outerKey)) {
                let innerObj = outerObj[outerKey];
                for (var innerKey in innerObj) {
                    if (innerObj.hasOwnProperty(innerKey)) {
                        finalObj[`${outerKey}.${innerKey}`] = innerObj[innerKey] || '';
                    }
                }
            }
        }
        return finalObj;
    }

    fetchChannelPartnerTypeDetails(channelPartnerTypeId, that) {
        this.props.ajaxUtil.sendRequest(`${this.props.url_SalesHierarchy.VIEW_NODE_URL}/${channelPartnerTypeId}`, {}, (response,hasError) => {
            let  valueProps = {};
            if (response && !hasError) {
                const { channelTypeNodes } = response;
                const assignedGroups = that.getAssignedGroups(FIELDS, channelTypeNodes.fields);
                
                const fields = {};
                for (let i = 0, len = assignedGroups.length; i < len; i++) {
                    for (var key in assignedGroups[i].fields) {
                        if (assignedGroups[i].fields.hasOwnProperty(key)) {
                            fields[assignedGroups[i].fields[key].name] = {
                                ismandatory: assignedGroups[i].fields[key].ismandatory,
                                pattern: assignedGroups[i].fields[key].pattern,
                                minLength: assignedGroups[i].fields[key].minLength,
                                maxLength: assignedGroups[i].fields[key].maxLength,
                                values: assignedGroups[i].fields[key].values
                            };
                            try{
                                if(assignedGroups[i].fields[key].type === '1'){
                                    valueProps[assignedGroups[i].fields[key].name] = _.find(assignedGroups[i].fields[key].values,{value: that.state[assignedGroups[i].fields[key].name]})
                                }
                            } catch (e){
                                console.log({e})
                            }
                        }
                    }
                    let { subGroups = [] } = assignedGroups[i];
                    if (subGroups && subGroups.length > 0) {
                        for (let j = 0, len2 = subGroups.length; j < len2; j++) {
                            for (var key1 in subGroups[j].fields) {
                                if (subGroups[j].fields.hasOwnProperty(key1)) {
                                    fields[subGroups[j].fields[key1].name] = {
                                        ismandatory: subGroups[j].fields[key1].ismandatory,
                                        pattern: subGroups[j].fields[key1].pattern,
                                        minLength: subGroups[j].fields[key1].minLength,
                                        maxLength: subGroups[j].fields[key1].maxLength,
                                        values: subGroups[j].fields[key1].values
                                    };
                                    try{
                                        if(subGroups[j].fields[key1].type === '1'){
                                            valueProps[subGroups[j].fields[key1].name] = _.find(subGroups[j].fields[key1].values,{value: that.state[subGroups[j].fields[key1].name]})
                                        }
                                    }catch (e) {
                                        console.log({e})
                                    }
                                }
                            }
                        }
                    }
                }
                that.assignedGroups = assignedGroups;

                const tabData = [];
                assignedGroups.forEach((groups) => {
                  tabData.push(groups.groupId);
                });
                tabData.push("products");
                tabData.push("documents");

                
                
                const hasMultiLocation = channelTypeNodes.multipleLocation === 1 ? true : false;
                that.setState({ fields, hasMultiLocation, activeTab: assignedGroups[0].groupId, tabData });
                that.fetchDocuments();
                
                this.props.ajaxUtil.sendRequest(this.props.url_CompanyType.LIST_URL, {}, (response,hasError) => {
                    if (response && !hasError) {
                        const { searchResponse: { rowData = [] } } = response;
                        let { fields } = that.state;
                        let { comapnyTypeId={} } = fields
                        comapnyTypeId.values = rowData.map(({ rowId, columnValues }) => ({ label: columnValues[1].value, value: parseInt(rowId) }));
                        fields.comapnyTypeId = comapnyTypeId;
                        that.setState({ fields });
                    }
                }, this.props.loadingFunction, { method: 'POST', isShowSuccess: false })

                // =======================get service classes=======================
                this.props.ajaxUtil.sendRequest(this.props.url_ServiceClass.LIST_URL, { "pageNumber": 1, "rowCount": 100, "orderByCol": "serviceName", "sort": "asc" }, (response = {}, hasError) => {
                    if (!hasError && response.serviceList) {
                        let { fields, fields: { serviceClassId = {} } } = that.state;
                        serviceClassId.values = response.serviceList.map(serviceClass => ({ value: serviceClass.serviceId, label: serviceClass.serviceName }));
                        fields.serviceClassId = serviceClassId;
                        that.setState({ fields });
                    }
                }, this.props.loadingFunction, { method: 'POST', isShowSuccess: false })
                // =================================================================

                this.props.ajaxUtil.sendRequest(this.props.url_ChannelPartners.GET_LOCATION_TYPES, { "filters": [ { "name": "entityId", "value": 0 } ]}, (response) => {
                    if (response && response.locTypes) {
                        try {
                            let { fields, fields: { territoryType={} } } = that.state;
                            territoryType.values = response.locTypes.map((user, index) => ({ "label": user.name, "value": user.locTypeId }));
                            fields.territoryType = territoryType;
                            that.setState({ fields });    
                        } catch (error) {
                            console.log(error)
                        }
                    }
                  }, this.props.loadingFunction, {isShowSuccess:false});

                this.fetchLocationForDropDown(this.state.territoryType);

                that.fetchSalesHierarchy(channelPartnerTypeId);  
            }

        }, this.props.loadingFunction, { method: 'GET', isShowSuccess: false });
    }


    fetchSalesHierarchy(channelPartnerTypeId) {
        this.props.ajaxUtil.sendRequest(this.props.url_SalesHierarchy.LIST_URL, {}, response => {
            if (response && response.channelTypeNodes) {
                const { channelTypeNodes } = response;
                const treeData = this.searchTree(channelTypeNodes, channelPartnerTypeId);
                const childEntites = this.treeToArray(treeData, channelPartnerTypeId);
                // const parentEntityTypeId = childEntites && childEntites[0] && childEntites[0].parentType;
                const parentEntityTypeId = treeData.parentType;
                _.remove(childEntites, {
                    nodeId: channelPartnerTypeId
                });
                this.setState({ childEntites, parentEntityTypeId, locatorEntityTypeId: treeData.nodeId }, () => {
                    this.getEntityLocations(this.props.match.params.id, this.state.locatorEntityTypeId)
                    const parentEntityId = treeData.parentNodeId;
                    this.props.ajaxUtil.sendRequest(this.props.url_ChannelPartners.SEARCH_URL, {  "pageNumber":1, "filters": [{ "name": "channelType", value: parentEntityId }] }, (response) => {
                        if (response && response.channelPartnerEnitities) {
                            let { fields, fields: { parentEntityId = {} } } = this.state;
                            parentEntityId.values = response.channelPartnerEnitities.map(obj => ({ label: obj.name, value: obj.id }))
                            fields.parentEntityId = parentEntityId;
                            this.setState({ fields });
                        }
                    },this.props.loadingFunction, { isShowSuccess: false });
                });
            }
        },this.props.loadingFunction, { method: 'GET', isShowSuccess: false });
    }

    searchTree(element, matchingId) {
        if (element.nodeId === matchingId) {
            return element;
        } else if (element.children != null) {
            var i;
            var result = null;
            for (i = 0; result == null && i < element.children.length; i++) {
                result = this.searchTree(element.children[i], matchingId);
            }
            return result;
        }
        return null;
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


    fetchDocuments() {
        const that = this;
        this.props.ajaxUtil.sendRequest(`${this.props.url_ChannelPartners.LIST_ALL_FILES}/${this.props.match.params.id}`, {}, response => {
            if(response){
                that.setState({documents: response});
            }
        },this.props.loadingFunction,{method:'GET',isShowSuccess: false})

    }

    fetchProducts() {
        const that = this;
        this.props.ajaxUtil.sendRequest(`${this.props.url_ChannelPartners.LIST_PRODUCTS}/${this.props.match.params.id}`, {}, response => {
            if(response){
                that.setState({products: response});
            }
        },this.props.loadingFunction,{method:'GET',isShowSuccess: false})

    }

    deactivateEntity(){
        this.props.ajaxUtil.sendRequest(`${this.props.url_ChannelPartners.DEACTIVATE_URL}/${this.props.match.params.id}`, {}, response => {
            if(response){
                this.setState({status:'Inactive'});
            }
        },this.props.loadingFunction,{method:'POST'})
    }

    activateEntity(){
        this.props.ajaxUtil.sendRequest(`${this.props.url_ChannelPartners.ACTIVATE_URL}/${this.props.match.params.id}`, {}, response => {
            if(response){
                this.setState({status:'Active'});
            }
        },this.props.loadingFunction,{method:'POST'})
    }

    onLocatorEntitySelect(value){
        if(!value || value.value !== this.state.locatorEntityTypeId){
            this.setState({ locatorEntityTypeId: value.value },()=>{
                this.getEntityLocations(this.props.match.params.id, this.state.locatorEntityTypeId)
            })
        }
    }

    getEntityLocations(channelPartnerId, selectedEntityTypeId) {
        if (channelPartnerId && selectedEntityTypeId) {
            const request = {
                filters: [
                    {
                        "name": "id",
                        "value": channelPartnerId
                    },
                    {
                        "name": "channelType",
                        "value": selectedEntityTypeId
                    },
                ]
            }
            this.props.ajaxUtil.sendRequest(`${this.props.url_ChannelPartners.GET_CHILDREN}`, request, response => {
                if (response && response.channelPartnerEnitities) {
                    const {channelPartnerEnitities} = response;
                    const entityLocations = channelPartnerEnitities && channelPartnerEnitities.map(entity => ({
                        lonlat: [entity.longitude, entity.latitude]
                    }));
                    this.setState({ entityLocations: entityLocations || [] });
                }
            },this.props.loadingFunction, { method: 'POST', isShowSuccess: false })
        }
    }


    fetchLocationForDropDown(value){
        if(value && value.value){
            let parentEntityId
            if(this.state.parentEntityTypeId === 3){
                if(!this.state.parentEntityId) return;
                parentEntityId = this.state.parentEntityId.value;
            } else {
                parentEntityId=0;
            }
            this.props.ajaxUtil.sendRequest(`${this.props.url_ChannelPartners.GET_LOCATIONS_BY_ENTITY}?entityId=${parentEntityId}&locationType=${value.value}`, {}, (response) => {
            // this.props.ajaxUtil.sendRequest(`${URLS.GET_LOCATIONS_BY_ENTITY}?entityId=1000&locationType=${value.value}`, {}, (response) => {
                if (response && response.locDetails) {
                    try {
                        let { fields = {} } = this.state;
                        let { territoryName = {} } = fields;
                        territoryName.values = response.locDetails.map((user, index) => ({ "label": user.locName, "value": user.locId }));
                        fields.territoryName = territoryName;
                        
                        this.setState({ fields });
                    } catch (err) {
                        console.log(err)
                    }
                }
            }, this.props.loadingFunction, { method: 'GET', isShowSuccess: false });
        }
    }

    handleInputChange(name, value, obj) {
        const { isTouched } = obj || { isTouched: false };
        if (isTouched) {
            value = this.state[name];
        }
        const fields = this.state.fields;
        fields[name] = fields[name] || {}
        const validate = this.validateForm(name, value);
        if (validate) {
            fields[name].hasError = validate.hasError;
            fields[name].errorMsg = validate.errorMsg;
        } else {
            fields[name].hasError = false;
            fields[name].errorMsg = "";
        }
        this.setState({ [name]: value, fields });

        if(name === 'territoryName'){
            let valArr = [];
            for(let i=0,l=value.length;i<l;i++){
                valArr.push(value[i])
            }
            this.setState({ [name]: valArr, fields });
        } else if (name === 'territoryType') {
            this.setState({ [name]: value, "territoryName":[], fields });
            
        } else {
            this.setState({ [name]: value, fields });
        }

        if(_.isEmpty(validate) || !validate.hasError){
            switch (name) {
                case BUSINESS_LOCATION_GROUP.FIELDNAME_TERRITORYTYPE:
                    if(value && value.value){
                        let parentEntityId
                        if(this.state.parentEntityTypeId === 3){
                            if(!this.state.parentEntityId) break;
                            parentEntityId = this.state.parentEntityId.value;
                        } else {
                            parentEntityId=0;
                        }
                        
                        this.props.ajaxUtil.sendRequest(`${this.props.url_ChannelPartners.GET_LOCATIONS_BY_ENTITY}?entityId=${parentEntityId}&locationType=${value.value}`, {}, (response) => {
                        // this.props.ajaxUtil.sendRequest(`${URLS.GET_LOCATIONS_BY_ENTITY}?entityId=1000&locationType=${value.value}`, {}, (response) => {
                            if (response && response.locDetails) {
                                try {
                                    let { fields, fields: { territoryName={} } } = this.state;
                                    territoryName.values = response.locDetails.map((user, index) => ({ "label": user.locName, "value": user.locId }));
                                    fields.territoryName = territoryName;
                                    this.setState({ fields });
                                } catch (err) {
                                    console.log(err)
                                }
                            }
                        },this.props.loadingFunction, { method: 'GET', isShowSuccess: false });
                    }
                    
                    break;

                default:
                    break;
            }
        }
        
    }

    validateForm(name, value) {
        const validateObj = this.state.fields[name];
        if (!validateObj)
            return;

        if (validateObj.ismandatory === true && !value)
            return { hasError: true, errorMsg: "This Field is mandatory" }

        if (value && validateObj.minLength && validateObj.minLength > value.length)
            return { hasError: true, errorMsg: `Minimum Size Must Be ${validateObj.minLength}` };

        if (value && validateObj.maxLength && validateObj.maxLength < value.length)
            return { hasError: true, errorMsg: `Maximum Size Must Be ${validateObj.maxLength}` };

        if (value && validateObj.pattern && !validateObj.pattern.test(value))
            return { hasError: true, errorMsg: "Please enter a valid value" }

        if (name === 'territoryName') {
            if (!value || value.length < 1)
                return { hasError: true, errorMsg: "Please enter a valid value" }
        }
    }

    onUpdateSubmit() {
        const that = this;
        const errors = this.validateAllFields(this.assignedGroups, { ...this.state.fields });


        that.setState({ fields: errors.fields });
        if (errors.hasError === true) {
            this.props.setNotification({
                "message": "Please Enter Proper Values in the fields highlighted in red",
                "hasError": true
            });
            return false;
        }

        const request = this.getRequest(this.state,this.props.match.params.id);
        


        this.props.ajaxUtil.sendRequest(`${this.props.url_ChannelPartners.UPDATE_URL}`, request, response => {
            if(response){
                let updatedAt = new Date().getTime();
                this.fetchUserInfo({updatedAt});
            }
        },this.props.loadingFunction);
    }

    validateAllFields(assignedGroups, fields) {
        const that = this;
        let hasError = false;
        for (let i = 0, len = assignedGroups.length; i < len; i++) {
            _.forEach(assignedGroups[i].fields, (value) => {
                if (fields[value.name]) {
                    const validate = that.validateForm(value.name, that.state[value.name]);
                    if (validate) {
                        if (hasError === false)
                            hasError = validate.hasError;

                        fields[value.name].hasError = validate.hasError;
                        fields[value.name].errorMsg = validate.errorMsg;
                    } else {
                        fields[value.name].hasError = false;
                        fields[value.name].errorMsg = "";
                    }
                }
            });
            const { subGroups } = assignedGroups[i];
            const subGroupFields = subGroups && subGroups.length > 0 ? this.validateAllFields(subGroups, fields) : {};
            fields = { ...fields, ...subGroupFields.fields }
            hasError = subGroupFields.hasError || hasError;
        }
        return { fields, hasError };
    }

    getSelectValue(value){
        const valueType = typeof value;
        if (valueType !== 'undefined' && valueType !== 'string' && valueType !== 'number' && valueType !== 'boolean') return value.value;
        return value;
    }

    getRequest(state,entityId) {
        const reqBody = {};

        reqBody.name = state.companyName;
        reqBody.id = entityId;
        reqBody.businessRegNo = state.businessRegNo;
        reqBody.taxNo = state.taxNo;
        reqBody.comapnyTypeId = this.getSelectValue(state.comapnyTypeId);
        reqBody.channelTypeId = state.channelTypeId;
        reqBody.serviceClassId = this.getSelectValue(state.serviceClassId);

        reqBody.creditLimit = state.creditLimit;

        // reqBody.creditDays = state.businessRegNo;
        // reqBody.amountRecievable = state.businessRegNo;
        // reqBody.amountPayable = state.businessRegNo;
        reqBody.erpCode = state.erpCode;
        // reqBody.paymentCode = state.businessRegNo;
        reqBody.mobileNo = state.mobileNo;
        reqBody.emailId = state.emailId;
        reqBody.parentId = state.parentEntityId && state.parentEntityId.value;
        reqBody.locations = state.territoryName && state.territoryName.map(locDetails => ({locationId:locDetails.value}));
        reqBody.latitude = state.latitude;
        reqBody.longitude = state.longitude;
        reqBody.contactPerson = {
            // title: state['contactPerson.title'] && state['contactPerson.title'].value,
            title: this.getSelectValue(state['contactPerson.title']),
            firstName: state['contactPerson.firstName'],
            lastName: state['contactPerson.lastName'],
            mobileNo: state['contactPerson.mobileNo'],
            emailId: state['contactPerson.emailId'],
            phoneNo: state['contactPerson.phoneNo']
        };
        reqBody.authorizedPerson = {
            // title: state['authorizedPerson.title'] && state['authorizedPerson.title'].value,
            title: this.getSelectValue(state['authorizedPerson.title']),
            firstName: state['authorizedPerson.firstName'],
            lastName: state['authorizedPerson.lastName'],
            mobileNo: state['authorizedPerson.mobileNo'],
            emailId: state['authorizedPerson.emailId'],
            phoneNo: state['authorizedPerson.phoneNo']
        };
        reqBody.billingAddress = {
            addressLine1: state['billingAddress.addressLine1'],
            addressLine2: state['billingAddress.addressLine2'],
            city: state['billingAddress.city'],
            region: state['billingAddress.region'],
            zip: state['billingAddress.zip'],
        };
        reqBody.shippingAddress = {
            addressLine1: state['shippingAddress.addressLine1'],
            addressLine2: state['shippingAddress.addressLine2'],
            city: state['shippingAddress.city'],
            region: state['shippingAddress.region'],
            zip: state['shippingAddress.zip'],
        };
        reqBody.registeredAddress = {
            addressLine1: state['registeredAddress.addressLine1'],
            addressLine2: state['registeredAddress.addressLine2'],
            city: state['registeredAddress.city'],
            region: state['registeredAddress.region'],
            zip: state['registeredAddress.zip'],
        };
        reqBody.businessAddress = {
            addressLine1: state['businessAddress.addressLine1'],
            addressLine2: state['businessAddress.addressLine2'],
            city: state['businessAddress.city'],
            region: state['businessAddress.region'],
            zip: state['businessAddress.zip'],
        };

        


        return reqBody;

    }

    getAssignedGroups(groups, assignedFieldIds, name) {
        let assignedGroups = [];
        _.each(groups, group => {
            if (!_.isEmpty(group.fields)) {

                var assignedFields = _.pickBy(group.fields, (field, id) => _.find(assignedFieldIds, { fieldId: parseInt(id) }) !== undefined);
                this.pickAssignedFields(group.fields, assignedFieldIds);

                !_.isEmpty(assignedFields) && assignedGroups.push({
                    groupId: group.groupId,
                    name: name ? `${name} (${group.name})` : group.name,
                    fields: assignedFields
                });
            }
            if (!_.isEmpty(group.subGroups)) {

                const tmpArr = this.getAssignedGroups(group.subGroups, assignedFieldIds);
                if (tmpArr && tmpArr.length > 0) {
                    group.subGroups = [...tmpArr];
                    assignedGroups.push(group);
                }

            }
        })
        return assignedGroups;
    }

    pickAssignedFields(fields, assignedFields) {
        const assignedFieldList = {}
        for (var key in fields) {
            if (fields.hasOwnProperty(key)) {
                const foundField = _.find(assignedFields, { fieldId: parseInt(key) });
                if (foundField !== undefined) {
                    assignedFieldList[key] = fields[key];
                    assignedFieldList[key].ismandatory = foundField.isMandatory === 1 || assignedFieldList[key].isMandatoryIfSelected;;
                }
            }
        }
    }

    toggleModal(modal) {
        modal = modal || null;
        this.setState({ modal });
    }

    togglePOSInfo(isShowPosInfo) {
        this.setState({ isShowPosInfo: isShowPosInfo === true });
    }

    getPosLocatorSelectValues(childEntites){
        if(!childEntites) return;
        
        return _.filter(childEntites, { multipleLocation: 0 }).map((obj => ({ value: obj.nodeId, label: obj.nodeName })));
    }


    getPopup(option) {
        switch (option.case) {
            case 'deactivate':
                this.props.setModalPopup({
                    "rowId": option,
                    "isOpen": true,
                    "onConfirmCallBack": this.deactivateEntity.bind(this),
                    "title": "Confirm Deactivate",
                    "content": "Do you really want to deactivate this account.?",
                    "CancelBtnLabel": "Cancel",
                    "confirmBtnLabel": "Deactivate"
                });
                break;

            case 'activate':
            this.props.setModalPopup({
                "rowId": option,
                "isOpen": true,
                "onConfirmCallBack": this.activateEntity.bind(this),
                "title": "Confirm Deactivate",
                "content": "Do you really want to activate this account.?",
                "CancelBtnLabel": "Cancel",
                "confirmBtnLabel": "Activate"
            });
            break;

            case 'remove-product':
            this.props.setModalPopup({
                    "rowId": option.rowId,
                    "isOpen": true,
                    "onConfirmCallBack": () => option.callBack(option.rowId),
                    "title": "Confirm Removal",
                    "content": "Do you really want to remove this product.?",
                    "CancelBtnLabel": "Cancel",
                    "confirmBtnLabel": "Remove"
                });
                break;

                case 'remove-document':
                this.props.setModalPopup({
                    "rowId": option.rowId,
                    "isOpen": true,
                    "onConfirmCallBack": () => option.callBack(option.rowId),
                    "title": "Confirm Removal",
                    "content": "Do you really want to remove this document.?",
                    "CancelBtnLabel": "Cancel",
                    "confirmBtnLabel": "Remove"
                });
                break;

            default:
                break;
        }
    }


    render() {
        return (
            <div className="custom-container px-0">
                <Container fluid>
                    {/* **** Row 2 starts here **** */}
                    <Row>
                        <Col className="px-0">
                            <Container className="profile-header pb-1">
                                <Row>
                                    <Col md="4">
                                        <h5 className="fw-600">{this.state.companyName}</h5>
                                    </Col>
                                    <Col md="8">
                                        <div className="profile-header-btn-grp float-sm-right">
                                            <CustomButton
                                                style={BUTTON_STYLE.ROUNDED}
                                                type={BUTTON_TYPE.SECONDARY}
                                                size={BUTTON_SIZE.SMALL}
                                                align="left"
                                                label="Informations"
                                                isButtonGroup={true}
                                                onClick={() => { this.toggleModal('info'); }}
                                            />
                                            {/* <Button onClick={() => { this.toggleModal('info'); }} className="btn-dataTable btn ml-0 profile-btn border-primary text-primary mr-1">Informations</Button> */}
                                            {/* <Button onClick={() => { this.toggleModal('visit'); }} className="btn-dataTable btn ml-0 profile-btn border-primary text-primary mr-1">Visitors</Button> */}
                                            <CustomButton
                                                style={BUTTON_STYLE.ROUNDED}
                                                type={BUTTON_TYPE.SECONDARY}
                                                size={BUTTON_SIZE.SMALL}
                                                align="left"
                                                label="Visitors"
                                                isButtonGroup={true}
                                                onClick={() => { this.toggleModal('visit'); }}
                                            />
                                            {/* <Button className="btn-dataTable btn ml-0 profile-btn border-primary text-primary mr-1">Hierarchy</Button> */}
                                            {
                                                // this.state.status === 'Active'
                                                //     ? <Button onClick={() => { this.getPopup({ case: 'deactivate' }); }} className="btn-dataTable btn ml-0 profile-btn border-danger text-danger">Deactivate Account</Button>
                                                //     : <Button onClick={() => { this.getPopup({ case: 'activate' }); }} className="btn-dataTable btn ml-0 profile-btn border-primary text-primary">Activate</Button>
                                                this.state.status === 'Active'
                                                    ? <CustomButton
                                                    style={BUTTON_STYLE.ROUNDED}
                                                    type={BUTTON_TYPE.SECONDARY}
                                                    size={BUTTON_SIZE.SMALL}
                                                    align="left"
                                                    label="Deactivate"
                                                    isButtonGroup={true}
                                                    onClick={() => { this.getPopup({ case: 'deactivate' }); }}
                                                />
                                                    : <CustomButton
                                                    style={BUTTON_STYLE.ROUNDED}
                                                    type={BUTTON_TYPE.SECONDARY}
                                                    size={BUTTON_SIZE.SMALL}
                                                    align="left"
                                                    label="Activate"
                                                    isButtonGroup={true}
                                                    onClick={() => { this.getPopup({ case: 'activate' }); }}
                                                />
                                            }
                                        </div>
                                    </Col>
                                </Row>
                            </Container>
                        </Col>

                    </Row>
                    {/* *********************** Row 2 ends here *********************** */}

                    {/* **** Row 2 starts here (Profile info and amount/banace details) **** */}
                    <Row className="mt-3">
                        <Col>
                            <Container>
                                <Row>
                                    <Col className="profile-disp-pic"></Col>
                                    <Col>
                                        <div className="profile-details-container">
                                            {/* <div className="profile-details-item fw-600 fs-14">
                                                <span><i className="fa fa-user pr-2" />Floyed Nicols</span>
                                            </div> */}
                                            <div className="profile-details-item fw-600 fs-12">
                                                <span>
                                                    <i className="fa fa-phone pr-2" />
                                                    {
                                                        this.state.mobileNo || "-"
                                                    }
                                                </span>
                                            </div>
                                            <div className="profile-details-item fs-12">
                                                <span>
                                                    <i className="fa fa-address-book pr-2" />
                                                    {
                                                        (this.state['registeredAddress.addressLine1'] && this.state['registeredAddress.addressLine2'] && this.state['registeredAddress.region'] && this.state['registeredAddress.city'])
                                                            ? `${this.state['registeredAddress.addressLine1']}, ${this.state['registeredAddress.addressLine2']}, ${this.state['registeredAddress.region']}, ${this.state['registeredAddress.city']}`
                                                            : "-"
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                {
                                    /*  
                                        <Row>
                                            <Col className="px-0 my-1">
                                                <Button className="btn-dataTable btn ml-0 profile-btn">Edit Profile</Button>
                                            </Col>
                                        </Row>
                                    */
                                }
                            </Container>
                        </Col>
                        <Col className="mt-3">
                            <div className="float-sm-right d-table h-100" style={{ lineHeight: '15px' }}>
                                <div className="bg-success px-3 py-2 text-white profile-amount-card rounded">
                                    <p className="fs-16 fw-600 mb-0">0 /-</p>
                                    <p className="fs-12 mb-0">Amount Received</p>
                                </div>
                                <div className="bg-danger px-3 py-2 text-white profile-amount-card rounded mt-2">
                                    <p className="fs-16 fw-600 mb-0">0 /-</p>
                                    <p className="fs-12 mb-0">Amount Payable</p>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    {/* *********************** Row 2 ends here *********************** */}

                    {/* **** Row 3 starts here **** */}
                    <Row>
                        <Col sm="12" md="7" lg="8">
                            <div className="bg-white">
                                <Container className="border border-top-0 border-right-0 border-left-0 pt-2" style={{ height: '60px' }}>
                                    <Row>
                                        <Col sm="12" md="6" lg="3" className="pr-2">
                                            <p className="fs-13 mb-1">OVERALL PERFORMANCE</p>
                                            <p className="fs-12 mb-0 text-primary">
                                                This Month
                                                <i className="fa fa-chevron-down pl-2" />
                                            </p>
                                        </Col>
                                        <Col sm="12" md="6" lg="3" className="px-2">
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td className="align-top">
                                                            <i className="fa fa-thumbs-down fa-rotate-180 fa-flip-horizontal text-danger mr-2 fs-16" />
                                                        </td>
                                                        <td className="align-top">
                                                            <p className="fs-14 mb-0 fw-600">Key Performance</p>
                                                            <p className="fs-10 mb-0" style={{ lineHeight: '14px' }}>Performance down by 23% in last 2 months</p>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                        </Col>
                                        <Col sm="12" md="6" lg="4" className="px-2">
                                            <table className="w-100">
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <p className="fs-12 mb-0">Achieved:</p>
                                                            <p className="text-danger mb-0 clearfix" style={{ fontSize: '20px' }}>
                                                                <span className="float-left">780</span>
                                                                <span className="float-right">
                                                                    <i className="fa fa-long-arrow-down" />
                                                                </span>
                                                            </p>
                                                        </td>
                                                        <td className="align-bottom">
                                                            <Progress color="danger" value={22} className="mb-3" style={{ minWidth: '90px', height: '4px' }} />
                                                        </td>
                                                        <td>
                                                            <p className="fs-12 mb-0">Target:</p>
                                                            <p className="mb-0" style={{ fontSize: '20px' }}>
                                                                <span>1000</span>
                                                            </p>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </Col>
                                        <Col sm="12" md="6" lg="2" className="pl-2">
                                            <table className="w-100">
                                                <tbody>
                                                    <tr>
                                                        <td>

                                                        </td>
                                                        <td className="text-right">
                                                            <p className="fs-12 mb-0">Trending:</p>
                                                            <p className="mb-0 text-warning" style={{ fontSize: '20px' }}>
                                                                <span>850</span>
                                                            </p>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </Col>
                                    </Row>
                                </Container>
                                <PerformanceChart />
                            </div>
                        </Col>
                        <Col sm="12" md="5" lg="4">
                            <div className="bg-white">
                                <div className="profile-card-header border border-top-0 border-right-0 border-left-0 pt-2">
                                    <span className="fs-13 pl-2 float-left">PRODUCT TARGETS</span>
                                    <span className="fs-12 pr-2 text-primary float-right">
                                        This Month
                                        <i className="fa fa-chevron-down pl-2" />
                                    </span>
                                </div>
                                <TargetChart />
                            </div>
                        </Col>
                    </Row>
                    {/* *********************** Row 2 ends here *********************** */}

                    {/* **** Row 4 starts here **** */}
                    <Row className="mt-4">
                        <Col sm="12" md="7" lg="8">
                            {
                                this.state.isShowPosInfo
                                    ? <div className="bg-white" style={{ minHeight: '210px' }}>
                                        <Container className="border border-top-0 border-right-0 border-left-0 pt-2" style={{ height: '60px' }}>
                                            <Row>
                                                <Col sm="12" md="5" lg="4" className="pr-2">
                                                    <p className="fs-13 mb-1">OVERALL PERFORMANCE</p>
                                                    <p className="fs-12 mb-0 text-primary">
                                                        This Month
                                                        <i className="fa fa-chevron-down pl-2" />
                                                    </p>
                                                </Col>
                                                <Col sm="12" md="5" lg="6" className="px-2">
                                                    <table className="w-100">
                                                        <tbody>
                                                            <tr>
                                                                <td>
                                                                    <p className="fs-12 mb-0">Achieved:</p>
                                                                    <p className="text-danger mb-0 clearfix" style={{ fontSize: '20px' }}>
                                                                        <span className="float-left">780</span>
                                                                        <span className="float-right">
                                                                            <i className="fa fa-long-arrow-down" />
                                                                        </span>
                                                                    </p>
                                                                </td>
                                                                <td className="align-bottom">
                                                                    <div style={{padding: '5.5px 1px'}} className="mb-3">
                                                                        <Progress color="danger" value={22} style={{ minWidth: '90px', height: '4px' }} />
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <p className="fs-12 mb-0">Target:</p>
                                                                    <p className="mb-0" style={{ fontSize: '20px' }}>
                                                                        <span>1000</span>
                                                                    </p>
                                                                </td>
                                                                <td className="align-bottom">
                                                                    <img src="/images/icons/arrow-yellow.svg" className="mb-3"/>
                                                                </td>
                                                                <td className="text-right">
                                                                    <p className="fs-12 mb-0">Trending:</p>
                                                                    <p className="mb-0 text-warning" style={{ fontSize: '20px' }}>
                                                                        <span>850</span>
                                                                    </p>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </Col>
                                                <Col sm="2" className="clearfix">
                                                    <button onClick={this.togglePOSInfo} type="button" className="close custom-close" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>

                                                </Col>
                                            </Row>
                                        </Container>
                                        <Container>
                                            <Row>
                                                <Col sm="12" lg="6">
                                                    <Container className="py-3">
                                                        <Row>
                                                            <Col className="profile-disp-pic"></Col>
                                                            <Col>
                                                                <div className="profile-details-container">
                                                                <div className="profile-details-item fw-600 fs-16">
                                                                        <span>Mobile Candy Store</span>
                                                                    </div>
                                                                    <div className="profile-details-item fw-600 fs-12">
                                                                        <span><i className="fa fa-user pr-2" />Floyed Nicols</span>
                                                                    </div>
                                                                    <div className="profile-details-item fs-12">
                                                                        <span><i className="fa fa-phone pr-2" />2343-232-3223</span>
                                                                    </div>
                                                                    <div className="profile-details-item fs-10">
                                                                        <span><i className="fa fa-address-book pr-2" />672 Veum Throughway Suite 434</span>
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </Container>
                                                </Col>
                                                <Col sm="12" lg="6">
                                                    <Table size="sm" className="custom-table-sm border mt-2">
                                                        <thead>
                                                            <tr>
                                                                <th>ITEM</th>
                                                                <th>BALANCE</th>
                                                                <th>REQUIRED</th>
                                                                <th>Order</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td>Sims Cards</td>
                                                                <td>3</td>
                                                                <td>25</td>
                                                                <td>BUY</td>
                                                            </tr>
                                                            <tr>
                                                                <td>4G Sims Cards</td>
                                                                <td>5</td>
                                                                <td>25</td>
                                                                <td>BUY</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Routers</td>
                                                                <td>20</td>
                                                                <td>100</td>
                                                                <td>BUY</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Data Cards</td>
                                                                <td>2</td>
                                                                <td>10</td>
                                                                <td>BUY</td>
                                                            </tr>
                                                        </tbody>
                                                    </Table>
                                                </Col>
                                            </Row>
                                        </Container>
                                    </div>
                                    : <div className="bg-white">
                                        <div className="border border-top-0 border-right-0 border-left-0 pt-2 pl-3">
                                            <div className="fs-13">POS LOCATER</div>
                                            <div className="pb-1">
                                                <StyledDropDown
                                                    value={this.state.locatorEntityTypeId}
                                                    onSelect={this.onLocatorEntitySelect.bind(this)}
                                                    options={this.getPosLocatorSelectValues(this.state.childEntites)}
                                                />
                                            </div>
                                        </div>
                                        <POSLocaterMap locations={this.state.entityLocations} onMarkerClick={this.togglePOSInfo} />
                                    </div>
                            }
                        </Col>
                        <Col sm="12" md="5" lg="4">
                            <div className="bg-white">
                                <div className="profile-card-header border border-top-0 border-right-0 border-left-0 pt-2">
                                    <span className="fs-13 pl-2">INVENTORY - LOW ON STOCK</span>
                                </div>
                                <StockChart />
                            </div>
                        </Col>
                    </Row>
                    {/* *********************** Row 4 ends here *********************** */}


                    {/* **** Row 4 starts here **** */}
                    <Row className="mt-4">
                        <Col>
                            <ProfileTab />
                        </Col>
                    </Row>
                    {/* *********************** Row 4 ends here *********************** */}
                </Container>
                
                <Popup
                    type={POPUP_ALIGN.RIGHT}
                    title="All Information"
                    isOpen={this.state.modal === 'info'}
                    close={this.toggleModal}
                    minWidth="85%"
                    component={
                        <ModalTab
                            parentEntityId={this.props.parentEntityId}
                            parentId={this.props.parentId}
                            updatedAt={this.state.updatedAt}
                            handleInputChange={this.handleInputChange.bind(this)}
                            onUpdateSubmit={this.onUpdateSubmit.bind(this)}
                            fetchDocuments={this.fetchDocuments}
                            fetchProducts={this.fetchProducts.bind(this)}
                            entityId={this.props.match.params.id} assignedGroups={this.assignedGroups} {...this.state} getPopup={this.getPopup}
                            ajaxUtil={this.props.ajaxUtil}
                            loadingFunction={this.props.loadingFunction}
                            url_ChannelPartners={this.props.url_ChannelPartners}
                            url_DocType={this.props.url_DocType}
                            url_SalesTerritory={this.props.url_SalesTerritory}
                            setNotification={this.props.setNotification}
                        />
                        } />

                <Popup
                    type={POPUP_ALIGN.RIGHT}
                    title="Visitors Information"
                    isOpen={this.state.modal === 'visit'}
                    close={this.toggleModal}
                    minWidth="85%"
                    component={
                        <Visitors
                            channelPartnerId={this.props.match.params.id}
                            ajaxUtil={this.props.ajaxUtil}
                            loadingFunction={this.props.loadingFunction}
                            url_ChannelPartners={this.props.url_ChannelPartners}
                            const_dateFormat={this.props.const_dateFormat}
                        />
                    }
                />

            </div>
        )
    }

}
