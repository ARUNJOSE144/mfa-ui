import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Collapse } from 'reactstrap';
import NavLink from './link/NavLink';
import { Link } from "react-router-dom";
import _ from 'lodash';

class SideMenu extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.renderMenus = this.renderMenus.bind(this);
    this.checkPrivilages = this.checkPrivilages.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    const currentPath = this.props.currentPath;
    const selectedMenu = _.find((_.union(this.props.menus,
      ..._.map(this.props.menus, 'submenus'))),
      function (o) { if (!o.linkTo) return false; return currentPath.substring(0, o.linkTo.length) === o.linkTo }) ?
      _.find((_.union(this.props.menus,
        ..._.map(this.props.menus, 'submenus'))),
        function (o) { if (!o.linkTo) return false; return currentPath.substring(0, o.linkTo.length) === o.linkTo }).id : 1;

    this.state = { "windowHeight": 0, selectedMenu, openedMenu: null, firstLoad: true };
    this.redirect = this.redirect.bind(this);
  }

  redirect(menu, link) {
    this.setState({ selectedMenu: menu.id });
    this.props.setHeaderOnClick(menu);
    this.props.route(menu.id, link);

  }
  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  updateWindowDimensions() {
    this.setState({ "windowHeight": window.innerHeight });
  }


  toggle(id) {
    const openedMenu = this.state.openedMenu === id ? null : id;
    this.setState({ openedMenu, firstLoad: false });
  }

  checkPrivilages(menuPrivilages) {
    if (menuPrivilages && menuPrivilages.length > 0) {
      const diff = _.difference(menuPrivilages, this.props.privilages, _.isEqual);
      if (_.isEqual(diff.sort(), menuPrivilages.sort())) {
        //No Privilages available for this menu
        return false;
      }
    }
    return true;
  }



  renderMenus(menus, isSubmenu) {
    return menus && Array.isArray(menus) ? (
      menus.map(
        menu => {
          if (menu.privilages && menu.privilages.length > 0) {
            if (this.checkPrivilages(menu.privilages) === false)
              return false;
          }
          var isSelectParent = false;
          if (menu.submenus && menu.submenus.length > 0) {
            let subMenuPrivilages = [];
            menu.submenus.forEach(
              submenu => {
                if (submenu.privilages) {
                  subMenuPrivilages.push(...submenu.privilages);
                }
                if (window.location.pathname.substring(0, submenu.linkTo.length) === submenu.linkTo) {
                  isSelectParent = true;
                }
              }
            );
            if (this.checkPrivilages(subMenuPrivilages) === false)
              return false;
          }

          return (
            <ListGroupItem key={menu.id}>
              {
                menu.submenus && Array.isArray(menu.submenus) ?
                  [
                    <a className={(this.state.firstLoad && isSelectParent ? "selected opened" : (this.state.openedMenu === menu.id ? "opened" : ""))} onClick={() => this.toggle(menu.id)} key={`anchor-${menu.id}`}>
                      <span >
                        <i className={`fa ${menu.icon} menu-icon`} />
                        {menu.label}
                      </span>
                      <i className="fa fa-angle-right submenu-icon"
                        {...((this.state.firstLoad && isSelectParent) || this.state.openedMenu === menu.id ? { style: { transform: 'rotate(90deg)' } } : {})}
                      ></i>
                    </a>,
                    <Collapse isOpen={(this.state.firstLoad && isSelectParent) || this.state.openedMenu === menu.id} key={`submenu-${menu.id}`} >
                      <ListGroup className="side-submenu-item">
                        {this.renderMenus(menu.submenus, true)}
                      </ListGroup>
                    </Collapse>
                  ] :
                  <NavLink menu={menu} redirect={this.redirect} selectedMenu={this.state.selectedMenu} isSubmenu={isSubmenu} />
              }
            </ListGroupItem>
          )
        }
      )
    ) : (false)
  }

  render() {
    const sideNavSubStyle = {
      height: this.state.windowHeight - 118
    };
    return (
      <div>
        <div className="logo-div primary-color text-center">
          <Link to={this.props.redirectPath || "/"}><img src={this.props.logo} alt="6d Technlogies" /></Link>
        </div>
        <div style={sideNavSubStyle} className="side-nav-menu-in scrollbar">
          <ListGroup className="side-menu-item">
            {this.renderMenus(this.props.menus, false)}
          </ListGroup>
        </div>
        <div style={{ height: '10px' }}>
        </div>
        {this.props.isFooterDiv ?
          <div className="menu_footer text-center">
            {this.props.footerText}
          </div> : <div className="menu_footer text-center" style={{ display: 'none' }}>
          </div>
        }

      </div>
    );
  }
}

export default SideMenu;
