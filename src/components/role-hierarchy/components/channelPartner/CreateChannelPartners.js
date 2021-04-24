import React, { Component } from 'react';
import {
    Nav,
    NavItem,
    TabContent,
    TabPane,
    NavLink
} from 'reactstrap';
import _ from 'lodash';
import { CustomButton, BUTTON_STYLE, BUTTON_TYPE, BUTTON_SIZE ,COLOR} from '@6d-ui/buttons';
import { DocumentInput } from '@6d-ui/ui-helpers';
import { FIELDS as CHANNELTYPEFIELDS, BUSINESS_LOCATION_GROUP } from '../util/ChannelTypeFields';
import { Redirect } from 'react-router-dom';
import classnames from 'classnames';

import FormBrick from './FormBrick';
// import ProductInput from './ProductInput';
// import DocumentInput from './DocumentInput';
import TerritoryDetailsForm from './TerritoryDetailsForm';

const DECIMAL_REGEX = /^[+-]?\d+(\.\d+)?$/;
const MSISDN_REGEX = /^[0-9]{8,12}$/

export default class CreateChannelPartners extends Component {

    constructor(props) {
        super(props);
        this.getLoader = this.getLoader.bind(this);
        this.getRequest = this.getRequest.bind(this);
        this.handleSwitch = this.handleSwitch.bind(this);
        this.getPermissions = this.getPermissions.bind(this);
        this.fetchBusinessTypes = this.fetchBusinessTypes.bind(this);
        this.validateTab = this.validateTab.bind(this);
        this.validateForm = this.validateForm.bind(this);
        const permissions = {}
        this.state = {
            isLoading: false,
            channelTypeId: this.props.match.params.id,
            fields: {
                parentEntityId: {}
            },
            permissions: permissions,
            isSuccess: false,
            collapse_details: true,
            collapse_permissions: true,
            products: [{ threshold: '', msisdn: '', simSerialNo: '' }],
            documents: [{}],
            tabData: []
        };
    }

    getAssignedGroups(groups, assignedFieldIds, name) {
        let assignedGroups = [];
        _.each(groups, group => {
            if (!_.isEmpty(group.fields)) {
                // var assignedFields = _.pickBy(group.fields, (field, id) => assignedFieldIds.indexOf(parseInt(id)) > -1);
                var assignedFields = _.pickBy(group.fields, (field, id) => _.find(assignedFieldIds, { fieldId: parseInt(id) }) !== undefined);
                
                this.pickAssignedFields(group.fields, assignedFieldIds);

                !_.isEmpty(assignedFields) && assignedGroups.push({
                    groupId: group.groupId,
                    name: name ? `${name} (${group.name})` : group.name,
                    fields: assignedFields
                });
            }
            if (!_.isEmpty(group.subGroups)) {
                /* *************newly added code************* */
                const tmpArr = this.getAssignedGroups(group.subGroups, assignedFieldIds);
                if (tmpArr && tmpArr.length > 0) {
                    group.subGroups = [...tmpArr];
                    assignedGroups.push(group);
                }
                /* ****************************************** */
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
                    assignedFieldList[key].ismandatory = foundField.isMandatory === 1 || assignedFieldList[key].isMandatoryIfSelected;
                }
            }
        }
    }

    componentDidMount() {
        const channelPartnerTypeId = this.props.match.params.id;
        this.fetchChannelPartnerTypeDetails(channelPartnerTypeId, this);
    }

