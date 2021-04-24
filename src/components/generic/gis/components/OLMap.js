import React, { Component } from 'react';
import Vector from "./layers/Vector";
import utils from "./utils.js";

import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import OSM from 'ol/source/OSM';
import { unByKey } from "ol/Observable";

import 'ol/ol.css';

export const Context = React.createContext();

export default class OLMap extends Component {

    constructor(props) {
        super(props);
    }

    mapEvents = {
        onPointerMove: { name: 'pointermove' },
        onClick: { name: 'click' }
    }

    componentDidMount() {
        this.initMap();
        this.bindEvents();
    }

    componentDidUpdate() {
        this.bindEvents();
    }



    initMap = () => {
        const center = this.props.center ? this.props.center : [0, 0];
        const zoom = this.props.zoom ? this.props.zoom : [0, 0];

        this.map = new Map({
            layers: [
                new TileLayer({
                    source: new OSM()
                })
            ],
            target: this.mapElm,
            view: new View({ center: center, zoom: zoom })
        });

        this.props.onInit && this.props.onInit(this.map);
    }

    bindEvents = () => {
        const { mapEvents, map } = this;
        for (const key in mapEvents) {
            if (mapEvents.hasOwnProperty(key)) {
                const handlerFunction = this.props[key];
                if (mapEvents[key].eventKey) {
                    unByKey(this.clickEventKey)
                };
                if (handlerFunction) {
                    mapEvents[key].eventKey = map.on(mapEvents[key].name, handlerFunction);
                }
            }
        }
    }

    render() {
        return (

            <div ref={ref => this.mapElm = ref} style={this.props.style} >
                <Context.Provider value={{ mapElm: this.map, addToClick: this.addclickLayer, removeFromClick: this.removeclickLayer }}>
                    {this.props.children}
                </Context.Provider>
            </div>

        )
    }

}