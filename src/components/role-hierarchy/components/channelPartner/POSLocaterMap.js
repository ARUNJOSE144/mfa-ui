import React, { Component } from 'react';
import _ from 'lodash';

let map, markerLayer;
const {ol} = window;
const markerStyle = new ol.style.Style({
    image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
        anchor: [0.5, 27],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: `${process.env.PUBLIC_URL}/images/icons/map-marker-blue.svg`
      }))
});

export default class POSLocaterMap extends Component {
    
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        markerLayer = new ol.layer.Vector();
        const self = this;
        
        if(ol){
            markerLayer.setSource(new ol.source.Vector());

            map = new ol.Map({
                layers: [
                    new ol.layer.Tile({
                        source: new ol.source.TileImage({
                            url: 'http://mt.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'
                        })
                    })
                ],
                target: this.mapRef,
                view: new ol.View({
                    center: [4373189.857312214, -760650.8321828861],
                    zoom: 12
                })
            });
            map.addLayer(markerLayer);
            self.showMarkers(self.props.locations);

            map.on('click', function (evt) {
                var feature = map.forEachFeatureAtPixel(evt.pixel,
                    function (feature) {
                        return feature;
                    });
                if (feature) {
                    self.props.onMarkerClick(true);
                } else {

                }
            });

        }
    }

    showMarkers = locations => {
        if (locations) {
            markerLayer.setSource(new ol.source.Vector());
            for (var i = 0; i < locations.length; i++) {
                if (locations[i].lonlat && locations[i].lonlat.length === 2) {
                    var markerFeature = new ol.Feature({
                        geometry: new ol.geom.Point(ol.proj.fromLonLat(locations[i].lonlat.map(str => parseFloat(str))))
                    });
                    markerFeature.setStyle(markerStyle);
                    markerLayer.getSource().addFeature(markerFeature);
                    var extent = markerLayer.getSource().getExtent();
                    map.getView().fit(extent);
                }
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(nextProps.locations,  this.props.locations)) {
            this.showMarkers(nextProps.locations);
        }
    }

    render() {
        return <div ref={ref => this.mapRef = ref} className="px-1 py-1" style={{ height: '170px', width: '100%' }} />
    }
}