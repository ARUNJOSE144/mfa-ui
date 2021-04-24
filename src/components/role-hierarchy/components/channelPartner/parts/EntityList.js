import React, { Component } from 'react';
import { Badge } from 'reactstrap';
import ChildList from './ChildList';
import _ from 'lodash';

// const childList = [
//     {
//         id: 12,
//         name: 'entity 12',
//     },
//     {
//         id: 24,
//         name: 'entity 24',
//     },
//     {
//         id: 35,
//         name: 'entity 35',
//     }
// ]

export default class EntityList extends Component {

    constructor(props) {
        super(props);
        const { firstNode } = this.props;
        this.state = {
            selected: firstNode && firstNode.id,
            mainList: firstNode && firstNode.id ? [firstNode] : []
        };
    }

    handleonNodeSelect = (entity, index) => {
        const { mainList } = this.state;
        this.setState({ selected: entity.id, mainList: this.state.mainList.splice(0, index + 1) }, () => {
            this.props.onNodeSelect && this.props.onNodeSelect(entity)
        });
    }

    handleChildNodeClick = node => {
        const { mainList } = this.state;
        mainList.push(node);
        this.setState({ selected: node.id, mainList }, () => {
            const selectedNode = _.find(mainList, { id: this.state.selected });
            this.props.onNodeSelect && this.props.onNodeSelect(selectedNode)
        });
    }

    style = {
        button: { width: '10px', textAlign: 'center' }
    }

    renderNode = (entity, index) => {
        const isSelected = entity.id === this.state.selected;
        const { mainNodeComponent: MainNodeComponent } = this.props;

        if (MainNodeComponent) {
            return (
                <li key={entity.id}>
                    <MainNodeComponent {...{ entity, index, isSelected, handleNodeClick: evt => this.handleonNodeSelect(entity, index) }} />
                </li>
            )
        }

        return <li key={entity.id}>
            <div onClick={evt => this.handleonNodeSelect(entity, index)} className="c-pointer">
                <div>
                    <span className={`${isSelected ? 'text-primary' : ''}`}>{entity.name}</span>
                </div>
            </div>
        </li>
    }

    render() {
        const { mainList, selected } = this.state;
        const { title, childList } = this.props;
        const selectedNode = _.find(mainList, { id: selected });
        return (
            <div className="border-custom bg-white">
                <div className="px-2 py-2 border border-left-0 border-right-0 border-top-0">
                    <span className="text-primary">
                        {title}
                    </span>
                </div>
                <div className="scrollbar" style={{ height: '510px', overflow: 'auto' }}>
                    <div className="list-view">
                        <ul className="border border-top-0 border-left-0 border-right-0">
                            {
                                mainList.map((entity, index) => this.renderNode(entity, index))
                            }
                        </ul>
                    </div>
                    <div className="m-2">
                        {
                            childList && childList.length > 0 && <ChildList
                                titleComponent={this.props.childTitleComp}
                                nodeComponent={this.props.childNodeComp}
                                onNodeClick={this.handleChildNodeClick}
                                list={childList}
                                title={selectedNode && selectedNode.name}
                            />
                        }
                    </div>
                </div>
            </div>
        )
    }

}