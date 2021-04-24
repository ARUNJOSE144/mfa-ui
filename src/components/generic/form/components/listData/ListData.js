import React, { Component } from 'react';
import IconDropDownMenu from '../../elements/dropDownMenu/IconDropDownMenu';

export default class ListData extends Component {
    constructor(props) {
        super(props);
        this.state={
            menuList : [],
        }
        this.getMenus = this.getMenus.bind(this);
    }

    componentDidMount() {
        if(this.props.dropDwnMenuList)
            this.getMenus();
    }

    getMenus(){
        let menuList = [];
        this.props.dropDwnMenuList.forEach( menu => {
           const temp = {
                label : menu.label,
                handleClick : () => this.props.triggerFunc({type: menu.type, data: this.props.selectedItem })
            }
            menuList.push(temp);
        });
        this.setState({menuList})
         
    }


    render(){
        return(
            <div className="list-data-div">
                <div className="px-2 py-2 list-title-header">
                    <div style={{ display: "flex" }}>
                        <div className="list-title">{this.props.title} </div>
                        <div className="ml-2 list-data-count">
                            <div className="list-count">{this.props.count}</div>
                        </div>
                  </div> 
                </div>
                <div className="px-3 py-2 list-search">
                    <div style={{ display: "flex" }}>
                        <div style={{ display: "flex" }} className="px-2 py-1 list-search-box">
                            {/* <div className="search-text">Search</div> */}
                            <input style={{border:"none"}} type="text" placeholder="Search" onChange={this.props.onSearch}/>
                            <div className="search-icon">
                                <i class="fa fa-search" aria-hidden="true"></i>
                            </div>
                        </div>
                        {this.props.hasCreate && <div className="c-pointer list-add"
                                onClick={() => this.props.triggerFunc({ type: 2, data: null })}>
                            <i class="fa fa-plus-circle "></i>
                        </div>}
                    </div>
                </div>
                <div className="list-view list-scrollbar">
                    { this.props.count >0 ?
                    <ul className="m-0" style={{ height: '510px' }}>
                        {
                            this.props.values && this.props.values.map(
                                obj => <li
                                            key={obj.id}
                                            onClick={() => {this.props.triggerFunc({type: 1, data: obj })}}
                                            className={(this.props.selectedItem && this.props.selectedItem.id === obj.id ? 'list-data-selected' : 'list-data')}
                                        >
                                    <div className="c-pointer px-3">
                                        <table className="w-100">
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <div>
                                                            <span className={(this.props.selectedItem && this.props.selectedItem.id === obj.id ? 'data-selected' : 'data-list')}>
                                                                {obj.label}
                                                            </span>
                                                        </div>
                                                        { obj.subLabel && <div>
                                                            <span className="fs-10" style={{ lineHeight: 1 }}>
                                                                {obj.subLabel}
                                                            </span>
                                                        </div>}
                                                    </td>
                                                    <td>
                                                        {this.state.menuList.length > 0 ?
                                                           <span className="float-right c-pointer">
                                                                <IconDropDownMenu
                                                                    menus={this.state.menuList}
                                                                    color="primary"
                                                                />
                                                            </span>
                                                            : ''
                                                        }
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </li>
                            )
                        }
                    </ul>
                    : <div class="text-center">No Data!</div> }
                </div>
            </div>
        )
    }
}