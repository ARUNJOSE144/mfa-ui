import React from 'react';
import { Container, Row, Col, Input, Button } from 'reactstrap';
import { FieldItem } from '@6d-ui/fields';

let PRODUCT_WITH_MSISDN;

const getEnabledOption = (options,products) => {
    const selectedOpts = products.map(product => (product && product.productId) ? product.productId.value : null);
    return options  ? options.map(option => {
        option.disabled = selectedOpts.indexOf(option.value)>=0;
        return option;
    }): [];
}

const ProductRow = props => {
    const { product, options, onSelectChange, onInputChange, onRemove, index } = props;
    const handleSelectChange = (value,obj) => {
        const { isTouched } = obj || { isTouched: false };
        if (isTouched) return;
        onSelectChange(value, index);    
    }
    return (
        <Row className="mx-0 mb-2">
            <Col>
                <FieldItem
                    type="1"
                    values={options}
                    value={product.productId && (product.productId.label ? product.productId : product.productId.value)}
                    getOnlyInput={true}
                    onChange={handleSelectChange}
                />
            </Col>
            <Col>
                <Input className="mandatory-field" disabled={props.isView} value={product.threshold} onChange={e=>onInputChange(e.target.value,index,"threshold")}/>
            </Col>
            <Col>
                {product && product.productId && PRODUCT_WITH_MSISDN === product.productId.type && <Input disabled={props.isView} onChange={e=>onInputChange(e.target.value,index,"msisdn")} value={product.msisdn}/>}
            </Col>
            <Col>
                {product && product.productId && PRODUCT_WITH_MSISDN === product.productId.type && <Input disabled={props.isView} onChange={e=>onInputChange(e.target.value,index,"simNo")} value={product.simNo}/>}
            </Col>
            <Col style={{ flex: '0 0 60px' }}>
                {
                    !props.isView && <Button className="close custom-close" onClick={() => onRemove(index)}>
                        <span aria-hidden="true">&times;</span>
                    </Button>
                }
            </Col>
        </Row>
    )
}

const ProductInput = props => {
    const { products=[], handleProductSelect, handleProductRemove, onInputChange, isView } = props;
    const productOptions = getEnabledOption(props.productOptions,products)
    PRODUCT_WITH_MSISDN = props.productWithMsisdn
    return (
        <Container className="form-Brick-body mb-3">
            <Row className="mx-0">
                <Col>
                    <label>Product</label>
                </Col>
                <Col>
                    <label>Threshold</label>
                </Col>
                <Col>
                    <label>MSISDN</label>
                </Col>
                <Col>
                    <label>Sim Serial No</label>
                </Col>
                <Col style={{ flex: '0 0 60px' }}>

                </Col>
            </Row>
            {
                products && products.map((product, index) => <ProductRow
                    key={index}
                    product={product}
                    index={index}
                    options={productOptions}
                    onSelectChange={handleProductSelect}
                    onRemove={handleProductRemove}
                    onInputChange={onInputChange}
                    isView={isView} />)
            }
            <Row>
                <Col className="clearfix mt-3 mr-4">
                    {
                        !props.isView && <Button
                            color="primary"
                            className="btn-dataTable float-right"
                            onClick={props.addProductInput}
                            disabled={productOptions.length <= products.length}>Add</Button>
                    }
                </Col>
            </Row>

        </Container>
    )
}

export default ProductInput;