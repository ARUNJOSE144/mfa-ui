import React from 'react';
import {BUTTON_STYLE, BUTTON_TYPE, BUTTON_SIZE, BUTTON_ALIGN,COLOR} from './ButtonTypes';

export const CustomButton = ({type, style, size, icon, label, onClick, align, isButtonGroup, isMarginRequired, width,color,disabled=false,css,stt}) => {


  const getStyleClass = () => {
    switch (style) {
      case BUTTON_STYLE.BRICK:
        return 'btn-block-c';
        break;
      case BUTTON_STYLE.ROUNDED:
        return 'btn-round';
        break;
      default:
        return 'btn';
        break;
    }
  }
  const getTypeClass = () => {
    switch (type) {
      case BUTTON_TYPE.PRIMARY:
        return 'custom-btn-primary';
        break;
      case BUTTON_TYPE.SECONDARY:
        return 'custom-btn-secondary';
        break;
      case BUTTON_TYPE.ALERT_PRIMARY:
        return 'btn-alert-primary';
        break;
      case BUTTON_TYPE.ALERT_SECONDARY:
        return 'btn-alert-secondary';
        break;
      default:
        return '';
        break;
    }
  }
  const getSizeClass = () => {
    switch (size) {
      case BUTTON_SIZE.SMALL:
        return 'btn-sm';
        break;
      case BUTTON_SIZE.MEDIUM:
        return 'btn-md';
        break;
      case BUTTON_SIZE.LARGE:
        return 'btn-lg';
        break;
      case BUTTON_SIZE.MEDIUM_LARGE:
        return 'btn-md-lg';
        break;
      default:
        return '';
        break;
    }
  }
  const getButtonWidth = () => {
    switch (width) {
      case BUTTON_ALIGN.INHERIT:
        return 'btn-width-inherit';
        break;
      default:
        return '';
        break;
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
      break;
      case COLOR.SECONDARY:
      return 'color-secondary';
      break;
      default:
      return '';
      break;
    }
  }
  return (
    //stt means Selenium Testing Tag
    <div onClick={onClick} stt={stt} className={`${baseClass} ${getStyleClass()} ${getTypeClass()} ${getColor()} ${getSizeClass()} ${`float-${align}${isButtonGroup ? ` margin-${align && align === "left" ? 'right' : 'left' }` : ''}`}${isMarginRequired ? ' addMargin' : ''} ${getButtonWidth()}${disabled?' btn-disabled':''}`} style={css}>
      {getIcon()}{` ${label}`}
    </div>
  );
}
