import React, { Component, useState} from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Badge,
  Tooltip
} from "reactstrap";
import {Link} from "react-router-dom";
import _ from 'lodash';

class Header extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.tooltipToggle = this.tooltipToggle.bind(this);
    this.revokeObject = this.revokeObject.bind(this);
    this.state = {
    };
  }

  toggle(id) {
    this.setState({
      [`dropdownOpen_${id}`]: !this.state[`dropdownOpen_${id}`]
    });
  }
  
  tooltipToggle (id) {
    this.setState({
      [`tooltipOpen_${id}`]: !this.state[`tooltipOpen_${id}`]
    });
  }

  revokeObject (id) {
    console.log("REVOKE CALLLED", id);
    const urlObjects = _.filter(this.props.header.notificationItems, (o) => o.id == id);
    let timeout = null;
    if(urlObjects && urlObjects.length > 0) {
      timeout = setTimeout(() => {
        console.log("REVOKING URL =>",urlObjects[0].url);
        window.URL.revokeObjectURL(urlObjects[0].url); 
        if(timeout != null)
          clearTimeout(timeout);
      }, 10000);
    }else 
      console.log("URL NOT REVOKED =>",id);
    this.props.removeFromExport(id);
  }

  render() {
    const getHeaderItems = () => {
      return this.props.items.map((item) => {
        switch (item.type) {
          case 1://Button Type
            // return (
              // <li key={item.id} className="nav-item">
              //   <a className="nav-link" onClick={()=>this.props.onHeaderItemClick(item.id, 0)}  style={{ cursor: "pointer" }}>
              //     <i className={`fa ${item.icon} notif-menu-drawer`}/>
              //   </a>
              // </li>
            // )
            const getNotificationItems = (subItems) => {
              /*[{
                id: 1,
                message: "Transaction Report",
                url: 324567uhygtrfde2345t6y7t4gf3ds2345t6y7h4gf3d2e
                downloadable: true
              }]*/
              const buttonStyle = {
                marginLeft: '10px', width: '28%', textAlign: 'right'
              }
              const messageStyle = { overflow: 'hidden', textOverflow:'ellipsis', width: '70%' };
              if(subItems && subItems.length > 0) {
                return subItems.map((subItem, index) => {
                  if(!subItem.downloadable) {
                    buttonStyle.marginLeft = '0px';
                    buttonStyle.width = '1%';
                    messageStyle.width = '98%';
                  }
                  if(subItem.downloadable){
                    return (
                      <DropdownItem key={subItem.id} onClick={() => this.revokeObject(subItem.id)}>
                        <div className="header_cogs d-flex align-items-center">
                          <div className="float-left" style={messageStyle}>{subItem.message}</div>
                          <div className="float-left" style={buttonStyle}>
                            {
                              subItem.downloadable ? 
                              <a href={subItem.url} className="btn btn-info btn-sm" download={subItem.message} id={`downloader-${subItem.id}`}>
                                <i className="fa fa-download" />
                              </a> : null
                            }
                            <Tooltip placement="left" isOpen={this.state[`tooltipOpen_${subItem.id}`]} autohide={false} target={`downloader-${subItem.id}`} toggle={() => this.tooltipToggle(subItem.id)}>
                              { subItem.downloadable ? `Download ${subItem.message}` : subItem.message }
                            </Tooltip>
                          </div>
                        </div>
                      </DropdownItem>
                    );
                }else {
                     switch(subItem.type){
                       case "Redirect":
                          return (
                            <Link to={subItem.url}> 
                              <DropdownItem key={subItem.id} >
                                <div className="header_cogs d-flex align-items-center">
                                  <div className="float-left" style={messageStyle}>{subItem.message}</div>
                                </div>
                              </DropdownItem>
                           </Link> 
                          );
                         default: 
                            return (
                              <DropdownItem key={subItem.id} >
                                <div className="header_cogs d-flex align-items-center">
                                  <div className="float-left" style={messageStyle}>{subItem.message}</div>
                                </div>
                              </DropdownItem>
                            );
                     }
                  } 
                });
              }else {
                return (
                  <div className="header_cogs d-flex align-items-center">
                    <div className="float-left">No Notifications</div>
                  </div>
                );
              }
            }
            const count = this.props.header.notificationItems && this.props.header.notificationItems.length > 0 ? this.props.header.notificationItems.length : 0;
            let badgeStyle = { ...STYLE.badgeStyle };
            if(count < 10)
              badgeStyle.right = '18px';
            return (
              <li key={item.id} className="nav-item">
                <Dropdown isOpen={this.state[`dropdownOpen_${item.id}`]} toggle={()=>this.toggle(item.id)}>
                  <DropdownToggle className="nav-link nav-link" nav>
                    <div className="user-ico">
                      <i className={(this.props.header.notificationItems && this.props.header.notificationItems.length > 0) ? 
                        `fa ${item.animatedIcon}` : `fa ${item.icon}`}/>
                      {
                        count > 0 ?
                        <Badge color='light' style={badgeStyle}>{count > 9 ? "9+" : count}</Badge> : 
                        null
                      }
                    </div>
                  </DropdownToggle>
                  <DropdownMenu right>
                    <div className="triangle-up" />
                    {getNotificationItems(this.props.header.notificationItems)}
                  </DropdownMenu>
                </Dropdown>
              </li>
            );
            break;
          case 2://Dropdown Type
            const getDropdownItems = (menuId, subItems) => {
              return subItems.map((subItem, index) => {
                return (
                  <DropdownItem key={index} tag="a" href="javascript:void(0)" onClick={()=>this.props.onHeaderItemClick(menuId, subItem.id)}>
                    <div className="header_cogs d-flex align-items-center">
                      <div className="float-left ico">
                        <i className={`fa ${subItem.icon}`}/>
                      </div>
                      <div className="float-left">{subItem.name}</div>
                    </div>
                  </DropdownItem>
                );
              });
            }
            return (
              <li key={item.id} className="nav-item">
                <Dropdown isOpen={this.state[`dropdownOpen_${item.id}`]} toggle={()=>this.toggle(item.id)}>
                  <DropdownToggle className="nav-link nav-link" nav>
                    <div className="user-ico">
                      <i className={`fa ${item.icon}`}/>
                    </div>
                  </DropdownToggle>
                  <DropdownMenu right>
                    <div className="triangle-up" />
                    <div className="header_fullName d-flex align-items-center primary-color">
                      <div className="float-left ico">
                        <i className={`fa ${item.subIcon}`}/>
                      </div>
                      <div
                        className="float-left setOverflow"
                        title={item.subHeader}
                      >
                        {item.subHeader}
                      </div>
                    </div>
                    {getDropdownItems(item.id, item.subItems)}
                  </DropdownMenu>
                </Dropdown>
              </li>
            )
            break;
          default:
            break;
        }
      });
    }
    return (
      <header className="app-header navbar primary-background">
        <div>
          <div className="menu-toggle d-flex align-items-center" onClick={() => this.props.toggleSideNav()}>
            <span className="menu-toggle-ico">
              <i className="fa fa-bars"/>
              {/* <i className="fa sd-icon-hamburger-menu" /> */}
            </span>
          </div>
          <div className="page-heading d-flex align-items-center">
            {this.props.header && this.props.header.name
              ? this.props.header.name
              : "Dashboard"}
          </div>
        </div>

        <div className="d-flex align-items-center">
          <ul className="nav navbar-nav ml-auto">
            {getHeaderItems()}
          </ul>
        </div>
      </header>
    );
  }
}

export default Header;


const STYLE = {
  badgeStyle: {
      fontSize: '11px',
      position: 'absolute',
      right: '12px',
      backgroundColor: 'red',
      color: 'white'
  }
};