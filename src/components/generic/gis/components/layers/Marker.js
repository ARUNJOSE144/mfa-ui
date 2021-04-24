import React, { Component } from 'react';
import { Context } from "../OLMap";

import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import GeomPoint from "ol/geom/Point";
import {fromLonLat} from "ol/proj";
import OLStyle from "ol/style/Style";
import OLIcon from "ol/style/Icon";
import isEqual from "lodash/isEqual"
import assign from "lodash/assign"

export default class Marker extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Context.Consumer>
                {context => <MarkerLayer context={context} {...this.props} />}
            </Context.Consumer>
        )
    }

}

class MarkerLayer extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.mapElm = this.props.context.mapElm;
        this.addLayer();
        this.props.onInit && this.props.onInit(this.layer)
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps != this.props) {
            this.mapElm = this.props.context.mapElm;
            this.addLayer();
        }
        if (!isEqual(prevProps.markers, this.props.markers)) {
            this.props.fitToView === true && this.fitFeaturesToView();
        }
    }

    addLayer = () => {
        const { markers } = this.props;
        if (typeof (this.mapElm) === 'undefined') return;
        this.mapElm.removeLayer(this.layer);
        this.layer = new VectorLayer({ source: new VectorSource() });
        if (Array.isArray(markers)) {
            this.addMarkerData(markers);
        }
        this.mapElm.addLayer(this.layer);
    }

    addMarkerData = markers => {
        const markerFeatures = markers.map(marker => {
            const { lonlat, markerId } = marker;
            const markerStyle = this.getMarkerStyle(marker.style);
            const markerFeature = new Feature({
                geometry: new GeomPoint(fromLonLat(lonlat))
            });
            markerFeature.setProperties({ data: marker });
            markerFeature.setId(markerId)
            markerFeature.setStyle(markerStyle);
            return markerFeature;
        });
        this.layer.getSource().addFeatures(markerFeatures);
    }

    getMarkerStyle = customStyle => {
        const markerStyle = {}
        const { style = {} } = this.props;
        assign(markerStyle, style, customStyle);
        return new OLStyle({
            image: new OLIcon(({
                anchor: [0.5, 26],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                src: markerStyle.imageSrc
            }))
        });
    }

    fitFeaturesToView = () => {
        try {
            if (this.layer && this.layer.getSource()) this.mapElm.getView().fit(this.layer.getSource().getExtent(), { duration: 200 });
        } catch (error) {
            console.warn(error);
        }
    }

    render() {
        return <div></div>
    }

}