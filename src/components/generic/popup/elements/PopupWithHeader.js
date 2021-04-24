import React from 'react';
import { POPUP_ALIGN } from '../constants/Types';
import { Modal } from 'reactstrap';

const PopupWithHeader = (props) => {
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
    return (
        <Modal style={{...getMinWidth(), ...getWidth()}} className={className} isOpen={props.isOpen} toggle={() => props.close(0)}>
                {props.title}
            {props.component}
        </Modal>
    );
}
export default PopupWithHeader;
