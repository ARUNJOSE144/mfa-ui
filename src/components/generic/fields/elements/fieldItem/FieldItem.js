import React from "react";
import { Col, InputGroupAddon } from 'reactstrap';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import FIELD_TYPES from './FieldTypes';
import _ from 'lodash';
import Dropzone from 'react-dropzone';
import { expandSelectValue, sortOptionsByLabel } from './utils';

const FieldItem = props => {
  const onBlur = (e) => {
    if (props.onChange)
      props.onChange(null, { isTouched: true }, e);
  }
  const dateFormat = "YYYY-MM-DD";
  const getRadioButton = () => {
    const value = expandSelectValue(props.value, props.values);
    const getLabel = (selectedClass, label) => {
      if (!props.isWithoutLabel) {
        return (
          <div className={`float-left checkBoxRadio_label ${selectedClass}`}>{label}</div>
        )
      } else {
        return null;
      }
    }
    if (props.values) {
      return props.values.map((data, index) => {
        const selectedClass = (_.isEqual(value, data) ? 'checked_box' : 'nc_box')
        return (
          <div className={`checkBoxRadio_container${props.isListedInput ? ' cb-listed' : ' cb-left'}`} key={index}>
            <label className="checkBoxRadio radio">
              <div className="float-left btn_container">
                <input type="radio" checked={value && _.isEqual(value, data) ? 'checked' : false} onChange={() => { props.onChange(data) }} />
                <span className="checkmark"></span>
              </div>
              {getLabel(selectedClass, data.label)}
            </label>
          </div>
        );
      });
    }
  }
  const getCheckBox = () => {
    const getLabel = (selectedClass, data) => {
      if (!props.isWithoutLabel) {
        if (props.isWithoutValue) {
          return (
            <div className={`float-left checkBoxRadio_label ${selectedClass}`}>
              {data.label}
            </div>
          )
        } else {
          return (
            <div className={`float-left checkBoxRadio_label ${selectedClass}`}>
              {data.label}({data.value})
              <div>{data.subLabel}</div>
            </div>
          )
        }
      } else {
        return null;
      }
    }
    if (props.values) {
      return props.values.map((data, index) => {
        const selectedClass = (props.value && _.some(props.value, data) ? 'checked_box' : 'nc_box')
        return (
          <div className={`checkBoxRadio_container${props.isListedInput ? ' cb-listed' : ' cb-left'}`} key={index}>
            <label className="checkBoxRadio check">
              <div className="float-left btn_container">
                <input type="checkbox" checked={props.value && _.some(props.value, data) ? 'checked' : false} onChange={() => { props.onChange(data) }} />
                <span className="checkmark"></span>
              </div>
              {getLabel(selectedClass, data)}
            </label>
          </div>
        );
      });
    }
  }
  const className = `custom-field${!props.getOnlyInput ? " form-group" : ""}${props.touched ? " has-danger" : ""}${props.className ? " " + props.className : ""}`;
  const getInput = () => {
    switch (props.type) {
      //Drop down
      case FIELD_TYPES.DROP_DOWN:
        return (
          <Select
            className='Select'
            classNamePrefix='Select'
            placeholder={props.placeholder}
            // value={props.value}
            value={expandSelectValue(props.value, props.values)}
            options={sortOptionsByLabel(props.values)}
            onChange={props.onChange}
            disabled={props.disabled}
            onBlur={onBlur}
            isClearable={props.isClearable ? props.isClearable : true}
          />
        );
      //Multi Select
      case FIELD_TYPES.MUTLI_SELECT:
        return (
          <Select
            className='Select'
            classNamePrefix='Select'
            placeholder={props.placeholder}
            // value={props.value}
            value={expandSelectValue(props.value, props.values)}
            options={sortOptionsByLabel(props.values)}
            onChange={props.onChange}
            isMulti={true}
            disabled={props.disabled}
            onBlur={onBlur}
          />
        );
      case FIELD_TYPES.DATE_PICKER:
        //Date Picker
        return (
          <DatePicker
            dateFormat={props.dateFormat || dateFormat}
            peekNextMonth
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            isClearable={true}
            selected={props.value}
            //selected={props.value ?  moment(props.value, "DD/MM/YYYY") : null}
            onChange={props.onChange}
            className="form-control"
            todayButton={"Today"}
            minDate={props.minDate}
            maxDate={props.maxDate}
            excludeDates={props.excludeDates}
            placeholderText={props.placeholder}
            disabled={props.disabled}
            onBlur={onBlur}
          />
        );
      case FIELD_TYPES.DATE_TIME_PICKER:
        //Date Time Picker
        return (
          <DatePicker
            dateFormat={`${props.dateFormat || dateFormat} HH:mm`}
            peekNextMonth
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            isClearable={true}
            selected={props.value}
            onChange={props.onChange}
            className="form-control"
            todayButton={"Today"}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={props.interval}
            excludeTimes={props.excludeTimes}
            minTime={props.minTime}
            maxTime={props.maxTime}
            minDate={props.minDate}
            maxDate={props.maxDate}
            excludeDates={props.excludeDates}
            placeholderText={props.placeholder}
            disabled={props.disabled}
            onBlur={onBlur}
          />
        );
      case FIELD_TYPES.START_DATE_PICKER:
        //Start Date Picker
        return (
          <DatePicker
            dateFormat={props.dateFormat || dateFormat}
            peekNextMonth
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            isClearable={true}
            selected={props.startDate}
            onChange={props.onChange}
            className="form-control"
            todayButton={"Today"}
            minDate={props.minDate}
            maxDate={props.endDate}
            selectsStart
            startDate={props.startDate}
            endDate={props.endDate}
            placeholderText={props.placeholder}
            disabled={props.disabled}
            onBlur={onBlur}
          />
        );
      case FIELD_TYPES.START_DATE_TIME_PICKER:
        //Start Date Time Picker
        return (
          <DatePicker
            dateFormat={`${props.dateFormat || dateFormat} HH:mm`}
            peekNextMonth
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            isClearable={true}
            selected={props.startDate}
            onChange={props.onChange}
            className="form-control"
            todayButton={"Today"}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={props.interval}
            minTime={props.minTime}
            maxTime={props.maxTime}
            minDate={props.minDate}
            maxDate={props.maxDate}
            selectsStart
            startDate={props.startDate}
            endDate={props.endDate}
            placeholderText={props.placeholder}
            disabled={props.disabled}
            onBlur={onBlur}
          />
        );
      case FIELD_TYPES.END_DATE_PICKER:
        //End Date Picker
        return (
          <DatePicker
            dateFormat={props.dateFormat || dateFormat}
            peekNextMonth
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            isClearable={true}
            selected={props.endDate}
            onChange={props.onChange}
            className="form-control"
            todayButton={"Today"}
            minDate={props.startDate}
            maxDate={props.maxDate}
            selectsEnd
            startDate={props.startDate}
            endDate={props.endDate}
            placeholderText={props.placeholder}
            disabled={props.disabled}
            onBlur={onBlur}
          />
        );
      case FIELD_TYPES.END_DATE_TIME_PICKER:
        //End Date Time Picker
        return (
          <DatePicker
            dateFormat={`${props.dateFormat || dateFormat} HH:mm`}
            peekNextMonth
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            isClearable={true}
            selected={props.endDate}
            onChange={props.onChange}
            className="form-control"
            todayButton={"Today"}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={props.interval}
            minTime={props.minTime}
            maxTime={props.maxTime}
            minDate={props.startDate}
            maxDate={props.maxDate}
            selectsEnd
            startDate={props.startDate}
            endDate={props.endDate}
            placeholderText={props.placeholder}
            disabled={props.disabled}
            onBlur={onBlur}
          />
        );
      case FIELD_TYPES.ASYNC_DROP_DOWN:
        //Ajax Search dropDown
        return (
          <Select.Async
            className='Select'
            classNamePrefix='Select'
            value={props.value}
            onChange={props.onChange}
            loadOptions={props.loadOptions}
            backspaceRemoves={true}
            placeholder={props.placeholder}
            disabled={props.disabled}
            onBlur={onBlur}
          />
        );
      case FIELD_TYPES.ASYNC_MUTLI_SELECT:
        //Ajax Search multiSelect dropDown
        return (
          <Select.Async
            className='Select'
            classNamePrefix='Select'
            value={props.value}
            onChange={props.onChange}
            loadOptions={props.loadOptions}
            backspaceRemoves={true}
            multi={true}
            placeholder={props.placeholder}
            disabled={props.disabled}
            onBlur={onBlur}
          />
        );
      case FIELD_TYPES.TEXT_BOX_DISABLED:
        //Disabled Text Box
        return (
          <input
            readOnly="true"
            value={props.value}
            placeholder={props.placeholder}
            className="disabled-input form-control disabed-text" type="text"
            onBlur={onBlur}
          />
        );
      case FIELD_TYPES.RADIO_BUTTON:
        //Radio Buttons
        if (props.isListedInput) {
          return (
            <div className={props.listedClassName ? props.listedClassName : ''}>
              <div className={`checkBoxRadio_main${!props.isWithoutLabel ? ' rc-mandatory' : ''} rc-listed`}>
                {getRadioButton()}
              </div>
            </div>
          );
        } else {
          return (
            <div className={`checkBoxRadio_main${!props.isWithoutLabel ? ' rc-mandatory' : ''}`}>
              {getRadioButton()}
            </div>
          );
        }

      case FIELD_TYPES.CHECK_BOX:
        //CheckBox
        if (props.isListedInput) {
          return (
            <div className={props.listedClassName ? props.listedClassName : ''}>
              <div className={`checkBoxRadio_main${!props.isWithoutLabel ? ' rc-mandatory' : ''} rc-listed`}>
                {getCheckBox()}
              </div>
            </div>
          );
        } else {
          return (
            <div className={`checkBoxRadio_main${!props.isWithoutLabel ? ' rc-mandatory' : ''}`}>
              {getCheckBox()}
            </div>
          );
        }

      case FIELD_TYPES.TEXT_AREA_DISABLED:
        //Disabled Text area
        return (
          <textarea
            readOnly="true"
            value={props.value}
            className="form-control disabed-text"
          />
        );

      case FIELD_TYPES.SEARCH_BOX_ICON://Search Box With icon
        return (
          <div className="select-modal">
            <span className='select-modal-label'>{props.fieldValue}</span>
            <div className="icon-box" onClick={props.onClick}>
              <span className={`icon fa ${props.icon || 'fa-plus'}`}></span>
            </div>
          </div>
        );

      case FIELD_TYPES.TEXT_AREA://Text Area
        return (
          <textarea
            value={props.value}
            placeholder={props.placeholder}
            onChange={(event) => (props.onChange ? props.onChange(event.target.value, {}, event) : null)}
            className="form-control"
            disabled={props.disabled ? true : false}
            onBlur={onBlur}
          />
        );
      case FIELD_TYPES.NESTED_DROP_DOWN://nested drop down
        const getNestedList = (option) => {
          const nestedArray = [];
          const nestedObj = {};

          for (var k in option) {
            if (k !== 'children') nestedObj[k] = option[k];
          }

          if (option.children) {
            option.children.forEach(child => {
              const childElement = getNestedList(child);
              nestedArray.push(childElement);
            });
            nestedObj.options = nestedArray;
          }
          return nestedObj;
        }
        const getOptions = () => {
          const optionList = [];
          if (props.values) {
            props.values.forEach((value) => {
              optionList.push(getNestedList(value));
            });
          }
          return optionList;
        }
        return (
          <Select
            className='Select'
            classNamePrefix='Select'
            placeholder={props.placeholder}
            // value={props.value}
            value={expandSelectValue(props.value, props.values)}
            options={getOptions()}
            onChange={props.onChange}
            disabled={props.disabled}
            onBlur={onBlur}
          />
        );
      case FIELD_TYPES.INPUT_WITH_BUTTON: //input with button
        return (
          <div className="input-group">
            <input
              disabled={props.disabled ? true : false}
              value={props.value}
              placeholder={props.placeholder}
              maxLength={props.maxLength}
              onChange={(event) => (props.onChange ? props.onChange(event.target.value) : null)}
              className="form-control" type={props.inputType || "text"}
              onBlur={onBlur}
            />
            <div className="input-group-append">
              <button className="btn btn-outline-secondary" type="button" onClick={props.onButtonClick}>{props.buttonLabel}</button>
            </div>
          </div>
        )
      case FIELD_TYPES.VIEW_DETAILS_BOX://View Box
        return (
          <div
            className="disabled-input form-control disabed-text disabled-input-div">
            {props.value}
          </div>
        );
      case FIELD_TYPES.FILE_UPLOAD://File upload
        let dropzoneRef;
        return (
          <div className="input-group field-file">
            <div className="form-control">
              <Dropzone
                ref={(node) => { dropzoneRef = node; }}
                onDrop={props.onChange}
                className="field-file-drop-zone">
                <span className={`${!(props.value && props.value.length > 0) ? "value-empty " : ""}field-file-drop-zone-text`}>
                  {(props.value && props.value.length > 0) ? props.value.map(file => file.name).join(', ') : 'Choose file..'}
                </span>
              </Dropzone>
              {
                (props.value && props.value.length > 0) && <button className="field-file-reset" onClick={() => props.onChange()}>
                  <svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"></path></svg>
                </button>
              }
            </div>
            <InputGroupAddon onClick={() => { dropzoneRef.open() }} addonType="append" style={{ cursor: 'pointer' }}>
              <span className="input-group-text">Browse</span>
            </InputGroupAddon>
          </div>
        );
      //Normal Text Box
      default:
        return (
          <input
            value={props.value}
            maxLength={props.maxLength}
            placeholder={props.placeholder}
            onChange={(event) => (props.onChange ? props.onChange(event.target.value) : null)}
            className="form-control" type={props.inputType || "text"}
            readOnly={props.disabled ? true : false}
            onBlur={onBlur}
          />
        );
    }
  }
  const getWidth = () => {
    switch (props.width) {
      case "xs":
        return ({ xs: 12 });
      case "md":
        return ({ md: 4, sm: 6, xs: 12 });
      case "sm":
        return ({ sm: 6, xs: 12 });
      default:
        return ({ md: 4, lg: 3, sm: 6, xs: 12 });
    }
  }
  const getInputContainer = () => {
    return (
      <div className={(props.ismandatory ? `${className} required` : className)} stt={props.stt}>
        <label className={(props.ismandatory ? 'form-control-label required' : 'form-control-label')}>{props.label}</label>
        {getInput()}
        <div className="text-help">
          {props.touched && props.error ? props.error : ""}
        </div>
      </div>
    );
  }
  const getFinalData = () => {
    if (props.isListedInput) {
      return (
        getInput()
      );

    } else if (props.getOnlyInput) {
      return (
        <div className={(props.ismandatory ? `${className} required only-input-field` : `${className} only-input-field`)}>
          {getInput()}
          <div className="text-help">
            {props.touched ? props.error : ""}
          </div>
        </div>
      );

    } else if (props.customWidth) {
      return (
        <div>
          {getInputContainer()}
        </div>
      );
    } else {
      return (
        <Col {...getWidth()}>
          {getInputContainer()}
        </Col>
      );
    }
  }
  return getFinalData();
};

export default FieldItem;
