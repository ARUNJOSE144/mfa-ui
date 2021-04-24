import React, { Component } from 'react';
import { Button, ButtonGroup } from 'reactstrap';
import isEqual from 'lodash/isEqual';

import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Map from 'ol/Map';

import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import OLStyle from "ol/style/Style";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Circle from "ol/style/Circle";
import GeoJSONFormat from "ol/format/GeoJSON";
import SelectInteraction from "ol/interaction/Select";
import ModifyInteraction from "ol/interaction/Modify";
import DrawInteraction from "ol/interaction/Draw";

import "ol/ol.css";

export default class OLMapEdit extends Component {

    mapIntractions = [];
    mainLayer = new VectorLayer({});
    drawLayer = new VectorLayer({
        source: new VectorSource(),
        style: new OLStyle({
            fill: new Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new Stroke({
                color: '#3366FF',
                width: 2
            }),
            image: new Circle({
                radius: 7,
                fill: new Fill({
                    color: '#ffcc33'
                })
            })
        })
    });

    constructor(props) {
        super(props);
        this.state = { activeAction: 'none' };
        window.testFn = () => {
            console.log(this.drawLayer.getSource());
        }
    }

    componentDidMount() {
        this.initMap();
    }

    componentDidUpdate(prevProps, prevState) {
        this.props.isDrawActive && this.mapObj && this.mapObj.getTarget().scrollIntoView({ behavior: "smooth" });
        if (
            !isEqual(this.props.mainLayerData, prevProps.mainLayerData) ||
            this.props.isDrawActive != prevProps.isDrawActive || this.props.isEdit != prevProps.isEdit
        ) {
            this.reloadLayers();
        }
    }

    clearDrawLayer() {
        var features = this.drawLayer.getSource().getFeatures();
        features.forEach((feature) => {
            this.drawLayer.getSource().removeFeature(feature);
        });
    }

    deActivateDraw() {
        this.onMapButtonClick("none");
        this.props.activateDraw(false);
    }

    onMapButtonClick(action) {
        const activeAction = this.state.activeAction === action ? 'none' : action
        this.setState({ activeAction });
        for (var key in this.mapIntractions) {
            if (this.mapIntractions.hasOwnProperty(key)) {
                this.mapIntractions[key].setActive(false);
                (key === activeAction) && this.mapIntractions[key].setActive(true);
            }
        }
    }

    initMap = () => {
        this.mapObj = new Map({
            layers: [
                new TileLayer({
                    source: new OSM()
                }),
                this.mainLayer,
                this.drawLayer
            ],
            target: this.mapElm
        });

        this.initDrawFunc();
    }

    getDrawnLayer = () => {
        var format = new GeoJSONFormat({ featureProjection: 'EPSG:3857' });
        return format.writeFeatures(this.drawLayer.getSource().getFeatures());
    }

    loadEditLayer(drawLayerData) {
        if (drawLayerData) {
            var gparser = new GeoJSONFormat({ featureProjection: 'EPSG:3857' });
            var gvectors = gparser.readFeatures(JSON.parse(drawLayerData));
            this.drawLayer.getSource().clear();
            this.drawLayer.getSource().addFeatures(gvectors);
            this.mapObj.getView().fit(this.drawLayer.getSource().getExtent());
        }
    }

