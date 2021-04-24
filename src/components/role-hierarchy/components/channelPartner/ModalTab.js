import React, { Component } from "react";
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  ModalBody,
  Container,
  Row,
  Col,
  Input
} from 'reactstrap';
import classnames from 'classnames';
import Dropzone from 'react-dropzone'
import {FieldItem, FIELD_TYPES} from "@6d-ui/fields";
import { CustomButton, BUTTON_SIZE, BUTTON_STYLE, BUTTON_TYPE} from '@6d-ui/buttons';
import {DocumentViewer, DocumentCard} from '@6d-ui/ui-helpers';

import FormBrick from './FormBrick';
import { BUSINESS_LOCATION_GROUP } from '../util/ChannelTypeFields';
import TerritoryDetailsForm from './TerritoryDetailsForm';

import { expandSelectedValue, reduceSelectedOption } from '../util/util';

const DECIMAL_REGEX = /^[+-]?\d+(\.\d+)?$/;
const MSISDN_REGEX = /^[0-9]{8,12}$/

export default class ProfileTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: this.props.assignedGroups && this.props.assignedGroups[0].groupId,
      windowHeight: 0,
      isView: true,
      // products: products.map(product => { product.productId = { value: product.productId, label: '' }; return product }),
      newDocument: {},
      actionProduct: {
        action: 0,
        value: {}
      }
    };
    this.toggle = this.toggle.bind(this);
    this.toggleIsView = this.toggleIsView.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.renderProductRows = this.renderProductRows.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.handleProductInputChange = this.handleProductInputChange.bind(this);
    this.saveProduct = this.saveProduct.bind(this);
    this.saveDocument = this.saveDocument.bind(this);
    this.getDisabledProductOptions = this.getDisabledProductOptions.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);

    const that = this;

    this.props.ajaxUtil.sendRequest(
      this.props.url_DocType.LIST_URL,
      {
        searchParams: {
          pageNumber: 1,
          rowCount: 20,
          orderByCol: "doccTypeId",
          sort: "asc",
          keyword: ""
        }
      },
      (response, hasError) => {
        // this.props.ajaxUtil.sendRequest(DOCTYPE.LIST_URL, {}, response => {
        if (response && !hasError) {
          const { searchResponse: { rowData = [] } } = response;
          this.setState({
            docTypeOptions: rowData.map(({ rowId, columnValues }) => ({
              label: columnValues[1].value,
              value: rowId
            }))
          });
        }
      },
      this.props.loadingFunction,
      { method: "POST", isShowSuccess: false }
    );

    // this.props.ajaxUtil.sendRequest(GET_PRODUCTS_URL, {}, response => {
    // that.setState({ productOptions: [{ value: 1, label: "voucher" }, { value: 2, label: "SIM" }, { value: 3, label: "ESIM" }, { value: 4, label: "#4 voucher" }] });
    this.props.ajaxUtil.sendRequest(this.props.url_ChannelPartners.LIST_ALL_PRODUCTS, {}, response => {
      if (response) {
        let productOptions = response.map(
          ({ productId, productName, type }) => ({
            label: productName,
            value: productId,
            type: type
          })
        );
        that.setState({ productOptions });
      }
    }, this.props.loadingFunction, { method: "GET", isShowSuccess: false });
  }

  componentWillReceiveProps(nextProps) {
    nextProps.updatedAt !== this.state.updatedAt &&
      this.setState({ isView: true, updatedAt: nextProps.updatedAt });
  }

  toggle(tab) {
    this.state.activeTab !== tab && this.setState({ activeTab: tab });
  }

  toggleIsView(isView, resetCase) {
    let additionalProps = {};
    switch (resetCase) {
      case 'products':
        additionalProps = { actionProduct: { action: 0, product: {} } }
        break;

      default:
        break;
    }

    this.setState({ isView: !this.state.isView, ...additionalProps });
  }

  updateWindowDimensions() {
    this.setState({ windowHeight: window.innerHeight });
  }

  toggleModal(modal) {
    modal = modal || null;
    this.setState({ modal });
  }

  addProductInput() {
    const products = [...this.state.products];
    products.push({ threshold: "", msisdn: "", simSerialNo: "" });
    this.setState({ products });
  }

  handleProductSelect(value, index) {
    const products = [...this.state.products];
    products[index].productId = value;
    this.setState({ products });
  }

  // handleProductInputChange(value, name, type) {
  //   const { actionProduct } = this.state;
  //   actionProduct.product = actionProduct.product || {};
  //   actionProduct.product[name] = type ? value && value.value : value;
  //   this.setState({ actionProduct });
  // }
  handleProductInputChange(name, value, obj) {
    const { isTouched } = obj || { isTouched: false };
    if (isTouched) return;

    const { actionProduct } = this.state;
    actionProduct.product = actionProduct.product || {};

    if (name === 'productId') actionProduct.product[name] = reduceSelectedOption(value);
    else actionProduct.product[name] = value;

    this.setState({ actionProduct });
  }

  handleProductRemove(index) {
    const products = [...this.state.products];
    products.splice(index, 1)
    this.setState({ products });
  }

  handleDocTypeChange(value,obj) {
    const { isTouched } = obj || { isTouched: false };
    if (isTouched) return;
    
    const { newDocument } = this.state;
    newDocument.docType = value;
    this.setState({ newDocument });
  }

  onDrop(files) {
    const { newDocument } = this.state;
    newDocument.file = files[0];
    newDocument.docName = files[0].name;
    this.setState({ newDocument });
  }

  saveDocument() {
    const { entityId } = this.props;
    const { newDocument } = this.state;

    if (!newDocument.docType || !newDocument.docType.value || !newDocument.file) {
      this.props.setNotification({
        message: "Please Enter all document details",
        hasError: true
      });
      return;
    }

    const fromData = new FormData();
    fromData.append("file", newDocument.file);
    this.props.ajaxUtil.sendRequest(`${this.props.url_ChannelPartners.SAVE_DOCUMENT}${entityId}&docType=${newDocument.docType && newDocument.docType.value}`,
      fromData,
      response => {
        if (response) {
          const newDocument = {};
          this.setState({ newDocument, isView: true });
          this.props.fetchDocuments();
        }
      }, this.props.loadingFunction, { isGetFile: true }
    );
  }

  deleteDocument(docId) {
    this.props.ajaxUtil.sendRequest(
      `${this.props.url_ChannelPartners.DELETE_DOCUMENT}/${docId}`,
      {},
      response => {
        if (response) {
          this.props.fetchDocuments();
        }
      },
      this.setLoader,
      { method: "DELETE" }
    );
  }

  deleteProduct(id) {
    this.props.ajaxUtil.sendRequest(
      `${this.props.url_ChannelPartners.DELETE_PRODUCTS}/${this.props.entityId}/${id}`,
      {},
      response => {
        if (response) {
          this.props.fetchProducts();
        }
      },
      this.setLoader,
      { method: "DELETE" }
    );
  }

  saveProduct() {
    const { actionProduct } = this.state;
    const { product } = actionProduct;
    const isValid = this.validateProducts(product)
    if (!isValid) return;
    switch (actionProduct.action) {
      case "edit":
        this.props.ajaxUtil.sendRequest(
          `${this.props.url_ChannelPartners.UPDATE_PRODUCTS}/${this.props.entityId}`,
          { ...product },
          response => {
            if (response) {
              actionProduct.value = {};
              actionProduct.product = {};
              actionProduct.action = 0;
              this.setState({ actionProduct, isView: true });
              this.props.fetchProducts();
            }
          },
          this.setLoader,
          { method: "POST", isShowSuccess: false }
        );
        break;

      case "add":
        this.props.ajaxUtil.sendRequest(
          `${this.props.url_ChannelPartners.ADD_PRODUCTS}/${this.props.entityId}`,
          { ...product },
          response => {
            if (response) {
              actionProduct.value = {};
              actionProduct.product = {};
              this.setState({ actionProduct });
              this.props.fetchProducts();
            }
          },
          this.setLoader,
          { method: "POST", isShowSuccess: false }
        );

        break;

      default:
        break;
    }
  }

  validateProducts(product) {
    let error = { hasError: false, errorMsg: "" };
    if (!product.productId) {
      error.hasError = true;
      error.errorMsg = "Please select a valid product";
    } else if (!product.threshold) {
      error.hasError = true;
      error.errorMsg = "Please enter valid threshold";

    } else if (!DECIMAL_REGEX.test(product.threshold)) {
      error.hasError = true;
      error.errorMsg = "Please enter valid threshold";

    } else if (product.msisdn && !MSISDN_REGEX.test(product.msisdn)) {
      error.hasError = true;
      error.errorMsg = "Please enter valid msisdn with length 8-15";
    }

    if (error.hasError) {
      this.props.setNotification({
        message: error.errorMsg,
        hasError: true
      });
      return false;
    }
    return true;
  }


  downloadDocument(docId) {
    // _downloadFile(`${this.props.url_ChannelPartners.FILE_VIEW}/${this.props.entityId}/doc/${docId}`);
  }

  getDisabledProductOptions() {
    const { productOptions } = this.state;
    const { products } = this.props;
    const selectedProductIds = products.map(prdt => prdt.productId);
    const options = [...productOptions];
    return options.map(option => {
      option.disabled = selectedProductIds.indexOf(option.value) > -1;
      return option;
    });
  }

  setLoader = isLoading => this.setState({ isLoading });

  renderProductRows() {
    const { products = [] } = this.props;
    if (!products || products.length === 0)
      return <div className="text-danger text-center w-100 pb-3">No products...</div>;

    return products.map((product, index) => (
      <Row className="mx-0 mb-2" key={product.id}>
        <Col>
          <label>Product Name</label>
          <Input disabled value={product.productName || ''} />
        </Col>
        <Col>
          <label>Threshold</label>
          <Input disabled value={product.threshold || ''} />
        </Col>
        <Col>
          <label>msisdn</label>
          <Input disabled value={product.msisdn || ''} />
        </Col>
        <Col>
          <label>Serial Number</label>
          <Input disabled value={product.simNo || ''} />
        </Col>
        <Col>
          <label>&nbsp;</label>
          <div>
            {this.state.isView !== true && (
              // <Button
              //   size="sm"
              //   onClick={() =>
              //     this.setState({
              //       actionProduct: { action: "edit", product: { ...product } }
              //     })
              //   }
              //   outline
              //   color="primary"
              //   style={{ minWidth: "70px" }}
              //   className="ml-2 float-left"
              // >
              //   Edit
              // </Button>
              <CustomButton
                style={BUTTON_STYLE.BRICK}
                type={BUTTON_TYPE.SECONDARY}
                size={BUTTON_SIZE.SMALL}
                align="right"
                label="Edit"
                isButtonGroup={true}
                onClick={() => this.setState({ actionProduct: { action: "edit", product: { ...product } } })}
              />
            )}
            {this.state.isView !== true && (
              // <Button
              //   size="sm"
              //   onClick={() =>
              //     this.props.getPopup({
              //       case: "remove-product",
              //       rowId: product.id,
              //       callBack: this.deleteProduct.bind(this)
              //     })
              //   }
              //   outline
              //   style={{ minWidth: "70px" }}
              //   className="ml-2 float-left"
              // >
              //   Remove
              // </Button>
              <CustomButton
                style={BUTTON_STYLE.BRICK}
                type={BUTTON_TYPE.SECONDARY}
                size={BUTTON_SIZE.SMALL}
                align="right"
                label="Remove"
                isButtonGroup={true}
                onClick={() =>
                  this.props.getPopup({
                    case: "remove-product",
                    rowId: product.id,
                    callBack: this.deleteProduct.bind(this)
                  })
                }
              />
            )}
          </div>
        </Col>
      </Row>
    ));
  }

  renderLoader = () => {
    if (this.state.isLoading && this.state.isLoading === true) {
      return (
        <div
          className="loadingActionContainer"
          style={{ background: "rgba(245, 245, 245, 0.56)" }}
        >
          <div style={{ margin: "auto", marginTop: "20%", width: "200px" }}>
            <div className="three-cogs fa-3x">
              <i className="fa fa-cog fa-spin fa-2x fa-fw" />
              <i className="fa fa-cog fa-spin fa-1x fa-fw" />
              <i className="fa fa-cog fa-spin fa-1x fa-fw" />
            </div>
          </div>
        </div>
      );
    }
  }

  render() {
    const { assignedGroups, documents = [] } = this.props;
    const { modal } = this.state;
    const modalCase = modal && modal.case;
    const height = {
      height: this.state.windowHeight - 131
    };

    const actionProduct = this.state.actionProduct.product;
    const dzStyle = {
      width: "100px",
      padding: "5px 10px",
      marginRight: "8px",
      border: "1px solid",
      color: "#0096DE",
      cursor: "pointer",
      textAlign: "center",
      lineHeight: 1.5,
      fontSize: "1rem"
    };
    return (
      <ModalBody className="px-4 py-4">
        <div className="form-tab wizardTab overlay_position" style={height}>
          <Nav tabs>
            {assignedGroups &&
              assignedGroups.map(group => (
                <NavItem key={group.groupId}>
                  <NavLink
                    className={classnames({
                      active: this.state.activeTab === group.groupId
                    }, { done: this.props.tabData && this.props.tabData.indexOf(this.state.activeTab) > this.props.tabData.indexOf(group.groupId) }, "rounded")}
                    onClick={() => {
                      this.setState({ activeTab: group.groupId });
                    }}
                  >
                    {group.name}
                  </NavLink>
                </NavItem>
              ))}
            <NavItem>
              <NavLink
                className={classnames({
                  active: this.state.activeTab === "products"
                }, { done: this.props.tabData && this.props.tabData.indexOf(this.state.activeTab) > this.props.tabData.indexOf("products") }, "rounded")}
                onClick={() => {
                  this.setState({ activeTab: "products" });
                }}
              >
                Products
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
                  active: this.state.activeTab === "documents"
                }, { done: this.props.tabData && this.props.tabData.indexOf(this.state.activeTab) > this.props.tabData.indexOf("documents") }, "rounded")}
                onClick={() => {
                  this.setState({ activeTab: "documents" });
                }}
              >
                Documents
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={this.state.activeTab} className="pt-3">
            {assignedGroups &&
              assignedGroups.map((group, index, groupArray) => (
                <TabPane tabId={group.groupId} key={group.groupId}>
                  {
                    group.groupId !== BUSINESS_LOCATION_GROUP.GROUPID
                      ? group.fields && <FormBrick
                        isView={this.state.isView}
                        fieldGroup={group}
                        {...this.props}
                        onChange={this.props.handleInputChange}
                      // onChange={this.handleInputChange.bind(this)}
                      />
                      : <TerritoryDetailsForm
                        hasParent={this.props.parentEntityTypeId === 3}
                        isView={this.state.isView}
                        fieldGroup={group}
                        {...this.props}
                        onChange={this.props.handleInputChange}
                        setNotification={this.props.setNotification}
                        ajaxUtil={this.props.ajaxUtil}
                        loadingFunction={this.props.loadingFunction}
                        url_SalesTerritory={this.props.url_SalesTerritory}
                      />
                  }
                  {group.subGroups &&
                    group.subGroups.length > 0 &&
                    group.subGroups.map(subGroup => (
                      <div key={subGroup.groupId}>
                        <div className="form-Brick-Head pt-0">
                          <span>{subGroup.name}</span>
                        </div>
                        <FormBrick
                          isView={this.state.isView}
                          fieldGroup={subGroup}
                          {...this.props}
                          onChange={this.props.handleInputChange}
                        />
                      </div>
                    ))}

                  <div className="clearfix bg-white border border-right-0 border-bottom-0 border-left-0 p-2">
                    {this.state.isView === true ? (
                      // <Button
                      //   onClick={this.toggleIsView}
                      //   className="btn-form btn-block-c float-right my-2 rounded"
                      //   color="secondary-form"
                      // >
                      //   Edit
                      // </Button>
                      <CustomButton
                        style={BUTTON_STYLE.BRICK}
                        type={BUTTON_TYPE.SECONDARY}
                        size={BUTTON_SIZE.LARGE}
                        align="right"
                        label="Edit"
                        isButtonGroup={true}
                        onClick={this.toggleIsView}
                      />
                    ) : (
                        [
                          // <Button
                          //   key="1"
                          //   onClick={this.props.onUpdateSubmit}
                          //   className="btn-form btn-block-c float-right my-2 ml-3 rounded"
                          //   color="primary-form"
                          // >
                          //   Save
                          // </Button>
                          <CustomButton
                            key="1"
                            style={BUTTON_STYLE.BRICK}
                            type={BUTTON_TYPE.PRIMARY}
                            size={BUTTON_SIZE.LARGE}
                            align="right"
                            label="Save"
                            isButtonGroup={true}
                            onClick={this.props.onUpdateSubmit}
                          />,
                          // <Button
                          //   key="3"
                          //   onClick={this.toggleIsView}
                          //   className="btn-form btn-block-c float-right my-2 rounded"
                          //   color="secondary-form"
                          // >
                          //   Cancel
                          // </Button>
                          <CustomButton
                            key="2"
                            style={BUTTON_STYLE.BRICK}
                            type={BUTTON_TYPE.SECONDARY}
                            size={BUTTON_SIZE.LARGE}
                            align="right"
                            label="Cancel"
                            isButtonGroup={true}
                            onClick={this.toggleIsView}
                          />
                        ]
                      )}
                  </div>
                </TabPane>
              ))}
            <TabPane tabId="products">
              <div className="form-Brick-Head pt-0">
                <span>Products</span>
              </div>
              <Container className="form-Brick-body mb-3">
                {this.renderProductRows()}
                {this.state.isView !== true &&
                  this.state.actionProduct.action === 0 && (
                    <Row>
                      <Col>
                        {/* <Button
                          size="sm"
                          onClick={() =>
                            this.setState({
                              actionProduct: { action: "add", product: {} }
                            })
                          }
                          outline
                          color="primary"
                          style={{ width: "100px" }}
                          className="ml-2 float-right"
                        >
                          Add
                        </Button> */}
                        <CustomButton
                          style={BUTTON_STYLE.BRICK}
                          type={BUTTON_TYPE.SECONDARY}
                          size={BUTTON_SIZE.SMALL}
                          align="right"
                          label="Add"
                          isButtonGroup={true}
                          onClick={() => this.setState({ actionProduct: { action: "add", product: {} } })}
                        />
                      </Col>
                    </Row>
                  )}

                {this.state.isView !== true &&
                  this.state.actionProduct.action !== 0 && (
                    <div className="clearfix bg-white border border-right-0 border-bottom-0 border-left-0 mt-2">
                      <Row className="mx-0 mb-2 mt-3">
                        <Col>
                          <label>Product</label>
                          {/* <Select
                            // options={this.state.productOptions}
                            options={this.getDisabledProductOptions()}
                            value={actionProduct && actionProduct.productId}
                            onChange={value =>
                              this.handleProductInputChange(
                                value,
                                "productId",
                                1
                              )
                            }
                          /> */}
                          <FieldItem
                            type="1"
                            values={this.getDisabledProductOptions()}
                            value={expandSelectedValue((actionProduct && actionProduct.productId), this.getDisabledProductOptions())}
                            getOnlyInput={true}
                            onChange={this.handleProductInputChange.bind(null, 'productId')}
                          />
                        </Col>
                        <Col>
                          <label>Threshold</label>
                          {/* <Input
                            value={actionProduct && actionProduct.threshold ? actionProduct.threshold : ''}
                            onChange={evt =>
                              this.handleProductInputChange(
                                evt.target.value,
                                "threshold"
                              )
                            }
                          /> */}
                          <FieldItem
                            type={FIELD_TYPES.TEXT}
                            value={actionProduct && actionProduct.threshold ? actionProduct.threshold : ''}
                            getOnlyInput={true}
                            onChange={this.handleProductInputChange.bind(null, 'threshold')}
                          />
                        </Col>
                        <Col>
                          <label>msisdn</label>
                          {/* <Input
                            value={actionProduct && actionProduct.msisdn ? actionProduct.msisdn : ''}
                            onChange={evt =>
                              this.handleProductInputChange(
                                evt.target.value,
                                "msisdn"
                              )
                            }
                          /> */}
                          <FieldItem
                            type={FIELD_TYPES.TEXT}
                            value={actionProduct && actionProduct.msisdn ? actionProduct.msisdn : ''}
                            getOnlyInput={true}
                            onChange={this.handleProductInputChange.bind(null, 'msisdn')}
                          />
                        </Col>
                        <Col>
                          <label>Serial Number</label>
                          {/* <Input
                            value={actionProduct && actionProduct.simNo ? actionProduct.simNo : ''}
                            onChange={evt =>
                              this.handleProductInputChange(
                                evt.target.value,
                                "simNo"
                              )
                            }
                          /> */}
                          <FieldItem
                            type={FIELD_TYPES.TEXT}
                            value={actionProduct && actionProduct.simNo ? actionProduct.simNo : ''}
                            getOnlyInput={true}
                            onChange={this.handleProductInputChange.bind(null, 'simNo')}
                          />
                        </Col>
                        <Col>
                          <label>&nbsp;</label>
                          <div>
                            {/* <Button
                              size="sm"
                              onClick={}
                              outline
                              color="primary"
                              style={{ minWidth: "70px" }}
                              className="ml-2 float-left"
                            >
                              Cancel
                            </Button> */}
                            <CustomButton
                              style={BUTTON_STYLE.BRICK}
                              type={BUTTON_TYPE.SECONDARY}
                              size={BUTTON_SIZE.SMALL}
                              align="right"
                              label="Cancel"
                              isButtonGroup={true}
                              onClick={() => this.setState({ actionProduct: { action: 0, product: {} } })}
                            />
                            {/* <Button size="sm" onClick={() => console.log()} outline style={{ minWidth: '70px' }} className="ml-2 float-left">Clear</Button> */}
                          </div>
                        </Col>
                      </Row>
                    </div>
                  )}

                <div className="clearfix bg-white border border-right-0 border-bottom-0 border-left-0 pt-2">
                  {this.state.isView === true ? (
                    <CustomButton
                      style={BUTTON_STYLE.BRICK}
                      type={BUTTON_TYPE.SECONDARY}
                      size={BUTTON_SIZE.LARGE}
                      align="right"
                      label="Edit"
                      isButtonGroup={true}
                      onClick={this.toggleIsView}
                    />
                  ) : (
                      [
                        this.state.actionProduct.action !== 0 ? (
                          // <Button
                          //   key="1"
                          //   onClick={this.saveProduct}
                          //   className="btn-form btn-block-c float-right my-2 ml-3 rounded"
                          //   color="primary-form"
                          // >
                          //   Save
                          // </Button>
                          <CustomButton
                            key="1"
                            style={BUTTON_STYLE.BRICK}
                            type={BUTTON_TYPE.PRIMARY}
                            size={BUTTON_SIZE.LARGE}
                            align="right"
                            label="Save"
                            isButtonGroup={true}
                            onClick={this.saveProduct}
                          />
                        ) : null,
                        // <Button key="2" className="btn-form btn-block-c float-right my-2 ml-3 rounded" color="secondary-form">Reset</Button>,
                        // <Button
                        //   key="3"
                        //   onClick={() => this.toggleIsView(false,'products')}
                        //   className="btn-form btn-block-c float-right my-2 rounded"
                        //   color="secondary-form"
                        // >
                        //   Cancel
                        // </Button>
                        <CustomButton
                          key="3"
                          style={BUTTON_STYLE.BRICK}
                          type={BUTTON_TYPE.SECONDARY}
                          size={BUTTON_SIZE.LARGE}
                          align="right"
                          label="Cancel"
                          isButtonGroup={true}
                          onClick={() => this.toggleIsView(false, 'products')}
                        />
                      ]
                    )}
                </div>
              </Container>
            </TabPane>
            <TabPane tabId="documents">
              <div className="form-Brick-Head pt-0">
                <span>Available Documents</span>
              </div>
              <Container className="form-Brick-body mb-3">
                <Row>
                  {/* <DocumentCard deleteCallBack={this.deleteDocument.bind(this)} onDeleteClick={this.props.getPopup} onViewClick={() => this.toggleModal('documentView')} isView={this.state.isView}/>
                                    <DocumentCard deleteCallBack={this.deleteDocument.bind(this)} onDeleteClick={this.props.getPopup} onViewClick={() => this.toggleModal('documentView')} isView={this.state.isView}/>
                                    <DocumentCard deleteCallBack={this.deleteDocument.bind(this)} onDeleteClick={this.props.getPopup} onViewClick={() => this.toggleModal('documentView')} isView={this.state.isView}/> */}
                  {
                    documents && documents.length > 0 ? documents.map(doc => (
                      <DocumentCard
                        key={doc.docId}
                        {...doc}
                        deleteCallBack={this.deleteDocument.bind(this)}
                        onDeleteClick={this.props.getPopup}
                        onViewClick={this.toggleModal.bind(this)}
                        onDownload={this.downloadDocument.bind(this)}
                        isView={this.state.isView}
                      />

                    ))
                      : <div className="text-danger text-center w-100">No documents...</div>
                  }
                </Row>
              </Container>
              {this.state.isView !== true && (
                <Container className="form-Brick-body mb-3">
                  <Row className="mx-0 mb-2">
                    <FieldItem
                      width="md"
                      type="1"
                      values={this.state.docTypeOptions}
                      value={this.state.newDocument.docType}
                      onChange={this.handleDocTypeChange.bind(this)}
                      label="Document Type"
                    />
                    <Col md="4">
                      <label className="form-control-label">
                        Document Name
                      </label>
                      <input
                        disabled
                        className="form-control"
                        value={
                          this.state.newDocument.file &&
                          this.state.newDocument.file.name
                        }
                        style={{ borderColor: "#cccccc" }}
                      />
                    </Col>
                    <Col md="4">
                      <label className="form-control-label">&nbsp;</label>
                      <div className="onClick={() => onRemove(index)}">
                        <Dropzone
                          style={dzStyle}
                          onDrop={this.onDrop.bind(this)}
                          className="fs-600 float-left"
                        >
                          <span>Browse</span>
                        </Dropzone>
                        <CustomButton
                          style={BUTTON_STYLE.BRICK}
                          type={BUTTON_TYPE.SECONDARY}
                          size={BUTTON_SIZE.MEDIUM_LARGE}
                          align="left"
                          label="Clear"
                          isButtonGroup={true}
                          onClick={() => this.setState({ newDocument: {} })}
                        />
                      </div>
                    </Col>
                  </Row>
                </Container>
              )}

              <div className="clearfix bg-white border border-right-0 border-bottom-0 border-left-0 p-2">
                {this.state.isView === true ? (
                  // <Button
                  //   onClick={this.toggleIsView}
                  //   className="btn-form btn-block-c float-right my-2 rounded"
                  //   color="secondary-form"
                  // >
                  //   Edit
                  // </Button>
                  <CustomButton
                    style={BUTTON_STYLE.BRICK}
                    type={BUTTON_TYPE.SECONDARY}
                    size={BUTTON_SIZE.LARGE}
                    align="right"
                    label="Edit"
                    isButtonGroup={true}
                    onClick={this.toggleIsView}
                  />
                ) : (
                    [
                      // <Button
                      //   key="1"
                      //   onClick={this.saveDocument}
                      //   className="btn-form btn-block-c float-right my-2 ml-3 rounded"
                      //   color="primary-form"
                      // >
                      //   Save
                      // </Button>
                      <CustomButton
                        key="1"
                        style={BUTTON_STYLE.BRICK}
                        type={BUTTON_TYPE.PRIMARY}
                        size={BUTTON_SIZE.LARGE}
                        align="right"
                        label="Save"
                        isButtonGroup={true}
                        onClick={this.saveDocument}
                      />,
                      // <Button key="2" className="btn-form btn-block-c float-right my-2 ml-3 rounded" color="secondary-form">Reset</Button>,
                      // <Button
                      //   key="3"
                      //   onClick={this.toggleIsView}
                      //   className="btn-form btn-block-c float-right my-2 rounded"
                      //   color="secondary-form"
                      // >
                      //   Cancel
                      // </Button>
                      <CustomButton
                        key="2"
                        style={BUTTON_STYLE.BRICK}
                        type={BUTTON_TYPE.SECONDARY}
                        size={BUTTON_SIZE.LARGE}
                        align="right"
                        label="Cancel"
                        isButtonGroup={true}
                        onClick={this.toggleIsView}
                      />
                    ]
                  )}
              </div>
              {/* </Container> */}
            </TabPane>
          </TabContent>
        </div>
        <DocumentViewer
          isOpen={modalCase === 'documentView'}
          srcPath={modal && `${this.props.url_ChannelPartners.FILE_VIEW}/${this.props.entityId}/doc/${modal.docId}`}
          toggleModal={this.toggleModal}
          ajaxUtil={this.props.ajaxUtil}
          loadingFunction={this.props.loadingFunction}
        />
        {this.renderLoader()}
      </ModalBody>
    );
  }
}
