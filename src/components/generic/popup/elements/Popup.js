import React from 'react';
import { POPUP_ALIGN } from '../constants/Types';
import { Modal, ModalHeader } from 'reactstrap';

const Popup = (props) => {
    const className = `custom-modal ${props.type && props.type === POPUP_ALIGN.RIGHT ? 'right-fixed-modal' : 'center-modal'}${props.className? ` ${props.className}`:''}`;
    const getMinWidth = () => {
      if (props.minWidth) {
        return {
          minWidth:props.minWidth
        }
      }
    }
    const getWidth = () => {
      if (props.width) {
        return {
          width:props.width
        }
      }
    }
    const getHeader = () => {
      if (props.isCustomTitle) {
        return (
          <div>
            {props.title}
          </div>
        )
      } else {
        return (
          <ModalHeader className="primary-background" toggle={() => props.close(0)}>
              {props.title}
          </ModalHeader>
        )
      }
    }
    return (
        <Modal style={{...getMinWidth(), ...getWidth()}} className={className} isOpen={props.isOpen} toggle={() => props.close(0)}>
            {getHeader()}
            {props.component}
        </Modal>
    );
}
export default Popup;
