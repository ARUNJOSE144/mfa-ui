import React, { Component } from 'react';
import { Row, Container } from 'reactstrap';

import {FieldItem} from '@6d-ui/fields';
import { Popup, POPUP_ALIGN } from '@6d-ui/popup';
import {SelectorModal} from '@6d-ui/form';
import { BUSINESS_LOCATION_GROUP } from '../util/ChannelTypeFields';
import LocationPicker from './LocationPicker';

export default class TerritoryDetailsForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowTerritoryPopup: false,
            isShowLocationPicker: false
        };
        this.toggleTerritoryPopup = this.toggleTerritoryPopup.bind(this);
        this.toggleLocationPicker = this.toggleLocationPicker.bind(this);
        this.renderSelectorModal = this.renderSelectorModal.bind(this);
    }

    toggleTerritoryPopup(isShowTerritoryPopup) {
        const { fields = {} } = this.props.fieldGroup;
        const territorytypeField = fields[BUSINESS_LOCATION_GROUP.FIELDID_TERRITORYTYPE];
        if(isShowTerritoryPopup && !this.props.isView && this.props.hasParent && !this.props.parentEntityId || !this.props[territorytypeField.name]){
            this.props.setNotification({
                "message": "Please enter Parent and Territory Type field(s) to select locations",
                "hasError": true,
                "timestamp": new Date().getTime()
            });
            return;
        }

        isShowTerritoryPopup = isShowTerritoryPopup || !this.state.isShowTerritoryPopup;
        this.setState({ isShowTerritoryPopup });
    }

    onTerritorySelect(value, name) {
        this.props.onChange(value, name)
        this.toggleTerritoryPopup();
    }

    toggleLocationPicker(isShowLocationPicker) {
        isShowLocationPicker = isShowLocationPicker || !this.state.isShowLocationPicker;
        this.setState({ isShowLocationPicker });
    }

    getFieldValue(values, options) {
        if (options && values) {
            var fieldValue = [];
            options.map(option => values.indexOf(option.value) > -1 && fieldValue.push(option.label))
            return fieldValue.toString();
        } else {
            return values ? values.toString() : '';
        }
    }

    renderSelectorModal(territorynameField) {
        return this.props.isView
            ? <SelectorModal
                listItems={this.props.locations && this.props.locations.map(loc => ({ label: loc.locationName, value: loc.locationId }))}
                title={territorynameField.name}
                isView={true}
                selectedItems={this.props.locations && this.props.locations.map(loc => ({label: loc.locationName,value: loc.locationId}))}
            />
            : <SelectorModal
                isRadioButton={!this.props.hasMultiLocation}
                listItems={this.props.fields && this.props.fields[territorynameField.name] && this.props.fields[territorynameField.name].values}
                onSubmitClick={this.onTerritorySelect.bind(this, territorynameField.name)}
                title={territorynameField.name}
                selectedItems={this.props[territorynameField.name]}
            />
    }

    renderLocPickerModal() {
        // return this.props.isView
        //     ? <SelectorModal
        //         listItems={this.props.locations && this.props.locations.map(loc => ({ label: loc.locationName, value: loc.locationId }))}
        //         title={territorynameField.name}
        //         isView={true}
        //         selectedItems={this.props.locations && this.props.locations.map(loc => loc.locationId)}
        //     />
        //     : <SelectorModal
        //         listItems={this.props.fields && this.props.fields[territorynameField.name] && this.props.fields[territorynameField.name].values}
        //         onSubmitClick={this.onTerritorySelect.bind(this)}
        //         title={territorynameField.name}
        //         selectedItems={this.props[territorynameField.name]}
        //     />
        const locationId = this.props.isView
            ? this.props.locations && this.props.locations[0] && this.props.locations[0].locationId
            : this.props.territoryName && this.props.territoryName[0] && this.props.territoryName[0].value;
        return <LocationPicker
            onInputChange={this.props.onChange}
            isView={this.props.isView}
            location={[this.props.longitude, this.props.latitude]}
            locationId={locationId}
            ajaxUtil={this.props.ajaxUtil}
            setNotification={this.props.setNotification}
            loadingFunction={this.props.loadingFunction}
            url_SalesTerritory={this.props.url_SalesTerritory}
        />
    }


    render() {
        const { fields = {} } = this.props.fieldGroup;
        const territorytypeField = fields[BUSINESS_LOCATION_GROUP.FIELDID_TERRITORYTYPE];
        const territorynameField = fields[BUSINESS_LOCATION_GROUP.FIELDID_TERRITORYNAME];
        const lattitudeField = fields[BUSINESS_LOCATION_GROUP.FIELDID_LATTITUDE];
        const longitudeField = fields[BUSINESS_LOCATION_GROUP.FIELDID_LONGITUDE];
        const { isShowTerritoryPopup, isShowLocationPicker } = this.state;
        if (this.props.isView) {
            return (
                <Container className="form-Brick-body mb-3">
                    <Row className="mx-0">
                        {
                            this.props.hasParent && <FieldItem
                                label="Parent"
                                value={this.props.parentName}
                                width="md"
                                type="11"
                            />
                        }

                        <FieldItem
                            label="Location Type"
                            value={this.props.locationType}
                            width="md"
                            type="11"
                        />

                        <FieldItem
                            label="Locations"
                            // value={`${this.props.locations ? this.props.locations.length:''} selected`}
                            // onChange={()=>console}
                            onClick={this.toggleTerritoryPopup}
                            width="md"
                            type="15"
                            fieldValue={`${this.props.locations ? this.props.locations.length : ''} selected`}
                        />

                        {
                            fields.hasOwnProperty(BUSINESS_LOCATION_GROUP.FIELDID_LATTITUDE) && 
                            <FieldItem
                                label="Lattitude"
                                value={this.props.latitude}
                                width="md"
                                disabled
                                buttonLabel={<i className="fa fa-crosshairs"></i>}
                                onButtonClick={e => this.toggleLocationPicker()}
                                type="18"
                            />
                        }

                        {
                            fields.hasOwnProperty(BUSINESS_LOCATION_GROUP.FIELDID_LONGITUDE) &&
                            <FieldItem
                                label="Longitude"
                                value={this.props.longitude}
                                width="md"
                                disabled
                                buttonLabel={<i className="fa fa-crosshairs"></i>}
                                onButtonClick={e => this.toggleLocationPicker()}
                                type="18"
                            />
                        }

                    </Row>
                    {
                        isShowTerritoryPopup && fields.hasOwnProperty(BUSINESS_LOCATION_GROUP.FIELDID_TERRITORYNAME) && <Popup
                            type={POPUP_ALIGN.RIGHT}
                            minWidth="25%"
                            title={territorynameField.label}
                            isOpen={isShowTerritoryPopup}
                            close={this.toggleTerritoryPopup}
                            component={this.renderSelectorModal(territorynameField)}
                        />
                    }
                     {
                    isShowLocationPicker && <Popup
                        title={territorynameField.label}
                        type={POPUP_ALIGN.RIGHT}
                        minWidth="50%"
                        isOpen={isShowLocationPicker}
                        close={this.toggleLocationPicker}
                        component={this.renderLocPickerModal()}
                    />
                }

                </Container>
            )
        }
        return (
            <Container className="form-Brick-body mb-3">

                <Row className="mx-0">
                    {
                        this.props.hasParent && <FieldItem
                            label="Parent"
                            value={this.props.parentEntityId}
                            values={this.props.fields && this.props.fields.parentEntityId && this.props.fields.parentEntityId.values}
                            onChange={this.props.onChange.bind(null, 'parentEntityId')}
                            touched={this.state.fields && this.state.fields.parentEntityId && this.state.fields.parentEntityId.hasError}
                            error={this.state.fields && this.state.fields.parentEntityId && this.state.fields.parentEntityId.errorMsg}
                            type="1"
                            width="md"
                            ismandatory />
                    }

                    {
                        fields.hasOwnProperty(BUSINESS_LOCATION_GROUP.FIELDID_TERRITORYTYPE) &&
                        <FieldItem {...territorytypeField}
                            value={this.props[territorytypeField.name]}
                            onChange={territorytypeField.type === "1" ? this.props.onChange.bind(null, territorytypeField.name) : this.props.onChange}
                            touched={this.props.fields && this.props.fields[territorytypeField.name] && this.props.fields[territorytypeField.name].hasError}
                            error={this.props.fields && this.props.fields[territorytypeField.name] && this.props.fields[territorytypeField.name].errorMsg}
                            values={this.props.fields && this.props.fields[territorytypeField.name] && this.props.fields[territorytypeField.name].values}
                            width="md"
                        />
                    }
                </Row>

                {
                    fields.hasOwnProperty(BUSINESS_LOCATION_GROUP.FIELDID_TERRITORYNAME) && <Row className="mx-0">
                        <FieldItem {...territorynameField}
                            value={this.props[territorynameField.name]}
                            onChange={territorynameField.type === "1" ? this.props.onChange.bind(null, territorynameField.name) : this.props.onChange}
                            onClick={this.toggleTerritoryPopup}
                            touched={this.props.fields && this.props.fields[territorynameField.name] && this.props.fields[territorynameField.name].hasError}
                            error={this.props.fields && this.props.fields[territorynameField.name] && this.props.fields[territorynameField.name].errorMsg}
                            values={this.props.fields && this.props.fields[territorynameField.name] && this.props.fields[territorynameField.name].values}
                            width="md"
                            type="15"
                            // fieldValue={this.getFieldValue(this.props[territorynameField.name], this.props.fields && this.props.fields[territorynameField.name] && this.props.fields[territorynameField.name].values)}
                            fieldValue={`${this.props[territorynameField.name] ? this.props[territorynameField.name].length : 0} selected`}
                        />
                    </Row>
                }

                <Row className="mx-0">
                    {
                        fields.hasOwnProperty(BUSINESS_LOCATION_GROUP.FIELDID_LATTITUDE) &&
                        <FieldItem {...lattitudeField}
                            value={this.props[lattitudeField.name]}
                            onChange={lattitudeField.type === "1" ? this.props.onChange.bind(null, lattitudeField.name) : this.props.onChange}
                            type="18"
                            buttonLabel={<i className="fa fa-crosshairs"></i>}
                            onButtonClick={e=>this.toggleLocationPicker()}
                            touched={this.props.fields && this.props.fields[lattitudeField.name] && this.props.fields[lattitudeField.name].hasError}
                            error={this.props.fields && this.props.fields[lattitudeField.name] && this.props.fields[lattitudeField.name].errorMsg}
                            values={this.props.fields && this.props.fields[lattitudeField.name] && this.props.fields[lattitudeField.name].values}
                            width="md"
                        />

                    }

                    {
                        fields.hasOwnProperty(BUSINESS_LOCATION_GROUP.FIELDID_LONGITUDE) &&
                        <FieldItem {...longitudeField}
                            value={this.props[longitudeField.name]}
                            onChange={longitudeField.type === "1" ? this.props.onChange.bind(null, longitudeField.name) : this.props.onChange}
                            type="18"
                            buttonLabel={<i className="fa fa-crosshairs"></i>}
                            onButtonClick={e=>this.toggleLocationPicker()}
                            touched={this.props.fields && this.props.fields[longitudeField.name] && this.props.fields[longitudeField.name].hasError}
                            error={this.props.fields && this.props.fields[longitudeField.name] && this.props.fields[longitudeField.name].errorMsg}
                            values={this.props.fields && this.props.fields[longitudeField.name] && this.props.fields[longitudeField.name].values}
                            width="md"
                        />

                    }
                </Row>

                {
                    isShowTerritoryPopup && fields.hasOwnProperty(BUSINESS_LOCATION_GROUP.FIELDID_TERRITORYNAME) && 
                    // <ActionModal
                    //     title={territorynameField.label}
                    //     isOpen={isShowTerritoryPopup}
                    //     close={this.toggleTerritoryPopup}
                    //     component={this.renderSelectorModal(territorynameField)}
                    // />
                    <Popup
                        type={POPUP_ALIGN.RIGHT}
                        title={territorynameField.label}
                        minWidth="25%"
                        isView={false}
                        isOpen={isShowTerritoryPopup}
                        close={this.toggleTerritoryPopup}
                        component={this.renderSelectorModal(territorynameField)}
                    />
                }
                {
                    isShowLocationPicker && <Popup
                        type={POPUP_ALIGN.RIGHT}
                        title={territorynameField.label}
                        minWidth="50%"
                        isView={false}
                        isOpen={isShowLocationPicker}
                        close={this.toggleLocationPicker}
                        component={this.renderLocPickerModal()}
                    />
                // <ActionModal
                //         title="Location"
                //         isOpen={isShowLocationPicker}
                //         close={this.toggleLocationPicker}
                //         component={this.renderLocPickerModal()}
                //     />
                }

            </Container>
        );
    }
}