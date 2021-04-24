import React from 'react';
import BasicAlert from '../../../popup/elements/Alert';

const Alert = ({ setModalPopup, modal = { isOpen: false } }) => {
  const { isOpen, title, content, CancelBtnLabel, confirmBtnLabel, rowId, onConfirmCallBack } = modal;
  const toggle = () => {
    setModalPopup({ isOpen: false })
  }
  return (
    <BasicAlert
      isOpen={isOpen}
      title={title}
      content={content}
      CancelBtnLabel={CancelBtnLabel}
      confirmBtnLabel={confirmBtnLabel}
      rowId={rowId}
      close={toggle}
      onConfirmCallBack={onConfirmCallBack}
    />
  );
}
export default Alert;