    fetchBusinessTypes() {
        const that = this;
        this.props.ajaxUtil.sendRequest(this.props.url_CompanyType.LIST_URL, {}, response => {
            if (response) {
                const { searchResponse: { rowData = [] } } = response;
                let { fields, fields: { comapnyTypeId = {} } } = that.state;
                comapnyTypeId.values = rowData.map(({ rowId, columnValues }) => ({ label: columnValues[1].value, value: rowId }));
                fields.comapnyTypeId = comapnyTypeId;
                that.setState({ fields });
            }
        }, this.props.loadingFunction, { method: 'POST', isShowSuccess: false })

        this.props.ajaxUtil.sendRequest(this.props.url_DocType.LIST_URL, { "searchParams": { "pageNumber": 1, "rowCount": 100, "orderByCol": "doccTypeId", "sort": "asc", "keyword": "" } }, response => {
            if (response) {
                const { searchResponse: { rowData = [] } } = response;
                this.setState({ docTypeOptions: rowData.map(({ rowId, columnValues }) => ({ label: columnValues[1].value, value: rowId })) });
            }
        }, this.props.loadingFunction, { method: 'POST', isShowSuccess: false })

        this.props.ajaxUtil.sendRequest(this.props.url_GetProducts, {}, response => {
            if (response) {
                let productOptions = response.map(({ productId, productName, type }) => ({ label: productName, value: productId, type: type }));
                that.setState({ productOptions });
            }
        }, this.props.loadingFunction, { method: 'GET', isShowSuccess: false })

        this.props.ajaxUtil.sendRequest(this.props.url_ChannelPartners.GET_LOCATION_TYPES, { "filters": [{ "name": "entityId", "value": 0 }] }, (response) => {
            if (response && response.locTypes) {
                try {
                    let { fields, fields: { territoryType = {} } } = that.state;
                    territoryType.values = response.locTypes.map((user, index) => ({ "label": user.name, "value": user.locTypeId }));
                    fields.territoryType = territoryType;
                    that.setState({ fields });
                } catch (error) {
                    console.log(error)
                }
            }
        }, this.props.loadingFunction, { isShowSuccess: false });

        // =======================get service classes=======================
        this.props.ajaxUtil.sendRequest(this.props.url_ServiceClass.LIST_URL, { "pageNumber": 0, "orderByCol": "serviceName", "sort": "asc" }, (response = {}, hasError) => {
            if (!hasError && response.serviceList) {
                let { fields, fields: { serviceClassId = {} } } = that.state;
                serviceClassId.values = response.serviceList.map(serviceClass => ({ value: serviceClass.serviceId, label: serviceClass.serviceName }));
                fields.serviceClassId = serviceClassId;
                that.setState({ fields });
            }
        }, this.props.loadingFunction, { method: 'POST', isShowSuccess: false })
        // =================================================================


        if (this.props.match.params.type == 3) {
            this.props.ajaxUtil.sendRequest(this.props.url_ChannelPartners.SEARCH_URL, { "pageNumber":1, "filters": [{ "name": "channelType", value: this.props.match.params.parentId }] }, (response) => {
                if (response && response.channelPartnerEnitities) {
                    let { fields, fields: { parentEntityId = {} } } = that.state;
                    parentEntityId.values = response.channelPartnerEnitities.map(obj => ({ label: obj.name, value: obj.id }))
                    fields.parentEntityId = parentEntityId;
                    that.setState({ fields });
                }
            }, this.props.loadingFunction, { isShowSuccess: false });

        }
    }

