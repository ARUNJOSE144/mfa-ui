import React from 'react';
import {BUTTON_STYLE, BUTTON_TYPE, BUTTON_SIZE, BUTTON_ALIGN,COLOR} from './ButtonTypes';

export const CustomButton = ({type, style, size, icon, label, onClick, align, isButtonGroup, isMarginRequired, width,color,disabled=false,css,stt}) => {


  const getStyleClass = () => {
    switch (style) {
      case BUTTON_STYLE.BRICK:
        return 'btn-block-c';
      case BUTTON_STYLE.ROUNDED:
        return 'btn-round';
      default:
        return 'btn';
    }
  }
  const getTypeClass = () => {
    switch (type) {
      case BUTTON_TYPE.PRIMARY:
        return 'custom-btn-primary';
      case BUTTON_TYPE.SECONDARY:
        return 'custom-btn-secondary';
      case BUTTON_TYPE.ALERT_PRIMARY:
        return 'btn-alert-primary';
      case BUTTON_TYPE.ALERT_SECONDARY:
        return 'btn-alert-secondary';
      default:
        return '';
    }
  }
  const getSizeClass = () => {
    switch (size) {
      case BUTTON_SIZE.SMALL:
        return 'btn-sm';
      case BUTTON_SIZE.MEDIUM:
        return 'btn-md';
      case BUTTON_SIZE.LARGE:
        return 'btn-lg';
      case BUTTON_SIZE.MEDIUM_LARGE:
        return 'btn-md-lg';
      default:
        return '';
    }
  }
  const getButtonWidth = () => {
    switch (width) {
      case BUTTON_ALIGN.INHERIT:
        return 'btn-width-inherit';
      default:
        return '';
    }
  }
  const getIcon = () => {
    if (icon) {
      return (
        <i className={`fa ${icon}`}></i>
      );
    } else {
      return null;
    }
  }
  const baseClass = 'custom-btn'
  const getColor = () =>{
    switch (color) {
      case COLOR.PRIMARY:
      return 'color-primary';
      case COLOR.SECONDARY:
      return 'color-secondary';
      default:
      return '';
    }
  }
  return (
    //stt means Selenium Testing Tag
    <div onClick={onClick} stt={stt} className={`${baseClass} ${getStyleClass()} ${getTypeClass()} ${getColor()} ${getSizeClass()} ${`float-${align}${isButtonGroup ? ` margin-${align && align === "left" ? 'right' : 'left' }` : ''}`}${isMarginRequired ? ' addMargin' : ''} ${getButtonWidth()}${disabled?' btn-disabled':''}`} style={css}>
      {getIcon()}{` ${label}`}
    </div>
  );
}
