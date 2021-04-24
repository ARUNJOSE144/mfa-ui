import React from 'react';
import { Container, FormGroup, Label, Input, Col, Row, Button } from 'reactstrap';

const FormCard = props => {
    const disabled = props.isView === true;
    return (
        <Container className="bg-white mt-3 pt-3 border">
            <Row>
                <Col>
                    <FormGroup>
                        <Label for="">Distributor id</Label>
                        <Input type="email" name="email" id="exampleEmail" disabled={disabled} value="12343423243" />
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <Label for="">Distributor Name</Label>
                        <Input disabled={disabled} value="Mobile Queen" />
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <Label for="">Business Reg. No.</Label>
                        <Input disabled={disabled} value="12343423243" />
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <Label for="">Business Reg. No.</Label>
                        <Input disabled={disabled} />
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col>
                    <FormGroup>
                        <Label for="">Business Reg. No.</Label>
                        <Input disabled={disabled} value="12343423243" />
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <Label for="">Business Reg. No.</Label>
                        <Input disabled={disabled} value="12343423243" />
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <Label for="">Distributor No.</Label>
                        <Input disabled={disabled} value="BR343423243" />
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <Label for="">Distributor id</Label>
                        <Input disabled={disabled} value="12343423243" />
                    </FormGroup>
                </Col>
            </Row>

            <Row className="mt-5">
                <Col className="bg-white">
                    <div className="clearfix bg-white border border-right-0 border-bottom-0 border-left-0">
                        {
                            disabled
                                ? <Button onClick={props.toggleIsView} className="btn-form btn-block-c float-right my-2 rounded" color="secondary-form">Edit</Button>
                                : (
                                    <div>
                                        <Button onClick={() => props.toggleIsView(true)} className="btn-form btn-block-c float-right my-2 ml-3 rounded" color="primary-form">Save</Button>
                                        <Button className="btn-form btn-block-c float-right my-2 ml-3 rounded" color="secondary-form">Reset</Button>
                                        <Button onClick={() => props.toggleIsView(true)} className="btn-form btn-block-c float-right my-2 rounded" color="secondary-form">Cancel</Button>
                                    </div>
                                )
                        }
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default FormCard