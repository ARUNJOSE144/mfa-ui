import React, { Component } from 'react';
import TreeNode from './TreeNode';

class TreeView extends Component {
    constructor(props) {
        super(props);
        const state = {
            data: this.props.data || [],
            nodeInput: ""
        }
        this.state = state;
        this.onNodeSelect = this.onNodeSelect.bind(this);
        this.onEditClick = this.onEditClick.bind(this);
        this.onCreateClick = this.onCreateClick.bind(this);
        this.setNodeAction = this.setNodeAction.bind(this);
        this.setNodeInput = this.setNodeInput.bind(this);

        if (props.getStateData) {
            props.getStateData(this.passStateData.bind(this));
        }
    }

    componentWillReceiveProps(newProps) {
        if(this.props.data !== newProps.data){
            this.setState({data:newProps.data});
        }
    }

    passStateData() {
        return this.state
    }

    onNodeSelect(locId) {
        // _postRequest(PAGE_CONSTS.GET_NODE_URL, { locId }, (response) => {
        //     let { data } = this.state;
        //     if (response && response.resultCode == RESULT_CODES.SUCCESS) {
        //         let { locDetails } = response.childLocList;
        //         locDetails = locDetails.map((loc) => { loc.parentId = locId; loc.locationType = response.childLocType; return loc; });
        //         data = data.filter((obj) => { return obj.parentId !== locId });
        //         data.find((obj, i, arr) => {
        //             obj.locationId === locId
        //                 ? arr[i] = _.merge(arr[i], { locationName: response.locName, childLocationType: response.childLocType })
        //                 : null
        //         }
        //         );
        //         data = [...data, ...locDetails];    //data.concat(locDetails);
        //     }
        //     this.setState({ selected: locId, data, isEdit: false, isCreate: false });
        //     //this.props.onNodeSelectCall && this.props.onNodeSelectCall(response.locCoordinates);
        // });
        this.setState({ selected: locId, isEdit: false, isCreate: false });
        this.props.onNodeSelect(locId);
    }

    onEditClick(isEdit) {
        this.setState({ isEdit });
    }

    onCreateClick(parent,node) {
        
        this.props.onAddNodeClick(parent,node)
    }

    setNodeAction(action = 0, nodeInput = "", node={}) {
        const nodeActions = {
            isCreate: false,
            isEdit: false
        }
        switch (action) {
            case 1: // create action
                //nodeActions.isCreate = true;
                this.props.onAddNodeClick(this.state.selected, node)
                break;

            case 2: // edit action
                this.props.onNodeEditClick(this.state.selected)
                break;

            case 3: // delete action
                // const stateData = this.state;
                // _postRequest(PAGE_CONSTS.DELETE_NODE_URL, { locId: stateData.selected }, (response) => {
                //     if (response && response.resultCode == RESULT_CODES.SUCCESS) {
                //         let nodeParent = stateData.data.find(o => o.locationId === this.state.selected);
                //         console.log(nodeParent)
                //         this.onNodeSelect(nodeParent.parentId);
                //     }
                // });
                break;

            case 4:
                this.props.onNodeViewClick(this.state.selected)
                break;

            default:
                break;
        }
        this.setState({ ...nodeActions, nodeInput });
    }

    setNodeInput(nodeInput) {
        this.setState({ nodeInput });
    }

    render() {
        const { data } = this.state;
        return (
            <div className="tree-view">
                {
                    (data && data.length > 0)
                        ? <TreeNode
                            isEdit={this.state.isEdit}
                            onEditClick={this.onEditClick}
                            isCreate={this.state.isCreate}
                            onCreateClick={this.onCreateClick}
                            selected={this.state.selected}
                            nodes={[this.arrayToTree({ data })]}
                            onNodeSelect={this.onNodeSelect}
                            setNodeAction={this.setNodeAction}
                            nodeInput={this.state.nodeInput}
                            setNodeInput={this.setNodeInput}
                        //activateDraw={this.props.activateDraw}
                        /> : null
                }
            </div>
        );
    }

    arrayToTree({ data, root = 0 }) {
        var r;
        data.forEach(function (a) {
            const copy = { ...a };
            this[a.locationId] = {
                id: a.locationId,
                name: a.locationName,
                type: a.locationType,
                childType: a.childLocationType,
                children: this[a.locationId] && this[a.locationId].children
            };
            copy.isSelected && (this[a.locationId].isSelected = true);

            if (a.parentId === root) {
                r = this[a.locationId];
            } else {
                this[a.parentId] = this[a.parentId] || {};
                this[a.parentId].children = this[a.parentId].children || [];
                this[a.parentId].children.push(this[a.locationId]);
            }
        }, Object.create(null));
        return r;
    }
}

export default TreeView;
