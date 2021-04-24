import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from 'reactstrap';
/* import { CustomButton, BUTTON_STYLE, BUTTON_TYPE, BUTTON_SIZE, COLOR } from '@6d-ui/buttons'; */

import { CustomButton } from '../../buttons/elements/CustomButton';
import { BUTTON_STYLE, BUTTON_TYPE, BUTTON_SIZE, COLOR } from '../../buttons/elements/ButtonTypes';


const BasicAlert = (props) => {
  return (
    <Modal className="center-alert_box" isOpen={props.isOpen} toggle={() => props.close(0)} modalTransition={{ timeout: 20 }} backdropTransition={{ timeout: 10 }}>
      <ModalHeader toggle={() => props.close(0)}>
        {props.title}
      </ModalHeader>
      <ModalBody>
        <Row>
          <Col xl="2" className="alert_ico text-right">
            <i className="fa fa-exclamation-triangle"></i>
          </Col>
          <Col xl="10" className="alert_text d-flex align-items-center">
            {props.content}
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <CustomButton
          style={BUTTON_STYLE.BRICK}
          type={BUTTON_TYPE.ALERT_SECONDARY}
          size={BUTTON_SIZE.MEDIUM_LARGE}
          color={COLOR.SECONDARY}
          align="right"
          label={props.CancelBtnLabel || "Cancel"}
          isButtonGroup={true}
          onClick={() => props.close(0)}
        />
        <CustomButton
          style={BUTTON_STYLE.BRICK}
          type={BUTTON_TYPE.ALERT_PRIMARY}
          size={BUTTON_SIZE.MEDIUM_LARGE}
          align="right"
          label={props.confirmBtnLabel || "Confirm"}
          isButtonGroup={true}
          onClick={() => { props.close(0); props.onConfirmCallBack(props.rowId); }}
        />
      </ModalFooter>
    </Modal>
  );
}
export default BasicAlert;
