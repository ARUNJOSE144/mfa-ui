import React, { Component } from 'react';
import OrgChart from 'react-orgchart';
// import 'react-orgchart/index.css';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';

class SummaryView extends Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.onNodeSelect = this.onNodeSelect.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        // _postRequest(this.props.const_SalesHierarchy.LIST_URL, {}, (response) => {
        //     let data = [];
        //     if (response && response.resultCode === RESULT_CODES.SUCCESS) {
        //         const { channelTypeNodes } = response;
        //         data = this.convertTreeData(channelTypeNodes);
        //         console.log(data);
        //     }
        //     this.setState({ data });
        // }, { method: 'GET',isShowSuccess: false });
    }

    convertTreeData(treeData) {
        const realData = {};
        realData.name = treeData.nodeName;
        realData.nodeId = treeData.nodeId;
        realData.parentNodeId = treeData.parentNodeId;
        realData.type = treeData.type;
        // const roles = [];
        realData.roles = treeData.roles && treeData.roles.map(role => { return { roleId: role.value } });
        realData.children = treeData.children && treeData.children.map(child => this.convertTreeData(child));
        return realData;
    }

    updateWindowDimensions() {
        this.setState({ windowHeight: window.innerHeight });
    }

    onNodeSelect(node) {
        const selected = this.state.selected === node.nodeId ? null : node.nodeId
        this.setState({ selected })
    }

    getNodeMenu = (node, parent, index) => {
        const { privilages } = this.props;

        console.log(node);


        return (<UncontrolledDropdown>
            <DropdownToggle tag="div">
                <img src={`${process.env.PUBLIC_URL}/images/icons/menu-o-sm.svg`} alt="" />
            </DropdownToggle>
            <DropdownMenu right className="fs-13 org-node-dropdown">
                {/* 
                    {
                        !privilages || privilages.create === true && */}
                <DropdownItem onClick={() => this.props.onAddNodeClick(node.nodeId, node, false)}>
                    Add Role
                        </DropdownItem>
                {/*   } */}

                {/*  {
                        !privilages || privilages.create === true && */}
                <DropdownItem onClick={() => this.props.onAddNodeClick(node.nodeId, node, true)}>
                    Add Role In Between
                        </DropdownItem>
                {/*  } */}

                {/*   {!privilages || privilages.delete === true && node.parentNodeId !== 0 && */} <DropdownItem className="text-danger" onClick={() => this.props.onDeleteNodeClick(node.nodeId, node)}>Delete Role</DropdownItem>{/* } */}
            </DropdownMenu>
        </UncontrolledDropdown>)

    }

    getNodeCLass(type, isSelected) {
        if (isSelected) return 'org-node-selected';

        if (type === 1)
            return 'org-node-type-1';
        else if (type === 2)
            return 'org-node-type-2';

        return;
    }

    render() {

        // const height = {
        //     height: this.state.windowHeight - 50
        // }

        const NodeComponent = ({ node }) => {
            const isSelected = node.nodeId === this.state.selected;
            let nodeClass = this.getNodeCLass(node.type, isSelected);

            return (
                <div className={`org-node${nodeClass ? ' ' + nodeClass : ''}`} {...!isSelected ? { onClick: () => this.onNodeSelect(node) } : {}}>
                    <table className="w-100">
                        <tbody>
                            <tr>
                                <td className="px-2">
                                    <span>{node.name}</span>
                                </td>
                                {isSelected && this.props.mode=="edit" && <td>{this.getNodeMenu(node)}</td>}
                            </tr>
                        </tbody>
                    </table>
                </div>
            );
        };

        return (
            // <ModalBody className="hierarchy-modal-body">
            //     <div className="overlay_position scrollbar" style={height}>
            //         <div className="org-view-container" id="orgViewSalesHierarchy">
            //             {this.state.data && <OrgChart tree={this.state.data} NodeComponent={NodeComponent} />}
            //         </div>
            //     </div>
            // </ModalBody>
            <div className="overlay_position scrollbar">
                <div className="org-view-container" id="orgViewSalesHierarchy">
                    {this.props.data && <OrgChart tree={this.convertTreeData(this.props.data)} NodeComponent={NodeComponent} />}
                </div>
            </div>
        );

    }

}

export default SummaryView;
