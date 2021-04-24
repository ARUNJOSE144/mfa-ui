import React, { Component } from 'react';
import { Context } from "../OLMap";

import VectorLayer from "ol/layer/Vector";
import GeoJSONFormat from "ol/format/GeoJSON";
import VectorSource from "ol/source/Vector";
import isEqual from "lodash/isEqual";

export default class Vector extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Context.Consumer>
                {context => <VectorComponent context={context} {...this.props} />}
            </Context.Consumer>
        )
    }

}

class VectorComponent extends Component {

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
            const hasGeoJsonChanged = !isEqual(prevProps.geojson, this.props.geojson)
            this.addLayer(hasGeoJsonChanged);
        }
    }

    addLayer = hasGeoJsonChanged => {
        const { geojson, fitToView } = this.props;
        if (typeof (this.mapElm) === 'undefined') return;
        this.mapElm.removeLayer(this.layer);
        this.layer = new VectorLayer({ source: new VectorSource() });
        if (geojson != null) {
            const fitToView = hasGeoJsonChanged && (fitToView === true)
            this.addGeoJSONData(geojson, fitToView);
        }
        this.mapElm.addLayer(this.layer);
    }

    fitFeaturesToView = () => {
        const { layer, mapElm } = this;
        layer.getSource().once('change', function (e) {
            console.log("qwer")
            if (layer.getSource().getState() === 'ready') {
                console.log("ready")
                var extent = layer.getSource().getExtent();
                try {
                    mapElm.getView().fit(extent, { duration: 200 });
                } catch (error) {
                    console.warn(error);
                }
            }
        });
    }

    addGeoJSONData = (geojson, fitToView) => {
        var gparser = new GeoJSONFormat({ featureProjection: 'EPSG:3857' });
        var gvectors = gparser.readFeatures(geojson);
        this.layer.getSource().clear();
        fitToView && this.fitFeaturesToView();
        this.layer.getSource().addFeatures(gvectors);
    }

    render() {
        return <div></div>
    }

}
