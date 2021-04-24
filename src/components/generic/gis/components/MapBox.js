import React, { Component } from 'react';
import OLMap from './OLMap';
import Vector from "./layers/Vector";
import Marker from "./layers/Marker";

import GeoJSON from "./data.json";

export default class MapBox extends Component {

    state = {
        geojson: GeoJSON.qatar,
        markers: [{lonlat:[45,15]}]
    }

    constructor(props) {
        super(props);
    }

    handleVectorClick = () => {
        this.setState({geojson: GeoJSON.india})
    }

    handleMarkerClick = () => {
        const { markers } = this.state;
        this.setState({
            markers: markers.map(marker => {
                return { lonlat: [marker.lonlat[0] + 5, marker.lonlat[1] + 5] }
            })
        })
    }

    render() {
        return (
            <OLMap style={{ height: '300px' }}>
                <Vector geojson={this.state.geojson} onClick={this.handleVectorClick} properties={{ locId: 1 }} />
                <Marker markers={this.state.markers} onClick={this.handleMarkerClick} style={{imageSrc:`${process.env.PUBLIC_URL}/images/icons/map-marker-blue.svg`}}/>
                {/* <Vector geojson={GeoJSON.india} fitToView={true} /> */}
            </OLMap>
        )
    }

}