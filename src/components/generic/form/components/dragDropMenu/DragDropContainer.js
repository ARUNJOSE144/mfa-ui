import React, { Component } from 'react';
import { Collapse, ListGroup, ListGroupItem } from 'reactstrap';
import { DragDropContainer } from 'react-drag-drop-container';

export class DragDropItem extends Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = { isOpen: false };
    }
    toggle() {
        this.setState({ isOpen: !this.state.isOpen })
    }

    render() {
        const { listItem, iconClass, isDraggableContent } = this.props;
        return (
            <ListGroupItem key={listItem.id} className={this.state.isOpen ? "selectedItem" : ''}>
                {listItem.children && Array.isArray(listItem.children) && listItem.children.length > 0 ?
                    [
                        <a className="list-icon px-2"
                            onClick={() => this.toggle()} key={`anchor-${listItem.id}`}>
                            <i className={this.state.isOpen ? iconClass : "fa fa-folder" }></i>
                            <span className="pl-2">
                                {listItem.label}
                            </span>
                            <i className="fa fa-angle-right submenu-icon"
                                {...(this.state.isOpen ? { style: { transform: 'rotate(90deg)' } } : {})}
                            ></i>
                        </a>,
                        <Collapse isOpen={this.state.isOpen} key={`submenu-${listItem.id}`}>
                            <ListGroup key={listItem.id} className="list-submenu-item">
                                {listItem.children.map((item, i) =>
                                    <DragDropItem key={i}
                                        {...this.props}
                                        listItem={item}
                                        iconClass="fa fa-folder-open" />
                                )}
                            </ListGroup>
                        </Collapse>
                    ] : <div className="draggable-div" onClick={() => this.props.onClick(listItem)}>
                        <div className="list-draggable c-pointer">
                            {isDraggableContent && <DragDropContainer
                                targetKey={this.props.targetKey ? this.props.targetKey : "dragKey"}
                                dragData={listItem}
                                onDragStart={this.props.onDragStart}
                                onDrop={this.props.onDrop}
                                returnToBase={true} >
                                <div className="draggable-item"> 
                                    <span>{listItem.label}</span>
                                </div>
                            </DragDropContainer>
                            }{!isDraggableContent && <div>
                                <span>{listItem.label}</span>
                            </div>
                            }
                        </div>
                    </div>
                }
            </ListGroupItem>
        )
    }
}

export default class TreeMenu extends Component{
    render() {
        return (
                <ListGroup className="list-menu-item">
                    {this.props.listItems.map((item, i) => 
                        <DragDropItem key={i}
                            listItem={item} 
                            iconClass="fa fa-folder-open" 
                            isDraggableContent={this.props.isDraggableContent} 
                            targetKey={this.props.targetKey}
                            onClick={this.props.onClick}
                        />)
                    }
                </ListGroup>
        );
    }
}