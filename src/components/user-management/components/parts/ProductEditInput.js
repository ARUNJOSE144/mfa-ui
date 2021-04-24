import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import {
    CustomButton,
    BUTTON_TYPE,
    BUTTON_SIZE,
    BUTTON_STYLE,
    COLOR
} from '@6d-ui/buttons';
import { FieldItem, FIELD_TYPES } from '@6d-ui/fields';

export default class ProductEditInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            action: 0
        }
    }

    handleInputChange = (value, name, obj) => {
        const {isTouched} = obj || {isTouched : false};
        if (!isTouched && value) {
            const { product = {} } = this.state;
            if (name === 'productId' && value) {
                product['type'] = value.type;
                product.productName = value.label;
                value = value.value;
                if(product.type === this.props.url_ProductWithSimMsisdn){
                    product.msisdn = value.msisdn;
                    product.simNo = value.simNo
                }else{
                    product.msisdn = "";
                    product.simNo = ""
                }
            }
            product[name] = value;
            this.setState({ product });
        }
    }

    handleSave = () => {
        const { action, product } = this.state;
        switch (action) {
            case 'edit':
                this.props.handleUpdate ? this.props.handleUpdate(product, this.resetInputs) : this.resetInputs();
                break;

            case 'add':
                this.props.handleSave ? this.props.handleSave(product, this.resetInputs) : this.resetInputs();
                break;

            default:
                break;
        }
    }

    resetInputs = () => {
        this.setState({ action: 0, product: {} })
    }

    getDisabledProductOptions = () => {
        const { productOptions = [] } = this.props;
        const { products = [] } = this.props;
        const selectedProductIds = products.map(prdt => prdt.productId);
        const options = [...productOptions];
        console.log({ options });
        return options.map(option => {
            option.disabled = selectedProductIds.indexOf(option.value) > -1;
            return option;
        });
    }

    render() {
        const { products } = this.props;
        const { product = {} } = this.state;
        return (
            <Container className="bg-white mt-3 pt-3 border">
                {
                    (products && products.length > 0)
                        ? products.map((product, index) => <Row className="mx-0 mb-2">
                            <Col>
                                <FieldItem
                                    label= "Product Name"
                                    type={FIELD_TYPES.VIEW_DETAILS_BOX}
                                    value={product.productName}
                                    placeholder=""
                                    customWidth={"20%"}
                                    />
                            </Col>
                            <Col>
                                <FieldItem
                                    label= "Threshold"
                                    type={FIELD_TYPES.VIEW_DETAILS_BOX}
                                    value={product.threshold}
                                    customWidth={"20%"}
                                    placeholder=""/>
                            </Col>
                            <Col>
                                <FieldItem
                                    label= "Msisdn"
                                    type={FIELD_TYPES.VIEW_DETAILS_BOX}
                                    value={product.msisdn}
                                    customWidth={"20%"}
                                    placeholder=""/>
                            </Col>
                            <Col>
                                <FieldItem
                                    label= "Serial Number"
                                    type={FIELD_TYPES.VIEW_DETAILS_BOX}
                                    value={product.simNo}
                                    customWidth={"20%"}
                                    placeholder=""/>
                            </Col>
                                {/* <lable>&nbsp;</lable> */}
                                <Col style={{marginTop:"1.5rem"}}>
                                    <CustomButton
                                        style={BUTTON_STYLE.BRICK}
                                        type={BUTTON_TYPE.ALERT_SECONDARY}
                                        size={BUTTON_SIZE.MEDIUM_LARGE  }
                                        color={COLOR.SECONDARY}
                                        align="right"
                                        label="Remove"
                                        isButtonGroup={true}
                                        onClick={() => this.props.onRemove({ ...product })}
                                    />
                                    <CustomButton
                                        style={BUTTON_STYLE.BRICK}
                                        type={BUTTON_TYPE.SECONDARY}
                                        size={BUTTON_SIZE.MEDIUM_LARGE  }
                                        color={COLOR.PRIMARY}
                                        align="right"
                                        label="Edit"
                                        isButtonGroup={true}
                                        onClick={() => this.setState({ action: "edit", product: { ...product } })}
                                    />
                                </Col>
                        </Row>
                        )
                        : <Row className="mx-0 mb-2">
                            <Col className="text-center mt-2 mb-2 text-danger fw-600">
                                <span>No results found..!</span>
                            </Col>
                        </Row>
                }
                {
                    this.state.action === 0
                        ? <Row className="mx-0 mb-2 mt-3"><Col className="clearfix mt-3 mr-4">
                            <CustomButton
                                style={BUTTON_STYLE.BRICK}
                                type={BUTTON_TYPE.PRIMARY}
                                size={BUTTON_SIZE.MEDIUM }
                                align="right"
                                label="Add"
                                isButtonGroup={true}
                                onClick={() => this.setState({ action: "add", product: {} })}
                            />
                        </Col>
                        </Row>
                        : <Row className="mx-0 mb-2 mt-3">
                            <Col>
                                <FieldItem
                                    customWidth={"20%"}
                                    type={FIELD_TYPES.DROP_DOWN}
                                    values={this.getDisabledProductOptions()}
                                    value={product && product.productId}
                                    onChange={value => this.handleInputChange(value, "productId")}
                                    label="Product"
                                />
                            </Col>
                            <Col>
                                <FieldItem
                                    label= "Threshold"
                                    type={FIELD_TYPES.TEXT}
                                    value={(product && product.threshold) || ''}
                                    customWidth={"20%"}
                                    onChange={value => this.handleInputChange(value, "threshold")}
                                    placeholder=""/>
                            </Col>
                            {
                                product && product.type === this.props.url_ProductWithSimMsisdn ? <Col>
                                    <FieldItem
                                        label= "MSISDN"
                                        type={FIELD_TYPES.TEXT}
                                        value={(product && product.msisdn) || ''}
                                        customWidth={"20%"}
                                        onChange={value => this.handleInputChange(value, "msisdn")}
                                        placeholder=""/>
                                </Col> : <Col></Col>
                            }
                            {
                                product && product.type === this.props.url_ProductWithSimMsisdn ? <Col>
                                    <FieldItem
                                        label= "Serial Number"
                                        type={FIELD_TYPES.TEXT}
                                        value={(product && product.simNo) || ''}
                                        customWidth={"20%"}
                                        onChange={value => this.handleInputChange(value, "simNo")}
                                        placeholder=""/>
                                </Col> : <Col></Col>
                            }
                            <Col>
                                <lable>&nbsp;</lable>
                                <div>
                                    <CustomButton
                                        style={BUTTON_STYLE.BRICK}
                                        type={BUTTON_TYPE.ALERT_SECONDARY}
                                        size={BUTTON_SIZE.MEDIUM_LARGE }
                                        color={COLOR.SECONDARY}
                                        align="right"
                                        label="Cancel"
                                        isButtonGroup={true}
                                        onClick={this.resetInputs}
                                    />
                                    <CustomButton
                                        style={BUTTON_STYLE.BRICK}
                                        type={BUTTON_TYPE.PRIMARY}
                                        size={BUTTON_SIZE.MEDIUM_LARGE }
                                        align="right"
                                        label="Save"
                                        isButtonGroup={true}
                                        onClick={this.handleSave}
                                    />
                                </div>
                            </Col>
                        </Row>
                }
            </Container >
        )
    }
}