    initDrawFunc = () => {
        const self = this;
        const Modify = {
            init: function () {
                this.select = new SelectInteraction({
                    filter: function (feature, layer) {
                        return layer === self.drawLayer
                    }
                });

                self.mapObj.addInteraction(this.select);

                this.modify = new ModifyInteraction({
                    features: this.select.getFeatures()
                });

                this.modify.on('modifyend', function (e) { });

                self.mapObj.addInteraction(this.modify);

                this.setEvents();
            },
            setEvents: function () {
                var selectedFeatures = this.select.getFeatures();
                selectedFeatures.on('add', function (event) {
                    var feature = event.element;
                    feature.on('change', function (event) { });
                });

                this.select.on('change:active', function () {
                    selectedFeatures.forEach(selectedFeatures.remove, selectedFeatures);
                });
            },
            setActive: function (active) {
                this.select.setActive(active);
                this.modify.setActive(active);
            }
        };

        Modify.init();
        this.mapIntractions["Modify"] = Modify;

        var Draw = {
            init: function () {
                this.draw = new DrawInteraction({
                    source: self.drawLayer.getSource(),
                    type: 'Polygon'
                })
                self.mapObj.addInteraction(this.draw);
                this.draw.setActive(false);
            },
            setActive: function (active) {
                this.draw.setActive(active);
            }
        };

        Draw.init();
        this.mapIntractions["Draw"] = Draw;

        var Delete = {
            init: function () {
                this.select = new SelectInteraction({
                    filter: function (feature, layer) {
                        //return feature.getProperties().name !== 'Tanzania';
                        return layer === self.drawLayer //Master Layer. Cannot be edited
                    }
                });
                self.mapObj.addInteraction(this.select);

                this.setEvents();
            },
            setEvents: function () {
                var selectedFeatures = this.select.getFeatures();
                selectedFeatures.on('add', function (event) {
                    // var feature = event.element;
                    self.mapObj.once('click', function (e) {
                        //get all features at the clicked position
                        self.mapObj.forEachFeatureAtPixel(e.pixel, function (clickedFeature) {

                            var is_selectedFeature_cleared = false;
                            //check if the clicked feature is in selected features
                            selectedFeatures.forEach(function (selectedFeature) {
                                if (clickedFeature === selectedFeature) {
                                    self.drawLayer.getSource().removeFeature(selectedFeature);
                                    selectedFeatures.clear();
                                    is_selectedFeature_cleared = true;
                                }
                                return is_selectedFeature_cleared; //if == true will break this loop
                            });
                            return is_selectedFeature_cleared; //if == true will break this loop

                        });

                    });
                });

                this.select.on('change:active', function () {
                    selectedFeatures.forEach(selectedFeatures.remove, selectedFeatures);
                });

            },
            setActive: function (active) {
                this.select.setActive(active);
            }
        };

        Delete.init();
        this.mapIntractions["Delete"] = Delete;
    }

    reloadLayers = () => {
        const { mainLayerData, isEdit } = this.props;
        this.mainLayer.setSource(new VectorSource());
        try {
            if (mainLayerData) {
                var gparser = new GeoJSONFormat({ featureProjection: 'EPSG:3857' });
                var gvectors = gparser.readFeatures(JSON.parse(mainLayerData));
                this.mainLayer.getSource().clear();
                this.mainLayer.getSource().addFeatures(gvectors);
                if (isEdit) {
                    this.drawLayer.getSource().clear();
                    this.drawLayer.getSource().addFeatures(gvectors);
                }
                if (!this.props.isDrawActive) {
                    var extent = this.mainLayer.getSource().getExtent();
                    this.mapObj.getView().fit(extent);
                } else {
                    var extent = this.drawLayer.getSource().getExtent();
                    this.mapObj.getView().fit(extent);
                }
            }
        } catch (err) {
            console.error(err)
        }
    }

    render() {
        const { activeAction } = this.state;
        

        return (
            <div className="map-conatiner" style={this.props.activeStyles}>
                <div ref={ref => this.mapElm = ref} style={{ width: '100%', height: '500px', position: 'relative' }} >
                    {/* <OLMap style={{ width: '100%', height: '500px', position: 'relative' }} onInit={this.initMap}> */}
                    {
                        this.props.isDrawActive
                            ? <div className="map-canvas-toolbar">
                                <ButtonGroup size="sm" className="map-canvas-btn-grp">
                                    <Button className={`map-canvas-btn-tool map-canvas-btn${activeAction === 'Draw' ? ' active' : ''}`} value="Draw" onClick={() => this.onMapButtonClick("Draw")}>
                                        <i className="fa fa-pencil">
                                        </i>
                                    </Button>
                                    <Button className={`map-canvas-btn-tool map-canvas-btn${activeAction === 'Modify' ? ' active' : ''}`} value="Modify" onClick={() => this.onMapButtonClick("Modify")}>
                                        <i className="fa fa-edit">
                                        </i>
                                    </Button>
                                    <Button className={`map-canvas-btn-tool map-canvas-btn${activeAction === 'Delete' ? ' active' : ''}`} value="Delete" onClick={() => this.onMapButtonClick("Delete")}>
                                        <i className="fa fa-trash">
                                        </i>
                                    </Button>
                                    <Button className="map-canvas-btn-tool map-canvas-btn" value="Delete" onClick={this.deActivateDraw.bind(this)}>
                                        <i className="fa fa-times">
                                        </i>
                                    </Button>
                                </ButtonGroup>
                            </div> : null
                    }
                    {/* </OLMap> */}
                </div>
            </div>
        );
    }
}