import React, { Component } from 'react';
import { Context } from "../OLMap";

import Overlay from "ol/Overlay";
import {fromLonLat} from "ol/proj";

export default class Popup extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Context.Consumer>
                {context => <PopupComponent context={context} {...this.props} />}
            </Context.Consumer>
        )
    }

}

class PopupComponent extends Component {

    popupRef = React.createRef();

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.mapElm = this.props.context.mapElm;
        this.addToClick = this.props.context.addToClick;
        this.addPopup();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps != this.props) {
            this.mapElm = this.props.context.mapElm;
            this.addPopup();
        }
    }

    addPopup = () => {
        const { coordinates, theme = {} } = this.props;
        if (typeof (this.mapElm) === 'undefined') return;

        if (this.popup) { this.mapElm.removeOverlay(this.popup) };

        this.popup = new Overlay({
            element: this.popupRef.current,
            positioning: theme.placement === 'bottom' ? 'top-center' : 'bottom-center',
            stopEvent: false,
            offset: theme.placement === 'bottom' ? [0, 15] : [0, -35]
        });

        this.popup.setPosition(Array.isArray(coordinates) ? fromLonLat(coordinates) : undefined);
        this.mapElm.addOverlay(this.popup);
    }

    applyStyleTheme = () => {
        const styles = {
            contentContainer: {
                "boxShadow": "0 3px 14px rgba(0,0,0,0.4)",
                "padding": "5px",
                "borderRadius": "3px"
            },
            tipContainer: {
                "width": "40px",
                "height": "20px",
                "position": "absolute",
                "left": "50%",
                "marginLeft": "-20px",
                "overflow": "hidden",
                "pointerEvents": "none"
            },
            tip: {
                "width": "17px",
                "height": "17px",
                "padding": "1px",
                "margin": "-10px auto 0",
                "WebkitTransform": "rotate(45deg)",
                "MozTransform": "rotate(45deg)",
                "MsTransform": "rotate(45deg)",
                "OTransform": "rotate(45deg)",
                "transform": "rotate(45deg)"
            }
        }

        const { theme = {} } = this.props;
        styles.contentContainer.background = theme.background ? theme.background : "white"
        styles.tip.background = theme.background ? theme.background : "white"

        if (theme.placement === 'bottom') {
            styles.tipContainer.bottom = '100%'
            styles.tipContainer.height = '10px'
            styles.tip.margin = '4px auto 0px'
        }

        return styles;
    }

    render() {
        const styles = this.applyStyleTheme();
        return (
            <div ref={this.popupRef}>
                <div style={styles.contentContainer}>
                    {this.props.children}
                </div>
                <div style={styles.tipContainer}>
                    <div style={styles.tip}></div>
                </div>
            </div>
        )
    }

}