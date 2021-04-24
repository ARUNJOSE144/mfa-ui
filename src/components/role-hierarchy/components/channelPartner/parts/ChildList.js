import React, { Component } from 'react';
// import {
//     UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem
// } from 'reactstrap';

export default class ChildList extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    handleNodeClick = (node, evt) => {
        this.props.onNodeClick(node)
    }

    render() {
        const { list = [], nodeComponent: NodeComponent, titleComponent: TitleComponent } = this.props;
        return (
            <div>
                <div className="d-flex list-view-header">
                    <div className="text-center header-bullet align-vertical-middle">
                        <i className="fa fa-caret-down text-white "></i>
                    </div>
                    {
                            TitleComponent
                            ? <TitleComponent title={this.props.title}/>
                            : <div className="align-vertical-middle text-primary">
                                <span className="pl-2 d-block">{this.props.title}</span>
                              </div>
                        }
                    
                </div>
                <div className="list-view-spaced">
                    <ul>
                        {
                            list.map(item => <li key={item.id}>
                                {
                                    NodeComponent
                                        ? <NodeComponent
                                            item={item}
                                            handleNodeClick={ev => this.handleNodeClick(item, ev)}
                                        />
                                        : <div>
                                            {/* <span className="float-right c-pointer">
                                                {this.renderMenu(item)}
                                            </span> */}
                                            <span onClick={ev => this.handleNodeClick(item, ev)} className={`c-pointer w-100 d-block${this.state.isSelected ? ' bg-primary text-white' : ''}`}>
                                                {item.name}
                                            </span>
                                        </div>
                                }
                            </li>)
                        }
                    </ul>
                </div>
            </div>
        )
    }
}