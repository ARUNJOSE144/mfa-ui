import React, { Component } from 'react';
import { Badge } from 'reactstrap';

const treeData = [
    {
        name: 'entity 1',
        children: [
            {
                name: 'entity 11',
                children: [
                    {
                        name: 'entity 111',
                        children: [
                            {
                                name: 'entity 1111',
                                children: []
                            }
                        ]
                    },
                    {
                        name: 'entity 112',
                        children: [
                            {
                                name: 'entity 1121',
                                children: []
                            }
                        ]
                    }
                ]
            },
            {
                name: 'entity 12',
            }
        ]
    },
    {
        name: 'entity 2',
    }
]

class Node extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        };
    }

    handleNodeClick = evt => this.setState({ isOpen: !this.state.isOpen })

    style = {
        openedSpan: { borderBottom: '1px solid #EEEEEE' },
        openedUl: { maxHeight: '1000px', opacity: 1 },
        closedUl: { opacity: 0, maxHeight: '0px' },
        button: {width: '10px', textAlign: 'center'}
    }

    render() {
        const { nodeData } = this.props;
        const { isOpen } = this.state;
        const spanStyle = nodeData.children && nodeData.children.length && isOpen ? this.style.openedSpan : {};
        const ulStyle = isOpen ? this.style.openedUl : this.style.closedUl;
        return (
            <li>
                <span style={spanStyle}>
                    <span className={`${isOpen ? 'text-primary' : ''}`}>{nodeData.name}</span>
                    <span className="float-right fs-14 c-pointer" style={this.style.button} onClick={this.handleNodeClick}>
                        {/* {isOpen ? <span>&times;</span> : <i className="fa fa-angle-down" />} */}
                        {
                            isOpen
                            ? <img src={`${process.env.PUBLIC_URL}/images/icons/close.svg`}/>
                            : nodeData.children && nodeData.children.length > 0 && <img src={`${process.env.PUBLIC_URL}/images/icons/arrow-right.svg`}/>
                        }
                    </span>
                </span>
                {
                    nodeData.children && nodeData.children.length > 0 && <ul style={ulStyle}>
                        {nodeData.children.map(node => <Node nodeData={node} />)}
                    </ul>
                }
            </li>
        )
    }

}

export default class EntityList extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="border-custom bg-white " style={{ minHeight: '540px' }}>
                <div className="px-2 py-2 border border-left-0 border-right-0 border-top-0">
                    <span className="text-primary">
                        Entities <Badge pill>120</Badge>
                    </span>
                </div>
                <div className="tree-view-secondary">
                    <ul className="border border-top-0 border-left-0 border-right-0">
                        {
                            treeData.map(node => <Node nodeData={node} />)
                        }
                    </ul>
                </div>
            </div>
        )
    }

}