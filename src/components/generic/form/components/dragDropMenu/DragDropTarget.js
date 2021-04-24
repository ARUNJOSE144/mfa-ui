import React, { Component } from 'react';
import { DropTarget } from 'react-drag-drop-container';

export default class DragDropTarget extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <DropTarget
                targetKey={this.props.targetKey ? this.props.targetKey : "dragKey"}
                onDragEnter={this.props.onDragEnter}
                onDragLeave={this.props.onDragLeave}
                onHit={this.props.dropped} >
                {this.props.children}
            </DropTarget>
        );
    }
}