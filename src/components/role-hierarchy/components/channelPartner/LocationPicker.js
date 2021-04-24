import React, { Component } from 'react';

let mainLayer;
const {ol} = window;

export default class LocationPicker extends Component {
    
    constructor(props) {
        super(props);

        mainLayer = new ol.layer.Vector({});
    }

    componentDidMount() {
       
        const thisOfComp = this;
        
        if(ol){
            let markerLayer = new ol.layer.Vector();
            const markerStyle = new ol.style.Style({
                image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                    anchor: [0.5, 27],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    src: `${process.env.PUBLIC_URL}/images/icons/map-marker-blue.svg`
                  }))
            });

            markerLayer.setSource(new ol.source.Vector());

            if(thisOfComp.props.location){
                const coordinate = thisOfComp.props.location.map(coord => parseFloat(coord));
                var markerFeature = new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.fromLonLat(coordinate))
                });
                markerFeature.setStyle(markerStyle);
                markerLayer.getSource().addFeature(markerFeature);
            }
           

            const map = new ol.Map({
                layers: [
                    new ol.layer.Tile({
                        source: new ol.source.TileImage({
                            url: 'http://mt.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'
                        })
                    }),
                    mainLayer
                ],
                target: this.mapRef,
                view: new ol.View({
                    center: [4373189.857312214, -760650.8321828861],
                    zoom: 12
                })
            });
            map.addLayer(markerLayer);

            !this.props.isView && map.on('singleclick', function (evt) {
                var feature = map.forEachFeatureAtPixel(evt.pixel,
                    function(feature) {
                      return feature;
                });
                if (feature) {
                    var coordinate = evt.coordinate;
                    var lonlat = ol.proj.toLonLat(coordinate); 
                    markerLayer.getSource().clear();
                    var markerFeature = new ol.Feature({
                        geometry: new ol.geom.Point(coordinate)
                    });
                    markerFeature.setStyle(markerStyle);
                    markerLayer.getSource().addFeature(markerFeature);

                    thisOfComp.props.onInputChange('longitude', lonlat[0])
                    thisOfComp.props.onInputChange('latitude', lonlat[1])
                } else {
                    thisOfComp.props.setNotification({"message" : "Please select a location inside the selected territory", "hasError" : true, "timestamp" : new Date().getTime()});
                }
                    
            });

            thisOfComp.props.locationId && thisOfComp.props.ajaxUtil.sendRequest(thisOfComp.props.url_SalesTerritory.GET_NODE_URL,{ locId:thisOfComp.props.locationId }, (response,hasError) => {
                if (response && !hasError) {
                    mainLayer.setSource(new ol.source.Vector());
                    const locationData = response.locCoordinates;
                    var gparser = new ol.format.GeoJSON({ featureProjection: 'EPSG:3857' });
                    var gvectors = gparser.readFeatures(JSON.parse(locationData));
                    mainLayer.getSource().addFeatures(gvectors);
                    var extent = mainLayer.getSource().getExtent();
                    map.getView().fit(extent);
                }
            }, this.props.loadingFunction, { isShowSuccess: false });
        }
    }

    render() {
        return <div ref={ref => this.mapRef = ref} className="px-1 py-1" style={{ height: 'calc(100% - 70px)', width: '100%' }} />
    }
}