    fetchChannelPartnerTypeDetails(channelPartnerTypeId, that) {
        this.props.ajaxUtil.sendRequest(`${this.props.url_SalesHierarchy.VIEW_NODE_URL}/${channelPartnerTypeId}`, {}, response => {
            if (response) {
                const { channelTypeNodes = {} } = response;
                const assignedGroups = that.getAssignedGroups(CHANNELTYPEFIELDS, channelTypeNodes.fields);
                
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
                        }
                    }
                    let { subGroups = [] } = assignedGroups[i];
                    if (subGroups && subGroups.length > 0) {
                        for (let j = 0, len2 = subGroups.length; j < len2; j++) {
                            for (var key in subGroups[j].fields) {
                                if (subGroups[j].fields.hasOwnProperty(key)) {
                                    fields[subGroups[j].fields[key].name] = {
                                        ismandatory: subGroups[j].fields[key].ismandatory,
                                        pattern: subGroups[j].fields[key].pattern,
                                        minLength: subGroups[j].fields[key].minLength,
                                        maxLength: subGroups[j].fields[key].maxLength,
                                        values: subGroups[j].fields[key].values
                                    };
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
                that.setState({ fields, activeTab: assignedGroups[0].groupId, hasMultiLocation, tabData });
                that.fetchBusinessTypes();
            }
        }, this.props.loadingFunction ,{ method: 'GET', isShowSuccess: false });
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
        if (name === 'territoryName') {
            let valArr = [];
            for (let i = 0, l = value.length; i < l; i++) {
                valArr.push(value[i])
            }
            this.setState({ [name]: valArr, fields });
        } else if (name === 'territoryType') {
            this.setState({ [name]: value, "territoryName": [], fields });
        } else {
            this.setState({ [name]: value, fields });
        }

        if ((_.isEmpty(validate) || !validate.hasError) && !isTouched) {
            switch (name) {
                case BUSINESS_LOCATION_GROUP.FIELDNAME_TERRITORYTYPE:
                    if (value && value.value) {
                        let parentEntityId
                        if (this.props.match.params.type == 3) {
                            if (!this.state.parentEntityId) break;
                            parentEntityId = this.state.parentEntityId.value;
                        } else {
                            parentEntityId = 0;
                        }
                        this.props.ajaxUtil.sendRequest(`${this.props.url_ChannelPartners.GET_LOCATIONS_BY_ENTITY}?entityId=${parentEntityId}&locationType=${value.value}`, {}, (response) => {
                            if (response && response.locDetails) {
                                try {
                                    let { fields, fields: { territoryName = {} } } = this.state;
                                    territoryName.values = response.locDetails.map((user, index) => ({ "label": user.locName, "value": user.locId }));
                                    fields.territoryName = territoryName;
                                    this.setState({ fields });
                                } catch (err) {
                                    console.log(err)
                                }
                            }
                        }, this.props.loadingFunction, { method: 'GET', isShowSuccess: false });
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
    validateTab(type) {
        
        var isDynamicField = false;
        const fields = this.state.fields;
        var hasError = false;
        const that = this;
        this.assignedGroups && this.assignedGroups.forEach(group => {
            if (group.groupId === this.state.activeTab || type === 0) {
                isDynamicField = true;
                _.forEach(group.fields, function (field, name) {
                    const validate = that.validateForm(field.name, that.state[field.name]);
                    if (validate) {
                        if (hasError === false) hasError = validate.hasError;

                        fields[field.name].hasError = validate.hasError;
                        fields[field.name].errorMsg = validate.errorMsg;
                    } else {
                        fields[field.name].hasError = false;
                        fields[field.name].errorMsg = "";
                    }
                });
                _.forEach(group.subGroups, function (subGroup, name) {
                    _.forEach(subGroup.fields, function (field, name) {
                        const validate = that.validateForm(field.name, that.state[field.name]);
                        if (validate) {
                            if (hasError === false) hasError = validate.hasError;

                            fields[field.name].hasError = validate.hasError;
                            fields[field.name].errorMsg = validate.errorMsg;
                        } else {
                            fields[field.name].hasError = false;
                            fields[field.name].errorMsg = "";
                        }
                    });
                });
            }
        });
        var isShownMessage = false;
        if (!isDynamicField || type === 0) {
            if ((this.state.activeTab === 'products' || type === 0) && this.state.products) {
                const error = this.validateProducts(this.state.products);
                if (error.hasError) {
                    that.props.setNotification({
                        message: error.errorMsg,
                        hasError: true
                    });
                    isShownMessage = true;
                }
            }
            if ((this.state.activeTab === 'documents' || type === 0) && this.state.documents) {
                this.state.documents.forEach((doc) => {
                    if ((doc.docType && !doc.file) || (!doc.docType && doc.file)) {
                        that.props.setNotification({
                            message: "Please Enter Document Details",
                            hasError: true
                        });
                        isShownMessage = true;
                    }
                });
            }
        }
        this.setState({ fields });
        if (isShownMessage) {
            return false;
        }
        if (hasError === true) {
            that.props.setNotification({
                message: this.props.messagesUtil.EMPTY_FIELD_MSG,
                hasError: true
            });
            return false;
        } else {
            if (type === 0)
                return true;
            else
                this.setState({ activeTab: type });
        }
    }


    validateProducts = products => {
        if (!products) return { hasError: false, errorMsg: "" };
        let error = {};
        for (let i = 0, len = products.length; i < len; i++) {
            let product = products[i];
            if (product.productId || product.threshold || product.msisdn || product.simNo) {
                if (!product.productId || !product.productId.value) {
                    error.hasError = true;
                    error.errorMsg = "Please select valid product for all products";
                    return error;
                }
                if (!product.threshold) {
                    error.hasError = true;
                    error.errorMsg = "Please enter valid threshold for all products";
                    return error;
                }
                if (!DECIMAL_REGEX.test(product.threshold)) {
                    error.hasError = true;
                    error.errorMsg = "Please enter valid threshold for all products";
                    return error;
                }
                if (product.msisdn && !MSISDN_REGEX.test(product.msisdn)) {
                    error.hasError = true;
                    error.errorMsg = "Please enter valid msisdn with length 8-15 for all products";
                    return error;
                }
            }
        }
        return { hasError: false, errorMsg: "" };
    }

    createCheck(response) {
        
        const hasError = (response.resultCode !== '0'
            ? true
            : false);
        

        if (!hasError) {
            this.setState({ isSuccess: true });
        }
    }

    onSubmitClick() {

        
        const validate = this.validateTab(0);

        if (!validate)
            return false;

        const request = this.getRequest(this.state);

        this.props.ajaxUtil.sendRequest(this.props.url_ChannelPartners.CREATE_URL, request, this.createCheck.bind(this), this.addLoading.bind(this));

        // _postPageRequest('http://10.0.6.25:8080/SalesAndDistribution/entity/v1/create', request, this.createCheck.bind(this), this.addLoading.bind(this));
    }


    // validateAllFields(assignedGroups, fields) {
    //     const that = this;
    //     let hasError = false;
    //     for (let i = 0, len = assignedGroups.length; i < len; i++) {
    //         _.forEach(assignedGroups[i].fields, function (value) {
    //             if (fields[value.name]) {
    //                 const validate = that.validateForm(value.name, that.state[value.name]);
    //                 if (validate) {
    //                     if (hasError === false)
    //                         hasError = validate.hasError;
    //
    //                     fields[value.name].hasError = validate.hasError;
    //                     fields[value.name].errorMsg = validate.errorMsg;
    //                 } else {
    //                     fields[value.name].hasError = false;
    //                     fields[value.name].errorMsg = "";
    //                 }
    //             }
    //         });
    //         const { subGroups } = assignedGroups[i];
    //         const subGroupFields = subGroups && subGroups.length > 0 ? this.validateAllFields(subGroups, fields) : {};
    //         fields = { ...fields, ...subGroupFields.fields }
    //         hasError = subGroupFields.hasError || hasError;
    //     }
    //     return { fields, hasError };
    // }

    getRequest(state) {
        const reqBody = {};

        reqBody.name = state.companyName;
        reqBody.businessRegNo = state.businessRegNo;
        reqBody.taxNo = state.taxNo;
        reqBody.comapnyTypeId = state.comapnyTypeId && state.comapnyTypeId.value;
        reqBody.channelTypeId = state.channelTypeId;
        reqBody.serviceClassId = state.serviceClassId && state.serviceClassId.value;
        reqBody.creditLimit = state.creditLimit;
        // reqBody.creditDays = state.businessRegNo;
        // reqBody.amountRecievable = state.businessRegNo;
        // reqBody.amountPayable = state.businessRegNo;
        reqBody.erpCode = state.erpCode;
        // reqBody.paymentCode = state.businessRegNo;
        reqBody.mobileNo = state.mobileNo;
        reqBody.emailId = state.emailId;
        reqBody.parentId = state.parentEntityId && state.parentEntityId.value;
        reqBody.locations = state.territoryName && state.territoryName.map(location => ({ locationId: location.value }));
        reqBody.latitude = state.latitude;
        reqBody.longitude = state.longitude;
        reqBody.contactPerson = {
            title: state['contactPerson.title'] && state['contactPerson.title'].value,
            firstName: state['contactPerson.firstName'],
            lastName: state['contactPerson.lastName'],
            mobileNo: state['contactPerson.mobileNo'],
            emailId: state['contactPerson.emailId'],
            phoneNo: state['contactPerson.phoneNo']
        };
        reqBody.authorizedPerson = {
            title: state['authorizedPerson.title'] && state['authorizedPerson.title'].value,
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

        // reqBody.products = state.products && state.products.length > 0 && state.products.map(product => ({
        //     productId: product.productId && product.productId.value,
        //     threshold: product.threshold,
        //     msisdn: product.msisdn,
        //     simNo: product.simNo
        // }))
        
        reqBody.products = this.getProductDetailsForRequest(state.products);

        const reqDocuments = [];
        state.documents && state.documents.length > 0 && state.documents.forEach(document => {
            if(document.docId)
                reqDocuments.push({
                    docTypeId: document.docType && document.docType.value,
                    docId: document.docId,
                    docName: document.docName
                })
            }
        )
        reqBody.documents = reqDocuments;

        


        return reqBody;

    }

    getProductDetailsForRequest(products) {
        if (products) {
          let result = [];
          for (let i = 0; i < products.length; i++) {
            let product = products[i];
            if(product.productId && product.productId.value && product.threshold){
              result.push({
                productId: product.productId && product.productId.value,
                threshold: product.threshold,
                msisdn: product.msisdn,
                simNo: product.simNo
              })
            }
          }
          return result.length>0 ? result : null;
        }
        return;
      }

    addLoading(isLoading) {
        this.setState({ isLoading });
    }

    getLoader() {
        if (this.state.isLoading && this.state.isLoading === true) {
            return (
                <div
                    className="loadingActionContainer"
                    style={{
                        background: "rgba(245, 245, 245, 0.56)"
                    }}>
                    <div
                        style={{
                            margin: 'auto',
                            marginTop: '40%',
                            width: '200px'
                        }}>
                        <div className="three-cogs fa-3x">
                            <i className="fa fa-cog fa-spin fa-2x fa-fw"></i>
                            <i className="fa fa-cog fa-spin fa-1x fa-fw"></i>
                            <i className="fa fa-cog fa-spin fa-1x fa-fw"></i>
                        </div>
                    </div>
                </div>
            );
        }
    }


    handleSwitch(data, e) {
        const resetState = this.getPermissions(data.permissions);
        if (e.target.checked) {
            this.setState({
                permissions: {
                    ...this.state.permissions,
                    [data.moduleId]: resetState
                }
            });
        } else {
            this.setState({
                permissions: {
                    ...this.state.permissions,
                    [data.moduleId]: ''
                }
            });
        }
    }
    onCancel() {
        this.setState({ isSuccess: true });
    }
    getPermissions(permissions) {
        const permissionList = [];
        Object
            .keys(permissions)
            .forEach(function (key) {
                const temp = {
                    'value': key,
                    'label': permissions[key]
                }
                permissionList.push(temp);
            });
        return permissionList;
    }


    addProductInput() {
        const products = [...this.state.products];
        products.push({ threshold: '', msisdn: '', simSerialNo: '' });
        this.setState({ products });
    }

    addDocumentInput() {
        const documents = [...this.state.documents];
        documents.push({});
        this.setState({ documents });
    }

    handleProductSelect(value, index) {
        const products = [...this.state.products];
        products[index].productId = value;
        this.setState({ products });
    }

    handleProductInputChange(value, index, name) {
        const products = [...this.state.products];
        products[index][name] = value;
        this.setState({ products });
    }

    handleDocTypeSelect(value, index) {
        const documents = [...this.state.documents];
        documents[index].docType = value;
        this.setState({ documents });
    }

    handleProductRemove(index) {
        const products = [...this.state.products];
        products.splice(index, 1)
        this.setState({ products });
    }

    handleDocumentRemove(index) {
        const documents = [...this.state.documents];
        documents.splice(index, 1);
        this.setState({ documents });
    }

    handleDocumentDrop(files, index) {
        const documents = [...this.state.documents];
        documents[index].file = files[0];
        documents[index].docName = files[0].name;

        const fromData = new FormData();
        fromData.append('file', files[0]);
        fromData.append('fileName', files[0].name);
        this.props.ajaxUtil.sendRequest(this.props.url_ChannelPartners.FILE_STORE, fromData, response => {
            if (response) {
                documents[index].docId = response.docId
            }
            this.setState({ documents });
        }, this.props.loadingFunction, { isShowSuccess: false, isShowFailure: false, isGetFile: true });
    }


    render() {

        if (this.state.isSuccess) {
            return <Redirect to="/channelPartners" />;
        }

        const ProductInput = this.props.productInputComponent;

        return (
            <div className="custom-container">


                <div className="form-tab wizardTab top-padding">
                    <Nav tabs>

                        {
                            this.assignedGroups && this.assignedGroups.map(
                                group => <NavItem key={group.groupId}>
                                    <NavLink
                                        className={classnames({ active: this.state.activeTab === group.groupId }, { done: this.state.tabData.indexOf(this.state.activeTab) > this.state.tabData.indexOf(group.groupId) }, "rounded")}
                                    //onClick={() => { this.setState({ activeTab: group.groupId }); }}
                                    >
                                        {group.name}
                                    </NavLink>
                                </NavItem>
                            )
                        }

                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.state.activeTab === 'products' }, { done: this.state.tabData.indexOf(this.state.activeTab) > this.state.tabData.indexOf('products') }, "rounded")}
                            //onClick={() => { this.setState({ activeTab: 'products' }); }}
                            >
                                Products
                                    </NavLink>
                        </NavItem>

                        <NavItem>
                            <NavLink
                                className={classnames({ active: this.state.activeTab === 'documents' })}
                            //onClick={() => { this.setState({ activeTab: 'documents' }); }}
                            >
                                Documents
                            </NavLink>
                        </NavItem>

                    </Nav>
                    <TabContent activeTab={this.state.activeTab} className="pt-3">

                        {
                            this.assignedGroups && this.assignedGroups.map(
                                (group, index, groupArray) => <TabPane tabId={group.groupId} key={group.groupId}>
                                    {
                                        group.groupId !== BUSINESS_LOCATION_GROUP.GROUPID
                                            ? group.fields && <FormBrick
                                                fieldGroup={group}
                                                {...this.state}
                                                onChange={this.handleInputChange.bind(this)} />
                                            : <TerritoryDetailsForm
                                                hasParent={this.props.match.params.type == 3}
                                                fieldGroup={group}
                                                {...this.state}
                                                onChange={this.handleInputChange.bind(this)}
                                                ajaxUtil={this.props.ajaxUtil}
                                                loadingFunction={this.props.loadingFunction}
                                                setNotification={this.props.setNotification}
                                                url_SalesTerritory={this.props.url_SalesTerritory}
                                            />

                                    }
                                    {
                                        group.subGroups && group.subGroups.length > 0 && (
                                            group.subGroups.map(subGroup => <div key={subGroup.groupId}>
                                                <div className="form-Brick-Head pt-0">
                                                    <span>{subGroup.name}</span>
                                                </div>
                                                <FormBrick
                                                    fieldGroup={subGroup}
                                                    {...this.state}
                                                    onChange={this.handleInputChange.bind(this)} />
                                            </div>
                                            )
                                        )
                                    }


                                    <div className="container-fluid">
                                        {
                                            // (index === groupArray.length - 1) && <Button
                                            //     className="btn-form btn-block-c float-right"
                                            //     color="primary-form"
                                            //     onClick={this.onSubmitClick.bind(this)}>Save</Button>
                                            (index === groupArray.length - 1) && <CustomButton
                                                style={BUTTON_STYLE.BRICK}
                                                type={BUTTON_TYPE.PRIMARY}
                                                size={BUTTON_SIZE.LARGE}
                                                align="right"
                                                label="Next"
                                                isButtonGroup={true}
                                                onClick={() => this.validateTab('products')}
                                            />
                                        }
                                        {
                                            (index < groupArray.length - 1) && <CustomButton
                                                style={BUTTON_STYLE.BRICK}
                                                type={BUTTON_TYPE.PRIMARY}
                                                size={BUTTON_SIZE.LARGE}
                                                align="right"
                                                label="Next"
                                                isButtonGroup={true}
                                                onClick={() => { this.validateTab(groupArray[index + 1].groupId) }}
                                            />
                                        }
                                        {
                                            (index !== 0) && <CustomButton
                                                style={BUTTON_STYLE.BRICK}
                                                type={BUTTON_TYPE.SECONDARY}
                                                size={BUTTON_SIZE.LARGE}
                                                align="right"
                                                label="Previous"
                                                isButtonGroup={true}
                                                onClick={() => this.setState({ activeTab: groupArray[index - 1].groupId })}
                                            />
                                        }
                                        <CustomButton
                                            style={BUTTON_STYLE.BRICK}
                                            type={BUTTON_TYPE.SECONDARY}
                                            size={BUTTON_SIZE.LARGE}
                                            color={COLOR.PRIMARY}
                                            align="right"
                                            label="Cancel"
                                            isButtonGroup={true}
                                            onClick={this.onCancel.bind(this)}
                                        />
                                    </div>
                                </TabPane>
                            )
                        }


                        <TabPane tabId="products">
                            <ProductInput
                                products={this.state.products}
                                addProductInput={this.addProductInput.bind(this)}
                                handleProductSelect={this.handleProductSelect.bind(this)}
                                productOptions={this.state.productOptions}
                                handleProductRemove={this.handleProductRemove.bind(this)}
                                onInputChange={this.handleProductInputChange.bind(this)}
                            />
                            <div className="container-fluid">
                                <CustomButton
                                    style={BUTTON_STYLE.BRICK}
                                    type={BUTTON_TYPE.PRIMARY}
                                    size={BUTTON_SIZE.LARGE}
                                    align="right"
                                    label="Next"
                                    isButtonGroup={true}
                                    onClick={() => this.validateTab('documents')}
                                />
                                <CustomButton
                                    style={BUTTON_STYLE.BRICK}
                                    type={BUTTON_TYPE.SECONDARY}
                                    size={BUTTON_SIZE.LARGE}
                                    color={COLOR.PRIMARY}
                                    align="right"
                                    label="Previous"
                                    isButtonGroup={true}
                                    onClick={() => this.setState({ activeTab: this.assignedGroups[this.assignedGroups.length - 1].groupId })}
                                />
                                 <CustomButton
                                    style={BUTTON_STYLE.BRICK}
                                    type={BUTTON_TYPE.SECONDARY}
                                    size={BUTTON_SIZE.LARGE}
                                    color={COLOR.PRIMARY}
                                    align="right"
                                    label="Cancel"
                                    isButtonGroup={true}
                                    onClick={this.onCancel.bind(this)}
                                />
                            </div>
                        </TabPane>

                        <TabPane tabId="documents">
                            <DocumentInput
                                documents={this.state.documents}
                                onAddInput={this.addDocumentInput.bind(this)}
                                onDocTypeChange={this.handleDocTypeSelect.bind(this)}
                                docTypeOptions={this.state.docTypeOptions}
                                onRemoveInput={this.handleDocumentRemove.bind(this)}
                                onDocumentDrop={this.handleDocumentDrop.bind(this)}
                            />
                            <div className="container-fluid">
                                <CustomButton
                                    style={BUTTON_STYLE.BRICK}
                                    type={BUTTON_TYPE.PRIMARY}
                                    size={BUTTON_SIZE.LARGE}
                                    align="right"
                                    label="Save"
                                    isButtonGroup={true}
                                    onClick={this.onSubmitClick.bind(this)}
                                />
                                <CustomButton
                                    style={BUTTON_STYLE.BRICK}
                                    type={BUTTON_TYPE.SECONDARY}
                                    size={BUTTON_SIZE.LARGE}
                                    color={COLOR.PRIMARY}
                                    align="right"
                                    label="Previous"
                                    isButtonGroup={true}
                                    onClick={() => this.setState({ activeTab: 'products' })}
                                />
                                <CustomButton
                                    style={BUTTON_STYLE.BRICK}
                                    type={BUTTON_TYPE.SECONDARY}
                                    size={BUTTON_SIZE.LARGE}
                                    color={COLOR.PRIMARY}
                                    align="right"
                                    label="Cancel"
                                    isButtonGroup={true}
                                    onClick={this.onCancel.bind(this)}
                                />
                            </div>
                        </TabPane>


                    </TabContent>
                </div>

                <div style={{
                    height: "55px"
                }}></div>
                {this.getLoader()}
            </div>
        );
    }

}
